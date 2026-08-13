const Department = require('../models/Department');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getDepartments = asyncHandler(async (req, res, next) => {
  const departments = await Department.find().populate('head', 'name email');
  res.status(200).json({ success: true, count: departments.length, data: departments });
});

exports.getDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id).populate('head', 'name email');
  if (!department) return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: department });
});

exports.createDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.create(req.body);
  res.status(201).json({ success: true, data: department });
});

exports.updateDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!department) return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: department });
});

exports.deleteDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id);
  if (!department) return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
  await department.deleteOne();
  res.status(200).json({ success: true, data: {} });
});