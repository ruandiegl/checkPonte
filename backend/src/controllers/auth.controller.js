import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import { mapUser } from '../services/mappers.js';

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login({
    login: req.body.login || req.body.username,
    password: req.body.password,
  });

  res.json(data);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: mapUser(req.user) });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ message: 'Logout realizado no cliente' });
});
