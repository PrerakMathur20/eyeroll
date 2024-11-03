// backend/app.js
const express = require('express');
const cors = require('cors'); // Import cors
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  credentials: true, // Allow credentials if needed
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);

app.listen(5001, () => {
  console.log('Server running on http://localhost:5001');
});
