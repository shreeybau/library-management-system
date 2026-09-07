import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SearchFilter.css';

const SearchFilter = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    availability: '',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
      setFilteredBooks(response.data);

      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(b => b.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.availability) params.append('availability', filters.availability);

      const response = await axios.get(`http://localhost:5000/api/books?${params}`);
      setFilteredBooks(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to filter books');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ search: '', category: '', availability: '' });
    setFilteredBooks(books);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="search-filter-container">
      <h1>🔍 Search & Filter Books</h1>

      <div className="filter-section">
        <div className="filter-group">
          <label>Search by Title, Author, or ISBN:</label>
          <input
            type="text"
            placeholder="Enter search term..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Availability:</label>
          <select
            value={filters.availability}
            onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
          >
            <option value="">All Books</option>
            <option value="available">Available Only</option>
            <option value="issued">Issued Only</option>
          </select>
        </div>

        <button onClick={resetFilters} className="reset-btn">
          🔄 Reset Filters
        </button>
      </div>

      {loading && <p>Loading books...</p>}

      <div className="books-grid">
        {filteredBooks.length === 0 ? (
          <p className="no-results">No books found matching your criteria.</p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Category:</strong> {book.category}</p>
              <p><strong>Available:</strong> {book.available_copies}/{book.total_copies}</p>
              <div className="availability-status">
                {book.available_copies > 0 ? (
                  <span className="available">✅ Available</span>
                ) : (
                  <span className="unavailable">❌ Not Available</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
