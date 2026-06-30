import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { mapUser } from './mappers.js';

export async function listUsers() {
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  return users.map(mapUser);
}

export async function createUser(data) {
  const exists = await prisma.user.findUnique({ where: { login: data.login } });
  if (exists) throw new AppError('Login já está em uso', 409);

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      login: data.login,
      email: data.email || null,
      passwordHash,
      role: data.role,
      active: data.active ?? true,
    },
  });

  return mapUser(user);
}

export async function updateUser(id, data, currentUserId) {
  if (Number(id) === currentUserId && data.active === false) {
    throw new AppError('O usuário logado não pode desativar a si mesmo', 400);
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      login: data.login,
      email: data.email || null,
      role: data.role,
      active: data.active,
    },
  });

  return mapUser(user);
}

export async function updatePassword(id, password) {
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: Number(id) }, data: { passwordHash } });
  return { message: 'Senha atualizada com sucesso' };
}

export async function deleteUser(id, currentUserId) {
  if (Number(id) === currentUserId) {
    throw new AppError('O usuário logado não pode excluir a si mesmo', 400);
  }

  const inspections = await prisma.inspection.count({ where: { userId: Number(id) } });
  if (inspections > 0) {
    await prisma.user.update({ where: { id: Number(id) }, data: { active: false } });
    return { message: 'Usuário possui inspeções vinculadas e foi inativado' };
  }

  await prisma.user.delete({ where: { id: Number(id) } });
  return { message: 'Usuário excluído com sucesso' };
}
