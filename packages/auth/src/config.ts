import { betterAuth, BetterAuthOptions } from 'better-auth';
import { and, db, eq, schema, sql } from '@designr/db'
import { organization, customSession } from "better-auth/plugins"
import { drizzleAdapter } from './drizzle-adapter';
import { userSettingsDefaults } from '@designr/db/user-settings';
const pluginOptions = {

    plugins: [
        organization({
            allowUserToCreateOrganization: async (user) => {
                // if the user is on a free account and created 5 organizations prevent them
                let shouldAllow = true;
                console.log("given user on allow user to create organization: ", user);
                if (!(user as { isPro?: boolean })?.isPro) {
                    const res = await db.select({
                        count: schema.featureUsage.count
                    }).from(schema.featureUsage).where(
                        and(
                            eq(schema.featureUsage.userId, user.id),
                            eq(schema.featureUsage.feature, 'ORGANIZATIONS')
                        )
                    );
                    shouldAllow = (res?.[0]?.count ?? 0) <= 5;
                }
                return shouldAllow;
            },
            organizationCreation: {
                afterCreate: async (data) => {
                    await db.update(schema.featureUsage).set({
                        count: sql`${schema.featureUsage.count} + ${1}`
                    }).where(
                        and(
                            eq(schema.featureUsage.userId, data.user.id),
                            eq(schema.featureUsage.feature, 'ORGANIZATIONS')
                        )
                    )
                }
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
            maxAge: 7 * 24 * 60 * 60
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
        },
        additionalFields: {
            hasOnboarded: {
                type: 'boolean',
                defaultValue: false,
                required: true,
                fieldName: 'hasOnboarded',
                returned: true,
                input: true,

            }
        },


    },
    database: drizzleAdapter(db, {
        provider: 'pg',
        //usePlural: true,
        schema
    }),
    plugins: [
        customSession(async ({ user, session }) => {
            const res = await db
                .select({
                    plan: schema.subscriptions.plan,
                    subscriptionId: schema.subscriptions.flwSubscriptionId
                })
                .from(schema.subscriptions)
                .where(eq(schema.subscriptions.userId, user.id))
                .limit(1)
            const userRes = await db.select({
                hasOnboarded: schema.users.hasOnboarded,
            }).from(schema.users).where(eq(schema.users.id, user.id)).limit(1).catch((err) => {
                console.error("Error fetching user onboarding status:", err)
                return []
            })
            const isPro = res?.[0]?.plan === 'PRO'
            return {
                user: {
                    ...user,
                    isPro,
                    hasOnboarded: userRes?.[0]?.hasOnboarded ?? false,
                    subscriptionId: res?.[0]?.subscriptionId
                },
                session
            };
        }, pluginOptions),
        ...(pluginOptions.plugins ?? []),
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
            },
        }
    }
})