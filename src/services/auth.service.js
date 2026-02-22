const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.registerUser = async (name, email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role || 'staff']
  );

  return result.insertId;
};