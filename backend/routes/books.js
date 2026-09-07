const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all books
router.get('/', (req, res) => {
  try {
    const { search, category, availability } = req.query;

    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (availability === 'available') {
      query += ' AND available_copies > 0';
    } else if (availability === 'issued') {
      query += ' AND available_copies < total_copies';
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get single book
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
    const row = stmt.get(req.params.id);

    if (!row) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new book
router.post('/', (req, res) => {
  try {
    const { title, author, isbn, quantity, category } = req.body;
    const total_copies = quantity;

    if (!title || !author || !isbn || !total_copies) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(
      `INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
       VALUES (?, ?, ?, ?, ?, ?)`
    );

    const result = stmt.run(
      title,
      author,
      isbn,
      category || 'Uncategorized',
      total_copies,
      total_copies
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      title,
      author,
      isbn,
      category: category || 'Uncategorized',
      quantity: total_copies,
      total_copies,
      available_copies: total_copies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Update book
router.put('/:id', (req, res) => {
  try {
    const { title, author, category, total_copies } = req.body;

    const stmt = db.prepare(
      `UPDATE books SET title = ?, author = ?, category = ?, total_copies = ? WHERE id = ?`
    );

    stmt.run(title, author, category, total_copies, req.params.id);
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM books WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;