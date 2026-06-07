const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const getAppointments = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (doctor) filter.doctor = doctor._id;
  } else if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (patient) filter.patient = patient._id;
  }
  const appointments = await Appointment.find(filter)
    .populate('patient')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });
  res.json(appointments);
});

const getAppointmentsByPatient = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.params.patientId })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });
  res.json(appointments);
});

const getAppointmentsByDoctor = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.params.doctorId })
    .populate('patient');
  res.json(appointments);
});

const createAppointment = asyncHandler(async (req, res) => {
  let { patientId, doctorId, date, timeSlot, reason } = req.body;

  if (!patientId && req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (patient) {
      patientId = patient._id;
    }
  }

  if (!patientId) {
    res.status(400);
    throw new Error('Patient ID is required');
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    date,
    timeSlot,
    reason,
  });

  const populated = await Appointment.findById(appointment._id)
    .populate('patient')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

  res.status(201).json(populated);
});

const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (appointment) {
    appointment.status = req.body.status || appointment.status;
    appointment.prescription = req.body.prescription || appointment.prescription;
    appointment.notes = req.body.notes || appointment.notes;
    appointment.date = req.body.date || appointment.date;
    appointment.timeSlot = req.body.timeSlot || appointment.timeSlot;

    const updated = await appointment.save();
    const populated = await Appointment.findById(updated._id)
      .populate('patient')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

    res.json(populated);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (appointment) {
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

const getDashboardStats = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (doctor) filter.doctor = doctor._id;
  } else if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (patient) filter.patient = patient._id;
  }

  const appointments = await Appointment.find(filter);
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = appointments.filter((a) => {
    const aptDate = new Date(a.date);
    return aptDate >= today && aptDate < tomorrow;
  }).length;

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcoming = appointments.filter((a) => {
    const aptDate = new Date(a.date);
    return aptDate >= today && aptDate < nextWeek && a.status !== 'cancelled' && a.status !== 'completed';
  }).length;

  const totalPatients = new Set(appointments.map((a) => a.patient?.toString())).size;

  res.json({ total, pending, confirmed, completed, cancelled, today: todayAppointments, upcoming, totalPatients });
});

module.exports = {
  getAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getDashboardStats,
};
