const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find().populate('user', 'name email phone avatar');
  res.json(doctors);
});

const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatar');
  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

const createDoctor = asyncHandler(async (req, res) => {
  const { userId, specialization, experience, qualification, availableDays, availableTime, consultationFee } = req.body;

  const doctorExists = await Doctor.findOne({ user: userId });
  if (doctorExists) {
    res.status(400);
    throw new Error('Doctor profile already exists');
  }

  const doctor = await Doctor.create({
    user: userId,
    specialization,
    experience,
    qualification,
    availableDays,
    availableTime,
    consultationFee,
  });

  res.status(201).json(doctor);
});

const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (doctor) {
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.experience = req.body.experience || doctor.experience;
    doctor.qualification = req.body.qualification || doctor.qualification;
    doctor.availableDays = req.body.availableDays || doctor.availableDays;
    doctor.availableTime = req.body.availableTime || doctor.availableTime;
    doctor.consultationFee = req.body.consultationFee || doctor.consultationFee;
    doctor.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : doctor.isAvailable;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (doctor) {
    await Doctor.deleteOne({ _id: doctor._id });
    res.json({ message: 'Doctor removed' });
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find();
  const totalDoctors = doctors.length;
  const availableDoctors = doctors.filter((d) => d.isAvailable).length;
  const avgRating = doctors.reduce((acc, d) => acc + d.rating, 0) / totalDoctors || 0;

  res.json({ totalDoctors, availableDoctors, avgRating: avgRating.toFixed(1) });
});

module.exports = { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor, getDashboardStats };
