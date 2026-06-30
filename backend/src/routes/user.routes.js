import { Router } from 'express';
import { body, param } from 'express-validator';
import * as controller from '../controllers/user.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/errorHandler.js';

export const userRoutes = Router();

userRoutes.use(authMiddleware, roleMiddleware('master'));
userRoutes.get('/', controller.list);
userRoutes.post(
  '/',
  body('name').trim().notEmpty(),
  body('login').trim().notEmpty(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['master', 'operator']),
  validateRequest,
  controller.create,
);
userRoutes.put(
  '/:id',
  param('id').isInt(),
  body('name').trim().notEmpty(),
  body('login').trim().notEmpty(),
  body('role').isIn(['master', 'operator']),
  validateRequest,
  controller.update,
);
userRoutes.patch(
  '/:id/password',
  param('id').isInt(),
  body('password').isLength({ min: 6 }),
  validateRequest,
  controller.updatePassword,
);
userRoutes.delete('/:id', param('id').isInt(), validateRequest, controller.remove);
