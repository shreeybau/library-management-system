import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_books: 0,
    available_books: 0,
    issued_books: 0,
    overdue_books: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('issued');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await axios.get(`${API_URL}/api/transactions`, { params });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`${API_URL}/api/export/${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `library_report.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      alert('❌ Failed to export report');
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>🛠 Admin Dashboard</h1>
      <p className="subtitle">Overview of library activity and outstanding loans</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Books</span>
          <span className="stat-value">{stats.total_books}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Available</span>
          <span className="stat-value green">{stats.available_books}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Issued</span>
          <span className="stat-value gold">{stats.issued_books}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Overdue</span>
          <span className="stat-value red">{stats.overdue_books}</span>
        </div>
      </div>

      <div className="dashboard-toolbar">
        <input
          type="text"
          placeholder="Search by title or borrower..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="issued">Issued</option>
          <option value="returned">Returned</option>
        </select>
        <div className="export-actions">
          <button onClick={() => handleExport('csv')}>Download CSV</button>
          <button onClick={() => handleExport('excel')}>Download Excel</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Borrower</th>
              <th>Borrower ID</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Overdue</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="empty-row">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="8" className="empty-row">No transactions found.</td></tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.author}</td>
                  <td>{t.borrower_name}</td>
                  <td>{t.borrower_id}</td>
                  <td>{t.issue_date ? new Date(t.issue_date).toLocaleDateString() : '—'}</td>
                  <td>{t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}</td>
                  <td>
                    <span className={`status-pill ${t.status}`}>{t.status}</span>
                  </td>
                  <td>
                    {t.days_overdue > 0 ? (
                      <span className="overdue-badge">{t.days_overdue}d overdue</span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
