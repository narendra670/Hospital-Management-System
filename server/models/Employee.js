const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, unique: true },
    department: {
      type: String,
      enum: ['cardiology', 'neurology', 'orthopedics', 'pediatrics', 'general', 'pharmacy', 'administration', 'nursing', 'laboratory', 'radiology', 'emergency', 'hr', 'other'],
      required: true,
    },
    position: { type: String, required: true },
    salary: { type: Number, default: 0 },
    hireDate: { type: Date, default: Date.now },
    phone: { type: String },
    address: { type: String },
    emergencyContact: { name: String, phone: String, relation: String },
    qualifications: [String],
    status: { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
