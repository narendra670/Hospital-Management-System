const express = require('express');
const router = express.Router();
const { createBill, getBills, getBill, generatePDF } = require('../controllers/pharmacyController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', protect, roleMiddleware(['admin']), createBill);
router.get('/', protect, roleMiddleware(['admin']), getBills);
router.get('/:id', protect, roleMiddleware(['admin']), getBill);
router.get('/:id/pdf', protect, roleMiddleware(['admin']), generatePDF);

module.exports = router;
