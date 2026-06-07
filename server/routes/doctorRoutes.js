const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDashboardStats,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getAllDoctors);
router.get('/stats', protect, roleMiddleware(['admin']), getDashboardStats);
router.get('/:id', getDoctorById);
router.post('/', protect, roleMiddleware(['admin']), createDoctor);
router.put('/:id', protect, roleMiddleware(['admin', 'doctor']), updateDoctor);
router.delete('/:id', protect, roleMiddleware(['admin']), deleteDoctor);

module.exports = router;
