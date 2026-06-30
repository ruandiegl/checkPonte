// Initial mock data
const initialUsers = [
  { id: 1, name: 'Administrador Master', username: 'admin', role: 'master', active: true },
  { id: 2, name: 'Operador Teste', username: 'operador', role: 'operator', active: true },
];

const initialEquipment = [
  { id: 1, name: 'Ponte Rolante 01', description: 'Galpão A - Capacidade 10t', active: true },
  { id: 2, name: 'Ponte Rolante 02', description: 'Galpão B - Capacidade 5t', active: true },
  { id: 3, name: 'Ponte Rolante 03', description: 'Galpão C - Capacidade 20t', active: true },
];

const initialItems = [
  { id: 1, description: 'Verificação de freios', is_imperative: true, active: true },
  { id: 2, description: 'Estado dos cabos de aço', is_imperative: true, active: true },
  { id: 3, description: 'Lubrificação das engrenagens', is_imperative: false, active: true },
  { id: 4, description: 'Funcionamento da sirene de alerta', is_imperative: true, active: true },
  { id: 5, description: 'Limpeza da cabine', is_imperative: false, active: true },
  { id: 6, description: 'Iluminação de trabalho', is_imperative: false, active: true },
  { id: 7, description: 'Botão de emergência', is_imperative: true, active: true },
];

const STORAGE_KEYS = {
  USERS: 'vulcano_users',
  EQUIPMENT: 'vulcano_equipment',
  ITEMS: 'vulcano_items',
  INSPECTIONS: 'vulcano_inspections',
  AUTH: 'vulcano_auth'
};

// Initialize localStorage if empty
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  if (!localStorage.getItem(STORAGE_KEYS.EQUIPMENT)) localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(initialEquipment));
  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(initialItems));
  if (!localStorage.getItem(STORAGE_KEYS.INSPECTIONS)) localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify([]));
};

initStorage();

export const mockApi = {
  login: async (username, password) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    const user = users.find(u => u.username === username && password === 'vulcano123'); // Simple mock pass
    if (user) {
      const authData = { user, token: 'mock-jwt-token' };
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
      return authData;
    }
    throw new Error('Usuário ou senha inválidos');
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  getAuthenticatedUser: () => {
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
    return authData ? JSON.parse(authData) : null;
  },

  // Management
  getUsers: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)),
  getEquipment: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.EQUIPMENT)),
  getItems: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS)),

  saveUser: (user) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    if (user.id) {
      const idx = users.findIndex(u => u.id === user.id);
      users[idx] = user;
    } else {
      user.id = Date.now();
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return user;
  },

  // Inspections
  saveInspection: (inspection) => {
    const inspections = JSON.parse(localStorage.getItem(STORAGE_KEYS.INSPECTIONS));
    inspection.id = Date.now();
    inspection.created_at = new Date().toISOString();
    inspections.push(inspection);
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(inspections));
    return inspection;
  },

  getInspections: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.INSPECTIONS)),
};
