import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { mapInspection } from './mappers.js';

const inspectionInclude = {
  equipment: true,
  user: true,
  results: { include: { item: true }, orderBy: { item: { orderIndex: 'asc' } } },
};

const inspectionIncludeWithAudits = {
  ...inspectionInclude,
  audits: { include: { actor: true }, orderBy: { createdAt: 'desc' } },
};

function getResultByItem(results = []) {
  return new Map(results.map((result) => [Number(result.check_item_id || result.item_id), result]));
}

function getInspectionStatus(items, resultByItem) {
  const hasAnyNc = items.some((item) => {
    const result = resultByItem.get(item.id);
    return result?.status === false || result?.answer === 'NC';
  });

  const hasImperativeNc = items.some((item) => {
    const result = resultByItem.get(item.id);
    return item.isImperative && (result?.status === false || result?.answer === 'NC');
  });

  return hasImperativeNc ? 'IMP' : hasAnyNc ? 'NC' : 'OK';
}

function assertAllItemsAnswered(items, resultByItem) {
  const missingItems = items.filter((item) => !resultByItem.has(item.id));
  if (missingItems.length > 0) {
    throw new AppError('Todos os itens devem ser respondidos', 422);
  }
}

function snapshotInspection(inspection) {
  return {
    equipment_id: inspection.equipmentId,
    equipmentName: inspection.equipment?.name,
    observations: inspection.observations,
    status: inspection.status,
    results: inspection.results?.map((result) => ({
      item_id: result.itemId,
      itemDescription: result.item?.description,
      answer: result.answer,
      observation: result.observation,
    })),
  };
}

export async function createInspection(data, userId) {
  const activeItems = await prisma.checklistItem.findMany({
    where: { active: true },
    orderBy: { orderIndex: 'asc' },
  });

  const resultByItem = getResultByItem(data.results || []);
  assertAllItemsAnswered(activeItems, resultByItem);
  const status = getInspectionStatus(activeItems, resultByItem);

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

export async function updateInspection(id, data, user) {
  const existing = await prisma.inspection.findUnique({
    where: { id: Number(id) },
    include: inspectionInclude,
  });

  if (!existing) throw new AppError('Inspeção não encontrada', 404);
  if (user.role === 'operator' && existing.userId !== user.id) {
    throw new AppError('Acesso não autorizado para editar esta inspeção', 403);
  }

  const editableItems = existing.results.map((result) => result.item).filter(Boolean);
  const resultByItem = getResultByItem(data.results || []);
  assertAllItemsAnswered(editableItems, resultByItem);

  const status = getInspectionStatus(editableItems, resultByItem);
  const before = snapshotInspection(existing);
  const after = {
    equipment_id: data.equipment_id ? Number(data.equipment_id) : existing.equipmentId,
    equipmentName: existing.equipment?.name,
    observations: data.observations || null,
    status,
    results: editableItems.map((item) => {
      const result = resultByItem.get(item.id);
      const isConform = result.status === true || result.answer === 'C';
      return {
        item_id: item.id,
        itemDescription: item.description,
        answer: isConform ? 'C' : 'NC',
        observation: result.observation || null,
      };
    }),
  };

  await prisma.$transaction([
    prisma.inspection.update({
      where: { id: existing.id },
      data: {
        equipmentId: after.equipment_id,
        observations: after.observations,
        status,
        results: {
          deleteMany: {},
          create: after.results.map((result) => ({
            itemId: result.item_id,
            answer: result.answer,
            observation: result.observation,
          })),
        },
      },
    }),
    prisma.inspectionAudit.create({
      data: {
        inspectionId: existing.id,
        actorId: user.id,
        action: 'UPDATE',
        before,
        after,
      },
    }),
  ]);

  const updated = await prisma.inspection.findUnique({
    where: { id: existing.id },
    include: user.role === 'master' ? inspectionIncludeWithAudits : inspectionInclude,
  });

  return mapInspection(updated);
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
    include: user.role === 'master' ? inspectionIncludeWithAudits : inspectionInclude,
  });

  if (!inspection) throw new AppError('Inspeção não encontrada', 404);
  if (user.role === 'operator' && inspection.userId !== user.id) {
    throw new AppError('Acesso não autorizado para esta inspeção', 403);
  }

  return mapInspection(inspection);
}
