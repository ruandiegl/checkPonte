import { prisma } from '../config/prisma.js';
import { mapInspection } from './mappers.js';

const reportInclude = {
  equipment: true,
  user: true,
  results: { include: { item: true }, orderBy: { item: { orderIndex: 'asc' } } },
};

export async function getReportData({ from, to }) {
  const inspections = await prisma.inspection.findMany({
    where: { createdAt: { gte: from, lte: to } },
    include: reportInclude,
    orderBy: { createdAt: 'desc' },
  });

  const summary = inspections.reduce(
    (acc, inspection) => {
      acc.total += 1;
      if (inspection.status === 'OK') acc.ok += 1;
      if (inspection.status === 'NC') acc.nc += 1;
      if (inspection.status === 'IMP') acc.imp += 1;

      inspection.results.forEach((result) => {
        if (result.answer === 'C') acc.conform += 1;
        if (result.answer === 'NC') acc.nonConform += 1;
      });

      return acc;
    },
    { total: 0, ok: 0, nc: 0, imp: 0, conform: 0, nonConform: 0 },
  );

  return {
    period: { from, to },
    summary,
    inspections: inspections.map(mapInspection),
  };
}
