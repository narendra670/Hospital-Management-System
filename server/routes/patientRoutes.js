const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  getDashboardStats,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', protect, roleMiddleware(['admin', 'doctor', 'patient']), getAllPatients);
router.get('/stats', protect, roleMiddleware(['admin', 'doctor', 'patient']), getDashboardStats);
router.get('/:id', protect, getPatientById);
router.post('/', protect, createPatient);
router.put('/:id', protect, updatePatient);

module.exports = router;
