import api from './api';

const pharmacyService = {
  createBill: (data) => api.post('/pharmacy', data),
  getBills: () => api.get('/pharmacy'),
  getBill: (id) => api.get(`/pharmacy/${id}`),
  getPDF: (id) => api.get(`/pharmacy/${id}/pdf`, { responseType: 'blob' }),
};

export default pharmacyService;
