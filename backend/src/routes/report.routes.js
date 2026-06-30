import { Router } from 'express';
import * as controller from '../controllers/report.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';

export const reportRoutes = Router();

reportRoutes.use(authMiddleware, roleMiddleware('master'));
reportRoutes.get('/', controller.list);
reportRoutes.get('/pdf', controller.pdf);
reportRoutes.get('/excel', controller.excel);
