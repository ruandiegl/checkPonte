import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { mapItem } from './mappers.js';

export async function listItems({ includeInactive = false } = {}) {
  const items = await prisma.checklistItem.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
  });

  return items.map(mapItem);
}

export async function createItem(data) {
  const item = await prisma.checklistItem.create({
    data: {
      description: data.description,
      isImperative: Boolean(data.is_imperative),
      orderIndex: Number(data.order_index || 0),
      active: data.active ?? true,
    },
  });

  return mapItem(item);
}

export async function updateItem(id, data) {
  const item = await prisma.checklistItem.update({
    where: { id: Number(id) },
    data: {
      description: data.description,
      isImperative: Boolean(data.is_imperative),
      orderIndex: Number(data.order_index || 0),
      active: data.active,
    },
  });

  return mapItem(item);
}

export async function toggleItem(id) {
  const current = await prisma.checklistItem.findUniqueOrThrow({ where: { id: Number(id) } });
  const item = await prisma.checklistItem.update({
    where: { id: Number(id) },
    data: { active: !current.active },
  });

  return mapItem(item);
}

export async function deleteItem(id) {
  const linkedResults = await prisma.inspectionResult.count({ where: { itemId: Number(id) } });
  if (linkedResults > 0) {
    throw new AppError('Item possui respostas vinculadas. Inative-o para preservar o histórico.', 409);
  }

  await prisma.checklistItem.delete({ where: { id: Number(id) } });
  return { message: 'Item excluído com sucesso' };
}
