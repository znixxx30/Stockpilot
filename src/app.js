const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes'); // ✅ ADD THIS
const orderRoutes = require('./routes/order.routes');
const { verifyToken, requireAdmin } = require('./middlewares/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes); // ✅ ADD THIS
app.use('/api/orders', orderRoutes);


// Protected Route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

// Admin Route
app.get('/api/admin', verifyToken, requireAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
});

db.query('SELECT 1')
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ DB Connection failed:', err));

app.get('/', (req, res) => {
  res.json({
    message: "StockPilot API is running",
    status: "success"
  });
});

module.exports = app;