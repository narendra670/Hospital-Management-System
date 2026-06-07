const asyncHandler = require('express-async-handler');
const Leave = require('../models/Leave');

const getLeaves = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.employeeId) filter.employee = req.query.employeeId;
  if (req.query.status) filter.status = req.query.status;
  const leaves = await Leave.find(filter)
    .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 });
  res.json(leaves);
});

const getLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id)
    .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
    .populate('approvedBy', 'name');
  if (leave) {
    res.json(leave);
  } else {
    res.status(404);
    throw new Error('Leave record not found');
  }
});

const createLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.create({ ...req.body, employee: req.body.employeeId });
  const populated = await Leave.findById(leave._id)
    .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } });
  res.status(201).json(populated);
});

const updateLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (leave) {
    Object.assign(leave, req.body);
    if (req.body.status === 'approved' || req.body.status === 'rejected') {
      leave.approvedBy = req.user._id;
    }
    const updated = await leave.save();
    const populated = await Leave.findById(updated._id)
      .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
      .populate('approvedBy', 'name');
    res.json(populated);
  } else {
    res.status(404);
    throw new Error('Leave record not found');
  }
});

const deleteLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (leave) {
    await leave.deleteOne();
    res.json({ message: 'Leave record removed' });
  } else {
    res.status(404);
    throw new Error('Leave record not found');
  }
});

const getLeaveStats = asyncHandler(async (req, res) => {
  const leaves = await Leave.find();
  const total = leaves.length;
  const pending = leaves.filter((l) => l.status === 'pending').length;
  const approved = leaves.filter((l) => l.status === 'approved').length;
  const rejected = leaves.filter((l) => l.status === 'rejected').length;

  const currentYear = new Date().getFullYear();
  const yearLeaves = leaves.filter(
    (l) => new Date(l.startDate).getFullYear() === currentYear && l.status === 'approved'
  );
  const totalDaysApproved = yearLeaves.reduce((sum, l) => sum + (l.days || 1), 0);

  res.json({ total, pending, approved, rejected, totalDaysApproved });
});

module.exports = {
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  deleteLeave,
  getLeaveStats,
};
