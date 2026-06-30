import { asyncHandler } from '../utils/asyncHandler.js';
import * as equipmentService from '../services/equipment.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json(await equipmentService.listEquipment({ includeInactive: req.query.all === 'true' }));
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await equipmentService.createEquipment(req.body));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await equipmentService.updateEquipment(req.params.id, req.body));
});

export const toggle = asyncHandler(async (req, res) => {
  res.json(await equipmentService.toggleEquipment(req.params.id));
});

export const remove = asyncHandler(async (req, res) => {
  res.json(await equipmentService.deleteEquipment(req.params.id));
});
