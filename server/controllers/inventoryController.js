const asyncHandler = require('express-async-handler');
const InventoryItem = require('../models/InventoryItem');
const StockMovement = require('../models/StockMovement');

const getItems = asyncHandler(async (req, res) => {
  const items = await InventoryItem.find().sort({ createdAt: -1 });
  res.json(items);
});

const getLowStockItems = asyncHandler(async (req, res) => {
  const items = await InventoryItem.find().sort({ createdAt: -1 });
  const lowStock = items.filter((i) => i.isLowStock);
  res.json(lowStock);
});

const getItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findById(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

const createItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(item);
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findById(req.params.id);
  if (item) {
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

const deleteItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findById(req.params.id);
  if (item) {
    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

const getStockMovements = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.itemId) filter.item = req.query.itemId;
  const movements = await StockMovement.find(filter)
    .populate('item', 'name')
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(movements);
});

const createStockMovement = asyncHandler(async (req, res) => {
  const { itemId, type, quantity, reference, notes } = req.body;
  const item = await InventoryItem.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const movement = await StockMovement.create({
    item: itemId,
    type,
    quantity,
    reference,
    notes,
    user: req.user._id,
  });

  if (type === 'in') {
    item.quantity += Number(quantity);
  } else {
    item.quantity -= Number(quantity);
  }
  await item.save();

  const populated = await StockMovement.findById(movement._id)
    .populate('item', 'name')
    .populate('user', 'name');

  res.status(201).json(populated);
});

const getInventoryStats = asyncHandler(async (req, res) => {
  const items = await InventoryItem.find();
  const totalItems = items.length;
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const lowStockCount = items.filter((i) => i.isLowStock).length;
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  res.json({ totalItems, totalValue, lowStockCount, totalQuantity });
});

module.exports = {
  getItems,
  getLowStockItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getStockMovements,
  createStockMovement,
  getInventoryStats,
};
