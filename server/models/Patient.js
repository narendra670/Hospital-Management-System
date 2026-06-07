const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: { type: String },
    bloodGroup: { type: String },
    medicalHistory: [{ type: String }],
    emergencyContact: { name: String, phone: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
