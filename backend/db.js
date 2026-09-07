const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'library.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      total_copies INTEGER NOT NULL,
      available_copies INTEGER NOT NULL,
      qr_code TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      borrower_name TEXT NOT NULL,
      borrower_id TEXT NOT NULL,
      issue_date DATETIME,
      return_date DATETIME,
      status TEXT DEFAULT 'issued',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id)
    );
  `);
};

createTables();

console.log('✅ Connected to SQLite database');
console.log('✅ Database tables initialized');

module.exports = db;
