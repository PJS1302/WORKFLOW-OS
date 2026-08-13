const express = require('express');
const router = express.Router();
const { createRequest, getRequests, getRequest, approveRequest, rejectRequest } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getRequests)
  .post(createRequest);

router.route('/:id')
  .get(getRequest);

router.route('/:id/approve')
  .put(authorize('manager', 'admin'), approveRequest);

router.route('/:id/reject')
  .put(authorize('manager', 'admin'), rejectRequest);

module.exports = router;