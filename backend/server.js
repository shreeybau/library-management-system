const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const booksRouter = require('./routes/books');
const transactionsRouter = require('./routes/transactions');
const qrcodeRouter = require('./routes/qrcode');
const exportRouter = require('./routes/export');

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Library Management System - Server is running! ✅' });
});

// Use routes
app.use('/api/books', booksRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/qrcode', qrcodeRouter);
app.use('/api/export', exportRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
