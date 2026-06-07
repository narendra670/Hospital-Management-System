import api from './api';

const shiftService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/shifts', { params });
    return data;
  },
  getStats: async () => {
    const { data } = await api.get('/shifts/stats');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/shifts/${id}`);
    return data;
  },
  create: async (shiftData) => {
    const { data } = await api.post('/shifts', shiftData);
    return data;
  },
  update: async (id, shiftData) => {
    const { data } = await api.put(`/shifts/${id}`, shiftData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/shifts/${id}`);
    return data;
  },
};

export default shiftService;
