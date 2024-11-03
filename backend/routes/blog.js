// backend/routes/blog.js
const express = require('express');
const pool = require('../db');
const verifyToken = require('../middleware/auth'); // Ensure this is included

const router = express.Router();

// Get all blogs
router.get('/all', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve blogs' });
  }
});

// Create a new blog
router.post('/create', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  // Check if title and content are provided
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const author = req.userId; // Get userId from the verified token

  try {
    const result = await pool.query(
      'INSERT INTO blogs (title, content, author, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [title, content, author]
    );
    res.status(201).json(result.rows[0]); // Return the newly created blog
  } catch (error) {
    console.error('Error creating blog:', error); // Log the error
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Delete a blog
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM blogs WHERE id = $1 AND author = $2 RETURNING *', [id, req.userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error); // Log the error
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});


module.exports = router;
