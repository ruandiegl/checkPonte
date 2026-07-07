export type EntityId = number | string;
export type UserRole = 'master' | 'operator' | string;
export type InspectionStatus = 'OK' | 'NC' | 'IMP' | string;
export type InspectionAnswer = 'OK' | 'NC';
export type ExportType = 'pdf' | 'excel';

export interface AppUser {
  id: EntityId;
  name?: string;
  username?: string;
  login?: string;
  email?: string | null;
  role: UserRole;
  active?: boolean;
}

export interface Equipment {
  id: EntityId;
  name: string;
  description?: string | null;
  location?: string | null;
  active?: boolean;
}

export interface CheckItem {
  id: EntityId;
  description: string;
  is_imperative?: boolean;
  order_index?: number;
  active?: boolean;
}

export interface InspectionResult {
  id?: EntityId;
  item_id?: EntityId;
  check_item_id?: EntityId;
  itemDescription?: string;
  answer?: InspectionAnswer | string;
  status?: boolean;
  observation?: string;
  is_imperative?: boolean;
}

export interface InspectionAudit {
  id: EntityId;
  actor_id?: EntityId;
  actorName?: string;
  created_at: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
}

export interface Inspection {
  id: EntityId;
  equipment_id?: EntityId;
  equipmentName?: string;
  userName?: string;
  location?: string | null;
  status: InspectionStatus;
  created_at: string;
  updated_at?: string;
  inspection_date?: string;
  observations?: string | null;
  results?: InspectionResult[];
  audits?: InspectionAudit[];
}

export interface DashboardSummary {
  total: number;
  ok: number;
  nc: number;
  imp: number;
  conformity: number;
}

export interface DashboardCraneItem {
  equipment_id: EntityId;
  equipmentName: string;
  ncCount: number;
}

export interface DashboardTopItem {
  item_id: EntityId;
  description: string;
  ncCount: number;
}

export interface ReportData {
  summary?: {
    total?: number;
    conform?: number;
    nonConform?: number;
  };
  inspections?: Inspection[];
}

export interface DateRange {
  from: string;
  to: string;
}

export const getErrorMessage = (error: unknown, fallback = 'Não foi possível concluir a operação.') => {
  return error instanceof Error ? error.message : fallback;
};
