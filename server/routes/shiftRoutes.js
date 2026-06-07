const express = require('express');
const router = express.Router();
const {
  getShifts,
  getShift,
  createShift,
  updateShift,
  deleteShift,
  getShiftStats,
} = require('../controllers/shiftController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', protect, roleMiddleware(['admin']), getShifts);
router.get('/stats', protect, roleMiddleware(['admin']), getShiftStats);
router.get('/:id', protect, roleMiddleware(['admin']), getShift);
router.post('/', protect, roleMiddleware(['admin']), createShift);
router.put('/:id', protect, roleMiddleware(['admin']), updateShift);
router.delete('/:id', protect, roleMiddleware(['admin']), deleteShift);

module.exports = router;
