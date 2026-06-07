const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getDashboardStats,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', protect, getAppointments);
router.get('/stats', protect, getDashboardStats);
router.get('/patient/:patientId', protect, getAppointmentsByPatient);
router.get('/doctor/:doctorId', protect, getAppointmentsByDoctor);
router.post('/', protect, createAppointment);
router.put('/:id', protect, updateAppointment);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
