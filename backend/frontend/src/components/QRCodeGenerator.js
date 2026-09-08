import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import { API_URL } from '../config';
import '../styles/QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/books`);
      setBooks(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch books');
    }
  };

  const generateQRCode = async (bookId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/qrcode/generate/${bookId}`);
      setQrCode(response.data);
      setSelectedBook(books.find(b => b.id === parseInt(bookId)));
      alert('✅ QR Code generated successfully!');
    } catch (err) {
      alert('❌ Failed to generate QR code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode.qrCode;
    link.download = `${selectedBook.title}_QR.png`;
    link.click();
  };

  return (
    <div className="qr-generator-container">
      <h1>🔲 QR Code Generator</h1>

      <div className="generator-section">
        <h2>Select a Book to Generate QR Code</h2>
        <select
          onChange={(e) => generateQRCode(e.target.value)}
          defaultValue=""
          disabled={loading}
        >
          <option value="">Choose a book...</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>
      </div>

      {qrCode && selectedBook && (
        <div className="qr-display-section">
          <h2>QR Code for: {selectedBook.title}</h2>
          <div className="qr-code-box">
            <QRCodeCanvas
              value={qrCode.qrData}
              size={256}
              level="H"
              includeMargin={true}
              id="qrCodeElement"
            />
          </div>
          <div className="qr-info">
            <p><strong>Title:</strong> {selectedBook.title}</p>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
            <p><strong>QR Data:</strong> {qrCode.qrData}</p>
          </div>
          <button onClick={downloadQRCode} className="download-btn">
            📥 Download QR Code
          </button>
        </div>
      )}

      {loading && <p className="loading">Generating QR Code...</p>}
    </div>
  );
};

export default QRCodeGenerator;
