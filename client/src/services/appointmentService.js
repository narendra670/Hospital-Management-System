import api from './api';

const appointmentService = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getByPatient: async (patientId) => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  },

  getByDoctor: async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  },

  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/appointments/stats');
    return response.data;
  },
};

export default appointmentService;
