import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg, NodePgClient } from 'drizzle-orm/node-postgres';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import pg from 'pg';
//import dotenv from "dotenv";

//dotenv.config();
//import * as schema from './schema';
// the connections are cached depending on the environment
const globalForDb = globalThis as unknown as {
    connection: pg.Pool | ReturnType<typeof neon> | undefined;
};

let db: ReturnType<typeof drizzlePg> | ReturnType<typeof drizzleNeon>;

if (process.env.NODE_ENV === 'production') {

    const connection = globalForDb.connection ?? neon(process.env.DATABASE_PROD_URL!);
    if (!globalForDb.connection) globalForDb.connection = connection;

    db = drizzleNeon({
        //schema,
        client: connection as NeonQueryFunction<boolean, boolean>,
        logger: true,
        casing: 'snake_case',
    });

} else {
    const connection = globalForDb.connection ?? new pg.Pool({
        connectionString: process.env.DATABASE_DEV_URL!,
    });
    if (!globalForDb.connection) globalForDb.connection = connection;

    db = drizzlePg(connection as NodePgClient, {
        logger: true,
    });
}

export { db };
