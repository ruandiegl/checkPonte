import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import * as controller from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/errorHandler.js';

export const authRoutes = Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

authRoutes.post(
  '/login',
  loginLimiter,
  body('password').isLength({ min: 6 }),
  validateRequest,
  controller.login,
);
authRoutes.post('/logout', authMiddleware, controller.logout);
authRoutes.get('/me', authMiddleware, controller.me);
