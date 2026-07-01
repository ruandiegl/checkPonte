export function mapUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.login,
    login: user.login,
    email: user.email,
    role: user.role,
    active: user.active,
    created_at: user.createdAt,
  };
}

export function mapEquipment(equipment) {
  return {
    id: equipment.id,
    name: equipment.name,
    description: equipment.description,
    location: equipment.location,
    active: equipment.active,
    created_at: equipment.createdAt,
  };
}

export function mapItem(item) {
  return {
    id: item.id,
    description: item.description,
    is_imperative: item.isImperative,
    order_index: item.orderIndex,
    active: item.active,
    created_at: item.createdAt,
  };
}

export function mapInspection(inspection) {
  return {
    id: inspection.id,
    equipment_id: inspection.equipmentId,
    crane_id: inspection.equipment?.name,
    equipmentName: inspection.equipment?.name,
    location: inspection.location || inspection.equipment?.location,
    user_id: inspection.userId,
    userName: inspection.user?.name,
    inspection_date: inspection.inspectionDate,
    observations: inspection.observations,
    status: inspection.status,
    created_at: inspection.createdAt,
    updated_at: inspection.updatedAt,
    results: inspection.results?.map((result) => ({
      id: result.id,
      check_item_id: result.itemId,
      item_id: result.itemId,
      itemDescription: result.item?.description,
      is_imperative: result.item?.isImperative,
      answer: result.answer,
      status: result.answer === 'C',
      observation: result.observation,
    })),
    audits: inspection.audits?.map((audit) => ({
      id: audit.id,
      action: audit.action,
      actor_id: audit.actorId,
      actorName: audit.actor?.name,
      before: audit.before,
      after: audit.after,
      created_at: audit.createdAt,
    })),
  };
}
