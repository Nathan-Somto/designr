import { type Config } from "drizzle-kit";
export default {
    dialect: 'postgresql',
    schema: './src/schema.ts',
    out: './drizzle/migrations',
    dbCredentials: {
        url: process.env.DATABASE_DEV_URL ?? ''
    },
    verbose: true,
    strict: true
} satisfies Config