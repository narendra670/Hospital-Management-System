const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', protect, roleMiddleware(['admin']), getEmployees);
router.get('/stats', protect, roleMiddleware(['admin']), getEmployeeStats);
router.get('/:id', protect, roleMiddleware(['admin']), getEmployee);
router.post('/', protect, roleMiddleware(['admin']), createEmployee);
router.put('/:id', protect, roleMiddleware(['admin']), updateEmployee);
router.delete('/:id', protect, roleMiddleware(['admin']), deleteEmployee);

module.exports = router;
