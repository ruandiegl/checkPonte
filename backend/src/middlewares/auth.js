import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export async function authMiddleware(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');

    if (!token) throw new AppError('Token não informado', 401);

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await prisma.user.findFirst({
      where: { id: Number(payload.sub), active: true },
      select: { id: true, name: true, login: true, email: true, role: true, active: true, createdAt: true },
    });

    if (!user) throw new AppError('Sessão inválida', 401);

    req.user = user;
    next();
  } catch (err) {
    next(err instanceof AppError ? err : new AppError('Token inválido ou expirado', 401));
  }
}

export function roleMiddleware(...allowedRoles) {
  return (req, _res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return next(new AppError('Acesso não autorizado para este perfil', 403));
    }

    return next();
  };
}
