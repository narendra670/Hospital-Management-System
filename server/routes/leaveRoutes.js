const express = require('express');
const router = express.Router();
const {
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  deleteLeave,
  getLeaveStats,
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', protect, roleMiddleware(['admin']), getLeaves);
router.get('/stats', protect, roleMiddleware(['admin']), getLeaveStats);
router.get('/:id', protect, roleMiddleware(['admin']), getLeave);
router.post('/', protect, roleMiddleware(['admin']), createLeave);
router.put('/:id', protect, roleMiddleware(['admin']), updateLeave);
router.delete('/:id', protect, roleMiddleware(['admin']), deleteLeave);

module.exports = router;
