const redisClient = require("../config/redis");
const db = require('../config/db');

// CREATE PRODUCT (Admin only)
exports.createProduct = async (data) => {
  const { name, sku, price, stock, low_stock_threshold } = data;

  const [result] = await db.query(
    `INSERT INTO products (name, sku, price, stock, low_stock_threshold)
     VALUES (?, ?, ?, ?, ?)`,
    [name, sku, price, stock, low_stock_threshold || 5]
  );
  await redisClient.del("products");

  return result.insertId;
};
//update product
exports.updateProduct = async (id, data) => {
  await db.query(
    `UPDATE products 
     SET name=?, sku=?, price=?, stock=?, low_stock_threshold=? 
     WHERE id=?`,
    [
      data.name,
      data.sku,
      data.price,
      data.stock,
      data.low_stock_threshold,
      id,
    ]
  );

  // 🔥 VERY IMPORTANT — clear cache
  await redisClient.del("products");
};

// GET ALL PRODUCTS
exports.getAllProducts = async () => {
  // 🔥 check cache first
  const cached = await redisClient.get("products");

  if (cached) {
    console.log("⚡ Products served from Redis");
    return JSON.parse(cached);
  }

  // 🐢 fallback to MySQL
  const [rows] = await db.query("SELECT * FROM products");

  const result = rows.map((product) => ({
    ...product,
    isLowStock: product.stock <= product.low_stock_threshold,
  }));

  // store in Redis for 60 seconds
  await redisClient.setEx("products", 60, JSON.stringify(result));

  console.log("🐢 Products served from MySQL");

  return result;
};