import { Router } from 'express';
import * as controller from '../controllers/dashboard.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';

export const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware, roleMiddleware('master'));
dashboardRoutes.get('/summary', controller.summary);
dashboardRoutes.get('/by-crane', controller.byCrane);
dashboardRoutes.get('/top-nc-items', controller.topNcItems);
dashboardRoutes.get('/recent', controller.recent);
