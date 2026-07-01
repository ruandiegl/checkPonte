import dotenv from 'dotenv';

if (!process.env.VERCEL) {
  dotenv.config();
}

const currentDatabaseUrl = process.env.DATABASE_URL;
const fallbackDatabaseUrl =
  process.env.database_POSTGRES_PRISMA_URL ||
  process.env.database_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;
const databaseUrl =
  process.env.VERCEL && currentDatabaseUrl?.includes('localhost') && fallbackDatabaseUrl
    ? fallbackDatabaseUrl
    : currentDatabaseUrl || fallbackDatabaseUrl;

if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || (process.env.VERCEL ? 'production' : 'development'),
  port: Number(process.env.PORT || 3333),
  databaseUrl,
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
