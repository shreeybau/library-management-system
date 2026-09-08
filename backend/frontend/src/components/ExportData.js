import React from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import '../styles/ExportData.css';

const ExportData = () => {
  const handleExport = async (format) => {
    try {
      const response = await axios.get(`${API_URL}/api/export/${format}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `library_transactions.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      alert('✅ File downloaded successfully!');
    } catch (err) {
      alert('❌ Failed to export data');
      console.error(err);
    }
  };

  return (
    <div className="export-container">
      <h1>📊 Export Data</h1>
      <div className="export-buttons">
        <button onClick={() => handleExport('excel')} className="export-btn excel-btn">
          📈 Export to Excel
        </button>
        <button onClick={() => handleExport('csv')} className="export-btn csv-btn">
          📄 Export to CSV
        </button>
      </div>
      <p>Download complete issue/return history with all transaction details.</p>
    </div>
  );
};

export default ExportData;
