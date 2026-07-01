import { Router } from 'express';
import { body, param } from 'express-validator';
import * as controller from '../controllers/inspection.controller.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/errorHandler.js';

export const inspectionRoutes = Router();

inspectionRoutes.use(authMiddleware);
inspectionRoutes.get('/', controller.list);
inspectionRoutes.get('/:id', param('id').isInt(), validateRequest, controller.details);
inspectionRoutes.post(
  '/',
  body('equipment_id').isInt(),
  body('results').isArray({ min: 1 }),
  validateRequest,
  controller.create,
);
inspectionRoutes.put(
  '/:id',
  param('id').isInt(),
  body('results').isArray({ min: 1 }),
  validateRequest,
  controller.update,
);
