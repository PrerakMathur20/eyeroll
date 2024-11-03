// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// User registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate username length
  if (!username || username.length > 64) {
    return res.status(400).json({ error: 'Username must be 64 characters or less and cannot be empty.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, is_active_user) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, true] // default to active user
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    // Handle unique constraint violation for username
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login
// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

  if (userResult.rows.length === 0) return res.status(400).json({ error: 'Invalid username or password' });

  const user = userResult.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) return res.status(400).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});


module.exports = router;