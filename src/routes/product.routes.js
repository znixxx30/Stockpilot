const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// Admin creates product
router.post('/', verifyToken, requireAdmin, productController.create);

// Logged-in users can view
router.get('/', verifyToken, productController.getAll);

// 🔥 ADD THIS — Admin updates product
router.put('/:id', verifyToken, requireAdmin, productController.update);

module.exports = router; // 🚨 THIS LINE IS CRITICAL