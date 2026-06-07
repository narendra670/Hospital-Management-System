const express = require('express');
const router = express.Router();
const {
  getItems,
  getLowStockItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getStockMovements,
  createStockMovement,
  getInventoryStats,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', protect, roleMiddleware(['admin']), getItems);
router.get('/low-stock', protect, roleMiddleware(['admin']), getLowStockItems);
router.get('/stats', protect, roleMiddleware(['admin']), getInventoryStats);
router.get('/movements', protect, roleMiddleware(['admin']), getStockMovements);
router.get('/:id', protect, roleMiddleware(['admin']), getItem);
router.post('/', protect, roleMiddleware(['admin']), createItem);
router.post('/movements', protect, roleMiddleware(['admin']), createStockMovement);
router.put('/:id', protect, roleMiddleware(['admin']), updateItem);
router.delete('/:id', protect, roleMiddleware(['admin']), deleteItem);

module.exports = router;
