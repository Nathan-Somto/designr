import { betterAuth } from 'better-auth';
import { db, schema } from '@designr/db'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins"
export const auth = betterAuth({
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
        fields: {
            image: 'imageUrl',
        }
    },
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true
    }),
    plugins: [organization({
        allowUserToCreateOrganization(user) {
            // if the user is on a free account and created 5 organizations prevent them
            return true
        },
    })],
    databaseHooks: {
        user: {
            create: {
                after: async (details) => {
                    const orgs = await db.insert(schema.organizations).values({
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
                }
            }
        }
    }
})