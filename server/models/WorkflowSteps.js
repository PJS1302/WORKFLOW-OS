const mongoose = require('mongoose');

const workflowStepSchema = new mongoose.Schema({
  workflow: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
  name: { type: String, required: true },
  approverRole: { type: String, enum: ['manager', 'admin'], default: 'manager' },
  order: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('WorkflowStep', workflowStepSchema);