import { betterAuth, BetterAuthOptions } from 'better-auth';
import { db, eq, schema } from '@designr/db'
import { organization, customSession } from "better-auth/plugins"
import { drizzleAdapter } from './drizzle-adapter';
import { userSettingsDefaults } from '@designr/db/user-settings';
const pluginOptions = {

    plugins: [
        organization({
            allowUserToCreateOrganization(user) {
                // if the user is on a free account and created 5 organizations prevent them
                return true
            },
            schema: {
                organization: {
                    modelName: 'organizations'
                },
                member: {
                    modelName: 'members',
                }

            },
            cancelPendingInvitationsOnReInvite: true,
        }),
    ]
} satisfies BetterAuthOptions;
export const auth = betterAuth({
    appName: "Designr",
    advanced: {
        database: {
            generateId: false,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 10 * 60
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    user: {
        modelName: 'users',
        fields: {
            image: 'imageUrl',
        },
        deleteUser: {
            enabled: true
        }
    },
    database: drizzleAdapter(db, {
        provider: 'pg',
        //usePlural: true,
        schema
    }),
    plugins: [
        ...(pluginOptions.plugins ?? []),
        customSession(async ({ user, session }) => {
            const res = await db
                .select({
                    plan: schema.subscriptions.plan
                })
                .from(schema.subscriptions)
                .where(eq(schema.subscriptions.userId, user.id))
                .limit(1)
            const isPro = res?.[0]?.plan === 'PRO'
            return {
                user: {
                    ...user,
                    isPro
                },
                session
            };
        }, pluginOptions),
    ],
    databaseHooks: {
        user: {
            create: {
                after: async (details) => {
                    const orgs = await db.insert(schema.organizations).values({
                        id: details.id,
                        name: 'Personal',
                        slug: details.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        logo: details?.image
                    }).returning();
                    const org = orgs[0];
                    await db.insert(schema.members).values({
                        organizationId: org.id,
                        userId: details.id,
                        email: details.email,
                        role: 'owner',
                    })
                    await db.insert(schema.userSettings).values({
                        userId: details.id,
                        settings: JSON.stringify(userSettingsDefaults)
                    })
                    await db.insert(schema.subscriptions).values({
                        active: true,
                        plan: 'FREE',
                        userId: details.id
                    })
                }
            }
        }
    }
})