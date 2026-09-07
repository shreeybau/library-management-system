import React, { useState } from 'react';
import BookList from './components/Booklist';
import IssueReturn from './components/IssueReturn';
import QRCodeGenerator from './components/QRCodeGenerator';
import SearchFilter from './components/SearchFilter';
import ExportData from './components/ExportData';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="App">
      <nav className="navbar">
        <h1>📚 Library Management System</h1>
        <div className="nav-buttons">
          <button className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`} onClick={() => setCurrentPage('search')}>
            🔍 Search & Filter
          </button>
          <button className={`nav-btn ${currentPage === 'qrcode' ? 'active' : ''}`} onClick={() => setCurrentPage('qrcode')}>
            🔲 QR Code
          </button>
          <button className={`nav-btn ${currentPage === 'issue' ? 'active' : ''}`} onClick={() => setCurrentPage('issue')}>
            📖 Issue/Return
          </button>
          <button className={`nav-btn ${currentPage === 'export' ? 'active' : ''}`} onClick={() => setCurrentPage('export')}>
            📊 Export
          </button>
          <button className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`} onClick={() => setCurrentPage('admin')}>
            🛠 Admin
          </button>
        </div>
      </nav>

      <div className="container">
        {currentPage === 'dashboard' && <BookList />}
        {currentPage === 'search' && <SearchFilter />}
        {currentPage === 'qrcode' && <QRCodeGenerator />}
        {currentPage === 'issue' && <IssueReturn />}
        {currentPage === 'export' && <ExportData />}
        {currentPage === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}

export default App;
