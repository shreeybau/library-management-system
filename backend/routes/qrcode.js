const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const db = require('../db');

// Generate QR code for a book
router.post('/generate/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;

    // Get book from database
    const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
    const book = stmt.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Create QR data (you can customize this format)
    const qrData = `BOOK_ID:${book.id}|ISBN:${book.isbn}|TITLE:${book.title}`;

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(qrData);

    // Save QR code reference to database
    const updateStmt = db.prepare('UPDATE books SET qr_code = ? WHERE id = ?');
    updateStmt.run(qrData, bookId);

    res.json({
      id: book.id,
      title: book.title,
      author: book.author,
      qrData: qrData,
      qrCode: qrCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Get QR code for a book
router.get('/:bookId', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
    const book = stmt.get(req.params.bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (!book.qr_code) {
      return res.status(404).json({ error: 'QR code not generated for this book' });
    }

    res.json({
      id: book.id,
      title: book.title,
      qrData: book.qr_code,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get QR code' });
  }
});

module.exports = router;
