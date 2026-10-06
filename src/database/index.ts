import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env.js';

const pool = new Pool({
  connectionString: env.DB_URL,
});

export const db = drizzle(pool);

export const connectDatabase = async () => {
  await pool.query('SELECT 1');
};

export const closeDatabase = async () => {
  await pool.end();
};
