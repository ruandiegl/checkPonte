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
const jwtSecret = process.env.JWT_SECRET;

if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET deve estar configurado com pelo menos 32 caracteres.');
}

export const env = {
  nodeEnv: process.env.NODE_ENV || (process.env.VERCEL ? 'production' : 'development'),
  port: Number(process.env.PORT || 3333),
  databaseUrl,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
