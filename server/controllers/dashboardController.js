const Request = require('../models/Request');
const User = require('../models/User');
const Department = require('../models/Department');
const asyncHandler = require('../utils/asyncHandler');

exports.getStats = asyncHandler(async (req, res, next) => {
  let baseCondition = {};

  if (req.user.role === 'employee') {
    // Employees only see stats for their own requests
    baseCondition.user = req.user.id;
  } else if (req.user.role === 'manager' && req.user.department) {
    // Managers see stats for requests raised by employees in their department
    const deptUsers = await User.find({ department: req.user.department }).select('_id');
    baseCondition.user = { $in: deptUsers.map(u => u._id) };
  }
  // Admins (and managers with no department) see company-wide stats

  const totalRequests = await Request.countDocuments(baseCondition);
  const pendingRequests = await Request.countDocuments({ ...baseCondition, status: 'pending' });
  const approvedRequests = await Request.countDocuments({ ...baseCondition, status: 'approved' });
  const rejectedRequests = await Request.countDocuments({ ...baseCondition, status: 'rejected' });

  res.status(200).json({
    success: true,
    data: { totalRequests, pendingRequests, approvedRequests, rejectedRequests }
  });
});