import { parseDateRange } from '../utils/dateRange.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as inspectionService from '../services/inspection.service.js';

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await inspectionService.createInspection(req.body, req.user.id));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await inspectionService.updateInspection(req.params.id, req.body, req.user));
});

export const list = asyncHandler(async (req, res) => {
  const hasRange = req.query.from || req.query.to;
  const range = hasRange ? parseDateRange(req.query) : {};
  res.json(await inspectionService.listInspections(req.user, range));
});

export const details = asyncHandler(async (req, res) => {
  res.json(await inspectionService.getInspection(req.params.id, req.user));
});
