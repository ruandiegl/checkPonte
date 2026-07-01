import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { ensureInspectionAuditSchema } from './config/ensureSchema.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { routes } from './routes/index.js';

export const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(async (_req, _res, next) => {
  try {
    await ensureInspectionAuditSchema();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vulcano-api' });
});

app.use('/api/v1', routes);
app.use(errorHandler);
