import { asyncHandler } from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

export const list = asyncHandler(async (_req, res) => {
  res.json(await userService.listUsers());
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await userService.createUser(req.body));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await userService.updateUser(req.params.id, req.body, req.user.id));
});

export const updatePassword = asyncHandler(async (req, res) => {
  res.json(await userService.updatePassword(req.params.id, req.body.password));
});

export const remove = asyncHandler(async (req, res) => {
  res.json(await userService.deleteUser(req.params.id, req.user.id));
});
