const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Any logged-in user can place order
router.post('/', verifyToken, orderController.create);

module.exports = router;