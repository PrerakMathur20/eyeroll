// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD.toString(),
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // This is for development; ensure proper security in production
  },
});

module.exports = pool;
