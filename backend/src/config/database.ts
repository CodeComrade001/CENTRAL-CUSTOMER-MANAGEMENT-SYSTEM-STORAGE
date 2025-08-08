import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  // TODO for docker host: process.env.POSTGRES_HOST || 'localhost',
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  //  for docker port: Number(process.env.POSTGRES_PORT) || 5432, // Always internal 5432
  port: Number(process.env.POSTGRES_EXTERNAL_PORT) || 5432,
});

export async function connectToPostgres(): Promise<Pool> {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully ');
    client.release();
    return pool;
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
    process.exit(1); // Exit app if DB fails
  }
}

export default pool;
