const db = require('../config/db');

// 📊 SUMMARY
exports.getSummary = async () => {
  const [[revenue]] = await db.query(
    `SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue FROM orders WHERE status != 'cancelled'`
  );

  const [[orders]] = await db.query(
    `SELECT COUNT(*) AS totalOrders FROM orders`
  );

  const [[products]] = await db.query(
    `SELECT COUNT(*) AS totalProducts FROM products`
  );

  const [[quantitySold]] = await db.query(
    `SELECT IFNULL(SUM(quantity), 0) AS totalQuantitySold FROM order_items`
  );

  return {
    totalRevenue: revenue.totalRevenue,
    totalOrders: orders.totalOrders,
    totalProducts: products.totalProducts,
    totalQuantitySold: quantitySold.totalQuantitySold
  };
};

// 🏆 TOP SELLING PRODUCTS
exports.getTopProducts = async () => {
  const [rows] = await db.query(
    `
    SELECT 
      p.name,
      SUM(oi.quantity) AS totalSold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY oi.product_id
    ORDER BY totalSold DESC
    LIMIT 5
    `
  );

  return rows;
};