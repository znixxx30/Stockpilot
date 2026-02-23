const orderService = require('../services/order.service');

exports.create = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    const orderId = await orderService.createOrder(userId, items);

    res.status(201).json({
      message: "Order created successfully",
      orderId
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};