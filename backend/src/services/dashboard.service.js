import { prisma } from '../config/prisma.js';
import { mapInspection } from './mappers.js';

function inspectionWhere(filters = {}) {
  if (!filters.from && !filters.to) return {};

  return {
    createdAt: {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: filters.to } : {}),
    },
  };
}

function resultWhere(filters = {}) {
  const where = { answer: 'NC' };
  const inspection = inspectionWhere(filters);
  if (Object.keys(inspection).length > 0) {
    where.inspection = { is: inspection };
  }

  return where;
}

export async function getSummary(filters = {}) {
  const where = inspectionWhere(filters);
  const [total, ok, nc, imp] = await Promise.all([
    prisma.inspection.count({ where }),
    prisma.inspection.count({ where: { ...where, status: 'OK' } }),
    prisma.inspection.count({ where: { ...where, status: 'NC' } }),
    prisma.inspection.count({ where: { ...where, status: 'IMP' } }),
  ]);

  return {
    total,
    ok,
    nc,
    imp,
    conformity: total > 0 ? Math.round((ok / total) * 100) : 0,
  };
}

export async function getByCrane(filters = {}) {
  const [equipmentList, results] = await Promise.all([
    prisma.equipment.findMany({ orderBy: { name: 'asc' } }),
    prisma.inspectionResult.findMany({
      where: resultWhere(filters),
      include: { inspection: { include: { equipment: true } } },
    }),
  ]);

  const grouped = new Map();
  results.forEach((result) => {
    const equipment = result.inspection.equipment;
    grouped.set(equipment.id, {
      equipment_id: equipment.id,
      equipmentName: equipment.name,
      ncCount: (grouped.get(equipment.id)?.ncCount || 0) + 1,
    });
  });

  return equipmentList
    .map((equipment) => ({
      equipment_id: equipment.id,
      equipmentName: equipment.name,
      ncCount: grouped.get(equipment.id)?.ncCount || 0,
    }))
    .sort((a, b) => b.ncCount - a.ncCount || a.equipmentName.localeCompare(b.equipmentName));
}

export async function getTopNcItems(filters = {}) {
  const results = await prisma.inspectionResult.groupBy({
    by: ['itemId'],
    where: resultWhere(filters),
    _count: { itemId: true },
    orderBy: { _count: { itemId: 'desc' } },
    take: 5,
  });

  const items = await prisma.checklistItem.findMany({
    where: { id: { in: results.map((result) => result.itemId) } },
  });

  return results.map((result) => {
    const item = items.find((entry) => entry.id === result.itemId);
    return {
      item_id: result.itemId,
      description: item?.description,
      ncCount: result._count.itemId,
    };
  });
}

export async function getRecent(filters = {}) {
  const inspections = await prisma.inspection.findMany({
    where: inspectionWhere(filters),
    include: { equipment: true, user: true, results: { include: { item: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return inspections.map(mapInspection);
}
