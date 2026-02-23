const analyticsService = require('../services/analytics.service');

// 📊 Summary
exports.summary = async (req, res) => {
  try {
    const data = await analyticsService.getSummary();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏆 Top Products
exports.topProducts = async (req, res) => {
  try {
    const data = await analyticsService.getTopProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};