const productService = require('../services/product.service');

// Create
exports.create = async (req, res) => {
  try {
    const productId = await productService.createProduct(req.body);

    res.status(201).json({
      message: "Product created",
      productId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all
exports.getAll = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};