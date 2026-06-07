const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['medicine', 'equipment', 'supplies', 'other'],
      default: 'other',
    },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'pieces' },
    unitPrice: { type: Number, default: 0 },
    supplier: { type: String },
    reorderLevel: { type: Number, default: 10 },
    batch: { type: String, default: '' },
    gst: { type: Number, default: 0 },
    expiryDate: { type: Date },
    description: { type: String },
    location: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

inventoryItemSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.reorderLevel;
});

inventoryItemSchema.set('toJSON', { virtuals: true });
inventoryItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
