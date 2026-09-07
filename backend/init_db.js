const pool = require('./db');

const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    return_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
  );
`;

async function initializeDatabase() {
  try {
    await pool.query(createTablesQuery);
    console.log('✅ Database tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    process.exit(1);
  }
}

initializeDatabase();