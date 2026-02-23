const authService = require('../services/auth.service');

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userId = await authService.registerUser(name, email, password, role);

    res.status(201).json({
      message: 'User registered successfully',
      userId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const token = await authService.loginUser(email, password);

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};