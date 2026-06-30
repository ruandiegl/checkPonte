import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { dashboardRoutes } from './dashboard.routes.js';
import { equipmentRoutes } from './equipment.routes.js';
import { inspectionRoutes } from './inspection.routes.js';
import { itemRoutes } from './item.routes.js';
import { reportRoutes } from './report.routes.js';
import { userRoutes } from './user.routes.js';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/equipment', equipmentRoutes);
routes.use('/items', itemRoutes);
routes.use('/inspections', inspectionRoutes);
routes.use('/dashboard', dashboardRoutes);
routes.use('/reports', reportRoutes);
