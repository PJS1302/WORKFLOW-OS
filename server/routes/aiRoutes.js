const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/recommendations').post(getRecommendations);

module.exports = router;