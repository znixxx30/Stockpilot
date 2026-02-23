const db = require('../config/db');

// CREATE PRODUCT (Admin only)
exports.createProduct = async (data) => {
  const { name, sku, price, stock, low_stock_threshold } = data;

  const [result] = await db.query(
    `INSERT INTO products (name, sku, price, stock, low_stock_threshold)
     VALUES (?, ?, ?, ?, ?)`,
    [name, sku, price, stock, low_stock_threshold || 5]
  );

  return result.insertId;
};


// GET ALL PRODUCTS
exports.getAllProducts = async () => {
  const [rows] = await db.query('SELECT * FROM products');

  return rows.map(product => ({
    ...product,
    isLowStock: product.stock <= product.low_stock_threshold
  }));
};