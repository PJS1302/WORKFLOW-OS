const Request = require('../models/Request');
const asyncHandler = require('../utils/asyncHandler');

exports.generateReport = asyncHandler(async (req, res, next) => {
  const stats = await Request.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
      }
    }
  ]);

  res.status(200).json({ success: true, data: stats });
});