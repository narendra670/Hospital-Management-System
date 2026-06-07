const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().populate('user', 'name email role').sort({ createdAt: -1 });
  res.json(employees);
});

const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate('user', 'name email role');
  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

const createEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.create(req.body);
  const populated = await Employee.findById(employee._id).populate('user', 'name email role');
  res.status(201).json(populated);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (employee) {
    Object.assign(employee, req.body);
    const updated = await employee.save();
    const populated = await Employee.findById(updated._id).populate('user', 'name email role');
    res.json(populated);
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (employee) {
    await employee.deleteOne();
    res.json({ message: 'Employee removed' });
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

const getEmployeeStats = asyncHandler(async (req, res) => {
  const employees = await Employee.find();
  const total = employees.length;
  const active = employees.filter((e) => e.status === 'active').length;
  const inactive = employees.filter((e) => e.status === 'inactive').length;
  const departments = [...new Set(employees.map((e) => e.department))];
  const deptCount = departments.length;
  res.json({ total, active, inactive, deptCount });
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
};
