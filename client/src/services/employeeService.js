import api from './api';

const employeeService = {
  getAll: async () => {
    const { data } = await api.get('/employees');
    return data;
  },
  getStats: async () => {
    const { data } = await api.get('/employees/stats');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/employees/${id}`);
    return data;
  },
  create: async (empData) => {
    const { data } = await api.post('/employees', empData);
    return data;
  },
  update: async (id, empData) => {
    const { data } = await api.put(`/employees/${id}`, empData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/employees/${id}`);
    return data;
  },
};

export default employeeService;
