import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/IssueReturn.css';

const IssueReturn = () => {
  const [activeTab, setActiveTab] = useState('issue');
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Issue form
  const [issueData, setIssueData] = useState({
    book_id: '',
    borrower_name: '',
    borrower_id: '',
    qr_code: '',
  });

  // Return form
  const [returnData, setReturnData] = useState({
    transaction_id: '',
    qr_code: '',
  });

  useEffect(() => {
    fetchBooks();
    fetchTransactions();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch books');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!issueData.book_id || !issueData.borrower_name || !issueData.borrower_id || !issueData.qr_code) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/transactions/issue', issueData);
      alert('✅ Book issued successfully!');
      setIssueData({ book_id: '', borrower_name: '', borrower_id: '', qr_code: '' });
      fetchBooks();
      fetchTransactions();
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.error || 'Failed to issue book'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (e) => {
    e.preventDefault();
    if (!returnData.transaction_id || !returnData.qr_code) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/transactions/return', returnData);
      alert('✅ Book returned successfully!');
      setReturnData({ transaction_id: '', qr_code: '' });
      fetchBooks();
      fetchTransactions();
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.error || 'Failed to return book'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-return-container">
      <h1>📖 Issue & Return Management</h1>

      <div className="tabs">
        <button className={`tab ${activeTab === 'issue' ? 'active' : ''}`} onClick={() => setActiveTab('issue')}>
          📤 Issue Book
        </button>
        <button className={`tab ${activeTab === 'return' ? 'active' : ''}`} onClick={() => setActiveTab('return')}>
          📥 Return Book
        </button>
        <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
          📚 Active Issues
        </button>
      </div>

      {activeTab === 'issue' && (
        <form onSubmit={handleIssueBook} className="form-container">
          <h2>Issue a Book</h2>
          <select
            value={issueData.book_id}
            onChange={(e) => setIssueData({ ...issueData, book_id: e.target.value })}
            required
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} - Available: {book.available_copies}/{book.total_copies}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Borrower Name"
            value={issueData.borrower_name}
            onChange={(e) => setIssueData({ ...issueData, borrower_name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Borrower ID"
            value={issueData.borrower_id}
            onChange={(e) => setIssueData({ ...issueData, borrower_id: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Scan QR Code"
            value={issueData.qr_code}
            onChange={(e) => setIssueData({ ...issueData, qr_code: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Issue Book'}
          </button>
        </form>
      )}

      {activeTab === 'return' && (
        <form onSubmit={handleReturnBook} className="form-container">
          <h2>Return a Book</h2>

          <select
            value={returnData.transaction_id}
            onChange={(e) => setReturnData({ ...returnData, transaction_id: e.target.value })}
            required
          >
            <option value="">Select Active Transaction</option>
            {transactions
              .filter((t) => t.status === 'issued')
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} - Borrower: {t.borrower_name}
                </option>
              ))}
          </select>

          <input
            type="text"
            placeholder="Scan QR Code"
            value={returnData.qr_code}
            onChange={(e) => setReturnData({ ...returnData, qr_code: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Return Book'}
          </button>
        </form>
      )}

      {activeTab === 'active' && (
        <div className="active-issues">
          <h2>Currently Issued Books</h2>
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Borrower</th>
                <th>Borrower ID</th>
                <th>Issue Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((t) => t.status === 'issued')
                .map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>{t.author}</td>
                    <td>{t.borrower_name}</td>
                    <td>{t.borrower_id}</td>
                    <td>{new Date(t.issue_date).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IssueReturn;
