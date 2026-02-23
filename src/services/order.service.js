const db = require('../config/db');

exports.createOrder = async (userId, items) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let totalAmount = 0;

    // 1️⃣ Validate products & calculate total
    for (const item of items) {
      const [products] = await connection.query(
        'SELECT * FROM products WHERE id = ? FOR UPDATE',
        [item.product_id]
      );

      if (products.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const product = products[0];

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      totalAmount += product.price * item.quantity;

      // 2️⃣ Deduct stock
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // 3️⃣ Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, totalAmount, 'pending']
    );

    const orderId = orderResult.insertId;

    // 4️⃣ Insert order items
    for (const item of items) {
      const [products] = await connection.query(
        'SELECT price FROM products WHERE id = ?',
        [item.product_id]
      );

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, products[0].price]
      );
    }

    await connection.commit();
    connection.release();

    return orderId;

  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};