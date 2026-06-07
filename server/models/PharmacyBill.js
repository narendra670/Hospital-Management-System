const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  serialNo: { type: Number, required: true },
  medicineName: { type: String, required: true },
  batch: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  gst: { type: Number, required: true },
  amount: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
});

const pharmacyBillSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  patient: {
    name: { type: String, required: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  hospital: {
    name: { type: String, default: 'MediCare Hospital' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    gstNo: { type: String, default: '' },
    accountNo: { type: String, default: '' },
  },
  items: [billItemSchema],
  subtotal: { type: Number, required: true },
  totalGst: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('PharmacyBill', pharmacyBillSchema);
