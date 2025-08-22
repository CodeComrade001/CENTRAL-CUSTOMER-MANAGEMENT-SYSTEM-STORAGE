// config/database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

/**
 * DB configuration rules / precedence:
 * 1) Use explicit connection string env (POSTGRES_CONNECTIONSTRING)
 * 2) Otherwise use DOCKER_DATABASE_URL or LOCAL_DATABASE_URL if present
 * 3) Otherwise build DSN from individual fields preferring DOCKER_... when POSTGRESS_CONNECTION === 'docker'
 *
 * The module exports:
 * - default pool: Pool (can be used immediately)
 * - getConnectionString(): string | undefined (for use in table/migration code)
 * - connectToPostgres(): Promise<Pool> (optional explicit readiness await)
 */

// Helper to parse ints
function asInt(v?: string | number, fallback = 5432) {
  if (v === undefined || v === null || v === '') return fallback;
  const n = Number(v);
  return Number.isInteger(n) ? n : fallback;
}

// Support both spellings for backward compatibility
const postgressFlag = (process.env.POSTGRESS_CONNECTION || 'local_connection').toLowerCase();
const isDocker = postgressFlag === 'docker';

//  const isDocker = true; for docker connection
//  const isDocker = false; for local connection

// Build DSN if needed
function buildDsnFromParts(): string | undefined {
  // Choose sets depending on isDocker
  const host = isDocker ? process.env.DOCKER_POSTGRES_HOST || process.env.POSTGRES_HOST : process.env.LOCAL_POSTGRES_HOST || process.env.POSTGRES_HOST;
  const port = isDocker ? process.env.DOCKER_POSTGRES_PORT || process.env.POSTGRES_PORT : process.env.LOCAL_POSTGRES_PORT || process.env.POSTGRES_PORT;
  const user = isDocker ? process.env.DOCKER_POSTGRES_USER || process.env.POSTGRES_USER : process.env.LOCAL_POSTGRES_USER || process.env.POSTGRES_USER;
  const password = isDocker ? process.env.DOCKER_POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD : process.env.LOCAL_POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD;
  const database = isDocker ? process.env.DOCKER_POSTGRES_DB || process.env.POSTGRES_DB : process.env.LOCAL_POSTGRES_DB || process.env.POSTGRES_DB;

  if (!host || !user || !database) return undefined;

  const portPart = port ? `:${port}` : '';
  const passwordPart = password ? `:${encodeURIComponent(password)}` : '';
  // form: postgres://user:password@host:port/database
  return `postgresql://${encodeURIComponent(user)}${password ? `:${encodeURIComponent(password)}` : ''}@${host}${portPart}/${encodeURIComponent(database)}`;
}

// Final connectionString used by module
const connectionString = buildDsnFromParts();

// Create pool config
const poolConfig: any = {
  application_name: 'cen-cms-api',
};

// Attach connection string if present, else keep individual fields
if (connectionString) {
  poolConfig.connectionString = connectionString;
} else {
  // fallback to individual fields (keeps logic tolerant)
  poolConfig.host = isDocker ? process.env.DOCKER_POSTGRES_HOST || process.env.POSTGRES_HOST : process.env.LOCAL_POSTGRES_HOST || process.env.POSTGRES_HOST;
  poolConfig.port = asInt(isDocker ? process.env.DOCKER_POSTGRES_PORT : process.env.LOCAL_POSTGRES_PORT, asInt(process.env.POSTGRES_PORT, 5432));
  poolConfig.user = isDocker ? process.env.DOCKER_POSTGRES_USER || process.env.POSTGRES_USER : process.env.LOCAL_POSTGRES_USER || process.env.POSTGRES_USER;
  poolConfig.password = isDocker ? process.env.DOCKER_POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD : process.env.LOCAL_POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD;
  poolConfig.database = isDocker ? process.env.DOCKER_POSTGRES_DB || process.env.POSTGRES_DB : process.env.LOCAL_POSTGRES_DB || process.env.POSTGRES_DB;
}

// Create the pool
const pool = new Pool(poolConfig);

/**
 * Background non-blocking wait/retry loop so the container doesn't exit
 * during transient DB startup (Postgres recovery).
 */
async function waitForDb(retries = 8, initialDelayMs = 1000, maxDelayMs = 8000) {
  let attempt = 0;
  while (attempt < retries) {
    attempt++;
    try {
      await pool.query('SELECT 1');
      logger.info(`✅ Postgres reachable (attempt ${attempt})`);
      return;
    } catch (err: any) {
      const delay = Math.min(initialDelayMs * Math.pow(2, attempt - 1), maxDelayMs);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  logger.error(`❌ Postgres unreachable after ${retries} attempts — continuing without blocking. Handle DB errors at request time.`);
}

// Start background readiness attempts (do not await here)
waitForDb().catch((e) => logger.error('waitForDb unexpected error:', e));

/**
 * Explicit helper to be used by startup code that wants to block until DB is reachable.
 * Example: await connectToPostgres({ retries: 12, delayMs: 2000 });
 */
export async function connectToPostgres(opts?: { retries?: number; delayMs?: number }) {
  const retries = opts?.retries ?? 12;
  const delay = opts?.delayMs ?? 1000;
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT NOW()');
      logger.info('✅ Database connected (connectToPostgres)');
      return pool;
    } catch (err: any) {
      const backoff = Math.min(delay * Math.pow(2, i), 10000);
      logger.warn(`connectToPostgres: attempt ${i + 1}/${retries} failed: ${err?.message || err}. Backing off ${backoff}ms`);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw new Error('connectToPostgres: database did not become ready in time');
}

/**
 * Return the canonical connection string (or undefined). This is the value your table
 * initialization code in app.ts can call synchronously to get a DSN for libraries that require it.
 */
export function getConnectionString(): string | undefined {
  return connectionString;
}

export default pool;
