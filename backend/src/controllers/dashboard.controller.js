import { asyncHandler } from '../utils/asyncHandler.js';
import { parseDateRange } from '../utils/dateRange.js';
import * as dashboardService from '../services/dashboard.service.js';

function getOptionalRange(req) {
  return req.query.from || req.query.to ? parseDateRange(req.query) : {};
}

export const summary = asyncHandler(async (req, res) => {
  res.json(await dashboardService.getSummary(getOptionalRange(req)));
});

export const byCrane = asyncHandler(async (req, res) => {
  res.json(await dashboardService.getByCrane(getOptionalRange(req)));
});

export const topNcItems = asyncHandler(async (req, res) => {
  res.json(await dashboardService.getTopNcItems(getOptionalRange(req)));
});

export const recent = asyncHandler(async (req, res) => {
  res.json(await dashboardService.getRecent(getOptionalRange(req)));
});
