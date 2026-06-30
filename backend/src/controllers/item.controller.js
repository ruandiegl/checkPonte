import { asyncHandler } from '../utils/asyncHandler.js';
import * as itemService from '../services/item.service.js';

export const list = asyncHandler(async (_req, res) => {
  res.json(await itemService.listItems());
});

export const listAll = asyncHandler(async (_req, res) => {
  res.json(await itemService.listItems({ includeInactive: true }));
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await itemService.createItem(req.body));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await itemService.updateItem(req.params.id, req.body));
});

export const toggle = asyncHandler(async (req, res) => {
  res.json(await itemService.toggleItem(req.params.id));
});

export const remove = asyncHandler(async (req, res) => {
  res.json(await itemService.deleteItem(req.params.id));
});
