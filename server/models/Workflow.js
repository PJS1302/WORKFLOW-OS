const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowTemplate', required: true },
  type: { 
    type: String, 
    enum: ['Leave Request', 'Purchase Request', 'Travel Request', 'Reimbursement Request', 'Document Approval', 'General Approval'],
    required: true
  },
  description: { type: String },
  steps: [{
    name: { type: String, required: true },
    approverRole: { type: String, enum: ['manager', 'admin'], default: 'manager' },
    order: { type: Number, required: true }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workflow', workflowSchema);