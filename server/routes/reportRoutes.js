const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/generate').post(authorize('admin', 'manager'), generateReport);

module.exports = router;