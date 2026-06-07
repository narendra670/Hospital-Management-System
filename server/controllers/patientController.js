const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const User = require('../models/User');

const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find().populate('user', 'name email phone');
  res.json(patients);
});

const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate('user', 'name email phone');
  if (patient) {
    res.json(patient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

const createPatient = asyncHandler(async (req, res) => {
  const { userId, dateOfBirth, gender, address, bloodGroup, medicalHistory, emergencyContact } = req.body;

  const patient = await Patient.create({
    user: userId,
    dateOfBirth,
    gender,
    address,
    bloodGroup,
    medicalHistory,
    emergencyContact,
  });

  res.status(201).json(patient);
});

const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (patient) {
    patient.dateOfBirth = req.body.dateOfBirth || patient.dateOfBirth;
    patient.gender = req.body.gender || patient.gender;
    patient.address = req.body.address || patient.address;
    patient.bloodGroup = req.body.bloodGroup || patient.bloodGroup;
    patient.medicalHistory = req.body.medicalHistory || patient.medicalHistory;
    patient.emergencyContact = req.body.emergencyContact || patient.emergencyContact;

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const patients = await Patient.find();
  const totalPatients = patients.length;
  const genderDistribution = {
    male: patients.filter((p) => p.gender === 'male').length,
    female: patients.filter((p) => p.gender === 'female').length,
    other: patients.filter((p) => p.gender === 'other').length,
  };

  res.json({ totalPatients, genderDistribution });
});

module.exports = { getAllPatients, getPatientById, createPatient, updatePatient, getDashboardStats };
