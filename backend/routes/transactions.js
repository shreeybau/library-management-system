const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all transactions
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT t.id, t.book_id, b.title, b.author, t.borrower_name, t.borrower_id, 
             t.issue_date, t.return_date, t.status, t.created_at
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      ORDER BY t.created_at DESC
    `);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get single transaction
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT t.id, t.book_id, b.title, b.author, t.borrower_name, t.borrower_id,
             t.issue_date, t.return_date, t.status, t.created_at
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      WHERE t.id = ?
    `);
    const row = stmt.get(req.params.id);
    
    if (!row) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Issue a book
router.post('/issue', (req, res) => {
  try {
    const { book_id, borrower_name, borrower_id, qr_code } = req.body;

    if (!book_id || !borrower_name || !borrower_id || !qr_code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if book exists and has available copies
    const bookStmt = db.prepare('SELECT * FROM books WHERE id = ?');
    const book = bookStmt.get(book_id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.available_copies <= 0) {
      return res.status(400).json({ error: 'No copies available' });
    }

    // Create transaction
    const transStmt = db.prepare(`
      INSERT INTO transactions (book_id, borrower_name, borrower_id, issue_date, status)
      VALUES (?, ?, ?, datetime('now'), 'issued')
    `);
    const result = transStmt.run(book_id, borrower_name, borrower_id);

    // Update book availability
    const updateStmt = db.prepare(
      'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?'
    );
    updateStmt.run(book_id);

    res.status(201).json({
      id: result.lastInsertRowid,
      book_id,
      borrower_name,
      borrower_id,
      status: 'issued',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to issue book' });
  }
});

// Return a book
router.post('/return', (req, res) => {
  try {
    const { transaction_id, qr_code } = req.body;

    if (!transaction_id || !qr_code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get transaction
    const transStmt = db.prepare('SELECT * FROM transactions WHERE id = ?');
    const transaction = transStmt.get(transaction_id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    // Update transaction
    const updateTransStmt = db.prepare(
      `UPDATE transactions SET return_date = datetime('now'), status = 'returned' WHERE id = ?`
    );
    updateTransStmt.run(transaction_id);

    // Update book availability
    const updateBookStmt = db.prepare(
      'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?'
    );
    updateBookStmt.run(transaction.book_id);

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

module.exports = router;
