const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analytics.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// Only admin should see analytics
router.get('/summary', verifyToken, requireAdmin, analyticsController.summary);
router.get('/top-products', verifyToken, requireAdmin, analyticsController.topProducts);

module.exports = router;