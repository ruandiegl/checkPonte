import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { mapEquipment } from './mappers.js';

export async function listEquipment({ includeInactive = false } = {}) {
  const equipment = await prisma.equipment.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: { name: 'asc' },
  });

  return equipment.map(mapEquipment);
}

export async function createEquipment(data) {
  const equipment = await prisma.equipment.create({
    data: {
      name: data.name,
      description: data.description || null,
      location: data.location || null,
      active: data.active ?? true,
    },
  });

  return mapEquipment(equipment);
}

export async function updateEquipment(id, data) {
  const equipment = await prisma.equipment.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      description: data.description || null,
      location: data.location || null,
      active: data.active,
    },
  });

  return mapEquipment(equipment);
}

export async function toggleEquipment(id) {
  const current = await prisma.equipment.findUniqueOrThrow({ where: { id: Number(id) } });
  const equipment = await prisma.equipment.update({
    where: { id: Number(id) },
    data: { active: !current.active },
  });

  return mapEquipment(equipment);
}

export async function deleteEquipment(id) {
  const linkedInspections = await prisma.inspection.count({ where: { equipmentId: Number(id) } });
  if (linkedInspections > 0) {
    throw new AppError('Equipamento possui inspeções vinculadas. Não é possível excluir sem perder histórico.', 409);
  }

  await prisma.equipment.delete({ where: { id: Number(id) } });
  return { message: 'Equipamento excluído com sucesso' };
}
