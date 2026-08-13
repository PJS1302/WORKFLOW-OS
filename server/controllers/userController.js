const User = require('../models/User');
const Department = require('../models/Department');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  let query = {};
  if (req.query.role) query.role = req.query.role;
  if (req.query.search) query.name = new RegExp(req.query.search, 'i');

  const users = await User.find(query)
    .populate('department', 'name')
    .skip(startIndex)
    .limit(limit)
    .sort('name');

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination: { page, pages: Math.ceil(total / limit) },
    data: users
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('department', 'name');
  if (!user) return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  await user.deleteOne();
  res.status(200).json({ success: true, data: {} });
});