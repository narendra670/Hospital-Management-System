import api from './api';

const inventoryService = {
  getAll: async () => {
    const { data } = await api.get('/inventory');
    return data;
  },
  getLowStock: async () => {
    const { data } = await api.get('/inventory/low-stock');
    return data;
  },
  getStats: async () => {
    const { data } = await api.get('/inventory/stats');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/inventory/${id}`);
    return data;
  },
  create: async (itemData) => {
    const { data } = await api.post('/inventory', itemData);
    return data;
  },
  update: async (id, itemData) => {
    const { data } = await api.put(`/inventory/${id}`, itemData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/inventory/${id}`);
    return data;
  },
  getMovements: async (itemId) => {
    const params = itemId ? { itemId } : {};
    const { data } = await api.get('/inventory/movements', { params });
    return data;
  },
  createMovement: async (movementData) => {
    const { data } = await api.post('/inventory/movements', movementData);
    return data;
  },
};

export default inventoryService;
