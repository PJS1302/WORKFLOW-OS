const asyncHandler = require('../utils/asyncHandler');
const { recommendImprovement } = require('../services/aiService');

exports.getRecommendations = asyncHandler(async (req, res, next) => {
  const { workflowType } = req.body;
  const recommendation = await recommendImprovement(workflowType);
  res.status(200).json({ success: true, data: recommendation });
});