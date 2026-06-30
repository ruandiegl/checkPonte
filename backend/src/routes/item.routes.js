import { Router } from 'express';
import { body, param } from 'express-validator';
import * as controller from '../controllers/item.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/errorHandler.js';

export const itemRoutes = Router();

itemRoutes.use(authMiddleware);
itemRoutes.get('/', controller.list);
itemRoutes.get('/all', roleMiddleware('master'), controller.listAll);
itemRoutes.post(
  '/',
  roleMiddleware('master'),
  body('description').trim().notEmpty(),
  validateRequest,
  controller.create,
);
itemRoutes.put(
  '/:id',
  roleMiddleware('master'),
  param('id').isInt(),
  body('description').trim().notEmpty(),
  validateRequest,
  controller.update,
);
itemRoutes.patch('/:id/toggle', roleMiddleware('master'), param('id').isInt(), validateRequest, controller.toggle);
itemRoutes.delete('/:id', roleMiddleware('master'), param('id').isInt(), validateRequest, controller.remove);
