const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // LOAD ENV FIRST

const db = require('./config/db'); // THEN import DB

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB connection
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