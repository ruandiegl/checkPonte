import { Router } from 'express';
import { body, param } from 'express-validator';
import * as controller from '../controllers/equipment.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/errorHandler.js';

export const equipmentRoutes = Router();

equipmentRoutes.use(authMiddleware);
equipmentRoutes.get('/', controller.list);
equipmentRoutes.post(
  '/',
  roleMiddleware('master'),
  body('name').trim().notEmpty(),
  validateRequest,
  controller.create,
);
equipmentRoutes.put(
  '/:id',
  roleMiddleware('master'),
  param('id').isInt(),
  body('name').trim().notEmpty(),
  validateRequest,
  controller.update,
);
equipmentRoutes.patch('/:id/toggle', roleMiddleware('master'), param('id').isInt(), validateRequest, controller.toggle);
