import { asyncHandler } from '../utils/asyncHandler.js';
import * as dashboardService from '../services/dashboard.service.js';

export const summary = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getSummary());
});

export const byCrane = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getByCrane());
});

export const topNcItems = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getTopNcItems());
});

export const recent = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getRecent());
});
