import api from './api';

const leaveService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/leaves', { params });
    return data;
  },
  getStats: async () => {
    const { data } = await api.get('/leaves/stats');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/leaves/${id}`);
    return data;
  },
  create: async (leaveData) => {
    const { data } = await api.post('/leaves', leaveData);
    return data;
  },
  update: async (id, leaveData) => {
    const { data } = await api.put(`/leaves/${id}`, leaveData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/leaves/${id}`);
    return data;
  },
};

export default leaveService;
