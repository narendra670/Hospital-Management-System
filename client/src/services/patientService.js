import api from './api';

const patientService = {
  getAll: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/patients/stats');
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/patients', data);
    return response.data;
  },
};

export default patientService;
