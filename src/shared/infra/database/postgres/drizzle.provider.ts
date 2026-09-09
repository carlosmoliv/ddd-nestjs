import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import * as schema from './schema/index.js';

export const DRIZZLE_CLIENT = Symbol('DRIZZLE_CLIENT');

export type DrizzleDB = PostgresJsDatabase<typeof schema>;

export const DrizzleProvider = {
  provide: DRIZZLE_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DrizzleDB> => {
    const connectionString = configService.getOrThrow<string>('POSTGRES_URL');
    const client = postgres(connectionString);
    const db = drizzle(client, { schema });
    await db.execute(sql`SELECT 1`);
    return db;
  },
};
