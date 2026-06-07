const asyncHandler = require('express-async-handler');
const Shift = require('../models/Shift');
const Employee = require('../models/Employee');

const getShifts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.employeeId) filter.employee = req.query.employeeId;
  if (req.query.date) filter.date = new Date(req.query.date);
  const shifts = await Shift.find(filter)
    .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
    .sort({ date: -1, startTime: 1 });
  res.json(shifts);
});

const getShift = asyncHandler(async (req, res) => {
  const shift = await Shift.findById(req.params.id)
    .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } });
  if (shift) {
    res.json(shift);
  } else {
    res.status(404);
    throw new Error('Shift not found');
  }
});

const createShift = asyncHandler(async (req, res) => {
  const shift = await Shift.create(req.body);
  const populated = await Shift.findById(shift._id)
    .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } });
  res.status(201).json(populated);
});

const updateShift = asyncHandler(async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (shift) {
    Object.assign(shift, req.body);
    const updated = await shift.save();
    const populated = await Shift.findById(updated._id)
      .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } });
    res.json(populated);
  } else {
    res.status(404);
    throw new Error('Shift not found');
  }
});

const deleteShift = asyncHandler(async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (shift) {
    await shift.deleteOne();
    res.json({ message: 'Shift removed' });
  } else {
    res.status(404);
    throw new Error('Shift not found');
  }
});

const getShiftStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayShifts = await Shift.find({ date: { $gte: today, $lt: tomorrow } });
  const totalToday = todayShifts.length;

  const weeklyStart = new Date(today);
  weeklyStart.setDate(weeklyStart.getDate() - weeklyStart.getDay());
  const weeklyShifts = await Shift.find({ date: { $gte: weeklyStart } });
  const totalWeekly = weeklyShifts.length;

  res.json({ totalToday, totalWeekly });
});

module.exports = {
  getShifts,
  getShift,
  createShift,
  updateShift,
  deleteShift,
  getShiftStats,
};
