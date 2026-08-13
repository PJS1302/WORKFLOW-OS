const express = require('express');
const router = express.Router();
const { getTemplates, createTemplate, updateTemplate, deleteTemplate, getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow } = require('../controllers/workflowController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Template Routes
router.route('/templates')
  .get(getTemplates)
  .post(authorize('admin'), createTemplate);

router.route('/templates/:id')
  .put(authorize('admin'), updateTemplate)
  .delete(authorize('admin'), deleteTemplate);

// Workflow Routes
router.route('/')
  .get(getWorkflows)
  .post(authorize('admin'), createWorkflow);

router.route('/:id')
  .put(authorize('admin'), updateWorkflow)
  .delete(authorize('admin'), deleteWorkflow);

module.exports = router;