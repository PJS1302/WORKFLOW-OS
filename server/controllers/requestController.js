const Request = require('../models/Request');
const Workflow = require('../models/Workflow');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../services/emailService');
const { summarizeRequest } = require('../services/aiService');

exports.createRequest = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const workflow = await Workflow.findById(req.body.workflow);
  if (!workflow) return next(new ErrorResponse('Workflow not found', 404));

  req.body.type = workflow.type;
  
  // Simulate AI summary generation during creation
  req.body.description = await summarizeRequest(req.body.title, req.body.description);

  const request = await Request.create(req.body);

  // Notify Managers - prefer managers in the requester's own department,
  // but fall back to notifying every manager so a request never goes unseen.
  let managers = [];
  if (req.user.department) {
    managers = await User.find({ role: 'manager', department: req.user.department });
  }
  if (managers.length === 0) {
    managers = await User.find({ role: 'manager' });
  }

  if (managers.length > 0 && global.sendSocketNotification) {
    managers.forEach(m => {
      global.sendSocketNotification(m._id, { message: `New ${request.type} request: ${request.title}`, link: `/pending-approvals` });
      sendEmail(m.email, `New Request Pending Approval`, `A new request "${request.title}" requires your attention.`);
    });
  }

  res.status(201).json({ success: true, data: request });
});

exports.getRequests = asyncHandler(async (req, res, next) => {
  let query = {};
  if (req.user.role === 'employee') {
    query.user = req.user.id;
  } else if (req.user.role === 'manager') {
    query.status = 'pending';
    if (req.user.department) {
      const deptUsers = await User.find({ department: req.user.department }).select('_id');
      query.user = { $in: deptUsers.map(u => u._id) };
    }
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const requests = await Request.find(query)
    .populate('user', 'name email')
    .populate('workflow', 'name')
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');

  const total = await Request.countDocuments(query);

  res.status(200).json({
    success: true,
    count: requests.length,
    total,
    pagination: { page, pages: Math.ceil(total / limit) },
    data: requests
  });
});

exports.getRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id)
    .populate('user', 'name email')
    .populate('workflow', 'name')
    .populate('attachments', 'filename path');
  if (!request) return next(new ErrorResponse('Request not found', 404));
  res.status(200).json({ success: true, data: request });
});

exports.approveRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id).populate('workflow');
  if (!request) return next(new ErrorResponse('Request not found', 404));

  request.history.push({
    step: request.currentStep,
    approver: req.user.id,
    status: 'approved',
    comment: req.body.comment || 'Approved'
  });

  request.currentStep += 1;
  
  const totalSteps = request.workflow && request.workflow.steps ? request.workflow.steps.length : 1;
  if (request.currentStep > totalSteps) {
    request.status = 'approved';
  }

  await request.save();

  if (global.sendSocketNotification) {
    global.sendSocketNotification(request.user, { message: `Your request "${request.title}" was approved.`, link: `/my-requests` });
  }

  res.status(200).json({ success: true, data: request });
});

exports.rejectRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id);
  if (!request) return next(new ErrorResponse('Request not found', 404));

  request.status = 'rejected';
  request.history.push({
    step: request.currentStep,
    approver: req.user.id,
    status: 'rejected',
    comment: req.body.comment || 'Rejected'
  });

  await request.save();

  if (global.sendSocketNotification) {
    global.sendSocketNotification(request.user, { message: `Your request "${request.title}" was rejected.`, link: `/my-requests` });
  }

  res.status(200).json({ success: true, data: request });
});