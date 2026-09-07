import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState('');

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    if (!title || !author || !isbn || !quantity) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/books', {
        title,
        author,
        isbn,
        quantity: parseInt(quantity),
      });
      setBooks([...books, response.data]);
      setTitle('');
      setAuthor('');
      setIsbn('');
      setQuantity('');
    } catch (err) {
      console.error(err);
      alert('Failed to add book');
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete book');
    }
  };

  return (
    <div className="book-list-container">
      <h1>📚 Library Management System</h1>

      <form onSubmit={addBook} className="add-book-form">
        <h2>Add New Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button type="submit">Add Book</button>
      </form>

      {loading && <p>Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <div className="books-grid">
        {books.length === 0 ? (
          <p>No books in the library yet.</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Quantity:</strong> {book.quantity}</p>
              <button
                onClick={() => deleteBook(book.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;