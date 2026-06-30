import axios from 'axios';

const AUTH_KEY = 'vulcano_auth';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
});

apiClient.interceptors.request.use((config) => {
  const authData = localStorage.getItem(AUTH_KEY);
  if (authData) {
    const { token } = JSON.parse(authData);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Não foi possível concluir a operação';
    throw new Error(message);
  },
);

function saveAuth(authData) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

function getAuthenticatedUser() {
  const authData = localStorage.getItem(AUTH_KEY);
  return authData ? JSON.parse(authData) : null;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

async function downloadFile(path, filename) {
  const response = await apiClient.get(path, { responseType: 'blob' });
  const url = window.URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export const api = {
  login: async (username, password) => {
    const { data } = await apiClient.post('/auth/login', { login: username, username, password });
    saveAuth(data);
    return data;
  },

  logout: clearAuth,
  getAuthenticatedUser,

  getUsers: async () => (await apiClient.get('/users')).data,
  saveUser: async (user) => (user.id ? (await apiClient.put(`/users/${user.id}`, user)).data : (await apiClient.post('/users', user)).data),
  updateUserPassword: async (id, password) => (await apiClient.patch(`/users/${id}/password`, { password })).data,
  deleteUser: async (id) => (await apiClient.delete(`/users/${id}`)).data,
  getEquipment: async () => (await apiClient.get('/equipment?all=true')).data,
  getActiveEquipment: async () => (await apiClient.get('/equipment')).data,
  saveEquipment: async (equipment) => (equipment.id ? (await apiClient.put(`/equipment/${equipment.id}`, equipment)).data : (await apiClient.post('/equipment', equipment)).data),
  toggleEquipment: async (id) => (await apiClient.patch(`/equipment/${id}/toggle`)).data,
  deleteEquipment: async (id) => (await apiClient.delete(`/equipment/${id}`)).data,
  getItems: async () => (await apiClient.get('/items')).data,
  getAllItems: async () => (await apiClient.get('/items/all')).data,
  saveItem: async (item) => (item.id ? (await apiClient.put(`/items/${item.id}`, item)).data : (await apiClient.post('/items', item)).data),
  toggleItem: async (id) => (await apiClient.patch(`/items/${id}/toggle`)).data,
  deleteItem: async (id) => (await apiClient.delete(`/items/${id}`)).data,
  saveInspection: async (inspection) => (await apiClient.post('/inspections', inspection)).data,
  getInspections: async (params) => {
    const query = buildQuery(params);
    return (await apiClient.get(`/inspections${query ? `?${query}` : ''}`)).data;
  },
  getDashboardSummary: async (params) => {
    const query = buildQuery(params);
    return (await apiClient.get(`/dashboard/summary${query ? `?${query}` : ''}`)).data;
  },
  getDashboardByCrane: async (params) => {
    const query = buildQuery(params);
    return (await apiClient.get(`/dashboard/by-crane${query ? `?${query}` : ''}`)).data;
  },
  getDashboardTopNcItems: async (params) => {
    const query = buildQuery(params);
    return (await apiClient.get(`/dashboard/top-nc-items${query ? `?${query}` : ''}`)).data;
  },
  getDashboardRecent: async (params) => {
    const query = buildQuery(params);
    return (await apiClient.get(`/dashboard/recent${query ? `?${query}` : ''}`)).data;
  },
  getReport: async (params) => {
    const query = buildQuery(params);
    return (await apiClient.get(`/reports${query ? `?${query}` : ''}`)).data;
  },
  downloadReportPdf: async (params) => {
    const query = buildQuery(params);
    await downloadFile(`/reports/pdf${query ? `?${query}` : ''}`, 'relatorio-vulcano.pdf');
  },
  downloadReportExcel: async (params) => {
    const query = buildQuery(params);
    await downloadFile(`/reports/excel${query ? `?${query}` : ''}`, 'relatorio-vulcano.xlsx');
  },
};
