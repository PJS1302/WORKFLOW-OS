const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/stats').get(getStats);

module.exports = router;