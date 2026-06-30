import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { mapInspection } from './mappers.js';

const inspectionInclude = {
  equipment: true,
  user: true,
  results: { include: { item: true }, orderBy: { item: { orderIndex: 'asc' } } },
};

export async function createInspection(data, userId) {
  const activeItems = await prisma.checklistItem.findMany({
    where: { active: true },
    orderBy: { orderIndex: 'asc' },
  });

  const resultByItem = new Map((data.results || []).map((result) => [Number(result.check_item_id || result.item_id), result]));
  const missingItems = activeItems.filter((item) => !resultByItem.has(item.id));

  if (missingItems.length > 0) {
    throw new AppError('Todos os itens ativos devem ser respondidos', 422);
  }

  const hasAnyNc = activeItems.some((item) => {
    const result = resultByItem.get(item.id);
    return result.status === false || result.answer === 'NC';
  });

  const hasImperativeNc = activeItems.some((item) => {
    const result = resultByItem.get(item.id);
    return item.isImperative && (result.status === false || result.answer === 'NC');
  });

  const status = hasImperativeNc ? 'IMP' : hasAnyNc ? 'NC' : 'OK';

  const inspection = await prisma.inspection.create({
    data: {
      equipmentId: Number(data.equipment_id),
      inspectionDate: data.inspection_date ? new Date(data.inspection_date) : new Date(),
      location: data.location || null,
      userId,
      observations: data.observations || null,
      status,
      results: {
        create: activeItems.map((item) => {
          const result = resultByItem.get(item.id);
          const isConform = result.status === true || result.answer === 'C';
          return {
            itemId: item.id,
            answer: isConform ? 'C' : 'NC',
            observation: result.observation || null,
          };
        }),
      },
    },
    include: inspectionInclude,
  });

  return mapInspection(inspection);
}

export async function listInspections(user, filters = {}) {
  const where = {
    ...(user.role === 'operator' ? { userId: user.id } : {}),
    ...(filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {}),
          },
        }
      : {}),
  };

  const inspections = await prisma.inspection.findMany({
    where,
    include: inspectionInclude,
    orderBy: { createdAt: 'desc' },
    take: filters.take || 50,
  });

  return inspections.map(mapInspection);
}

export async function getInspection(id, user) {
  const inspection = await prisma.inspection.findUnique({
    where: { id: Number(id) },
    include: inspectionInclude,
  });

  if (!inspection) throw new AppError('Inspeção não encontrada', 404);
  if (user.role === 'operator' && inspection.userId !== user.id) {
    throw new AppError('Acesso não autorizado para esta inspeção', 403);
  }

  return mapInspection(inspection);
}
