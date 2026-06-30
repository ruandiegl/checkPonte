import { prisma } from '../config/prisma.js';
import { mapInspection } from './mappers.js';

export async function getSummary() {
  const [total, ok, nc, imp] = await Promise.all([
    prisma.inspection.count(),
    prisma.inspection.count({ where: { status: 'OK' } }),
    prisma.inspection.count({ where: { status: 'NC' } }),
    prisma.inspection.count({ where: { status: 'IMP' } }),
  ]);

  return {
    total,
    ok,
    nc,
    imp,
    conformity: total > 0 ? Math.round((ok / total) * 100) : 0,
  };
}

export async function getByCrane() {
  const results = await prisma.inspectionResult.findMany({
    where: { answer: 'NC' },
    include: { inspection: { include: { equipment: true } } },
  });

  const grouped = new Map();
  results.forEach((result) => {
    const equipment = result.inspection.equipment;
    grouped.set(equipment.id, {
      equipment_id: equipment.id,
      equipmentName: equipment.name,
      ncCount: (grouped.get(equipment.id)?.ncCount || 0) + 1,
    });
  });

  return [...grouped.values()].sort((a, b) => b.ncCount - a.ncCount);
}

export async function getTopNcItems() {
  const results = await prisma.inspectionResult.groupBy({
    by: ['itemId'],
    where: { answer: 'NC' },
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

export async function getRecent() {
  const inspections = await prisma.inspection.findMany({
    include: { equipment: true, user: true, results: { include: { item: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return inspections.map(mapInspection);
}
