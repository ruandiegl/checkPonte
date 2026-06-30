import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { mapUser } from './mappers.js';

export async function login({ login, password }) {
  const user = await prisma.user.findUnique({ where: { login } });

  if (!user || !user.active) {
    throw new AppError('Usuário ou senha inválidos', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Usuário ou senha inválidos', 401);
  }

  const token = jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: env.jwtExpiresIn,
  });

  return { token, user: mapUser(user) };
}
