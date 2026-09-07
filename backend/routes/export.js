const express = require('express');
const router = express.Router();
const db = require('../db');
const ExcelJS = require('exceljs');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');

// Export to Excel
router.get('/excel', async (req, res) => {
  try {
    // Get all transactions
    const stmt = db.prepare(`
      SELECT t.id, t.book_id, b.title, b.author, t.borrower_name, t.borrower_id,
             t.issue_date, t.return_date, t.status, t.created_at
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      ORDER BY t.created_at DESC
    `);
    const transactions = stmt.all();

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Add headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Book Title', key: 'title', width: 20 },
      { header: 'Author', key: 'author', width: 15 },
      { header: 'Borrower Name', key: 'borrower_name', width: 15 },
      { header: 'Borrower ID', key: 'borrower_id', width: 12 },
      { header: 'Issue Date', key: 'issue_date', width: 15 },
      { header: 'Return Date', key: 'return_date', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Created At', key: 'created_at', width: 15 },
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667eea' },
    };

    // Add data
    transactions.forEach((trans) => {
      worksheet.addRow({
        id: trans.id,
        title: trans.title,
        author: trans.author,
        borrower_name: trans.borrower_name,
        borrower_id: trans.borrower_id,
        issue_date: trans.issue_date,
        return_date: trans.return_date,
        status: trans.status,
        created_at: trans.created_at,
      });
    });

    // Generate file
    const fileName = `library_transactions_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, '../exports', fileName);

    // Create exports folder if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../exports'))) {
      fs.mkdirSync(path.join(__dirname, '../exports'));
    }

    await workbook.xlsx.writeFile(filePath);

    // Send file
    res.download(filePath, fileName, (err) => {
      if (err) console.error(err);
      // Delete file after download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error(unlinkErr);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export to Excel' });
  }
});

// Export to CSV
router.get('/csv', async (req, res) => {
  try {
    // Get all transactions
    const stmt = db.prepare(`
      SELECT t.id, t.book_id, b.title, b.author, t.borrower_name, t.borrower_id,
             t.issue_date, t.return_date, t.status, t.created_at
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      ORDER BY t.created_at DESC
    `);
    const transactions = stmt.all();

    const fileName = `library_transactions_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../exports', fileName);

    // Create exports folder if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../exports'))) {
      fs.mkdirSync(path.join(__dirname, '../exports'));
    }

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Book Title' },
        { id: 'author', title: 'Author' },
        { id: 'borrower_name', title: 'Borrower Name' },
        { id: 'borrower_id', title: 'Borrower ID' },
        { id: 'issue_date', title: 'Issue Date' },
        { id: 'return_date', title: 'Return Date' },
        { id: 'status', title: 'Status' },
        { id: 'created_at', title: 'Created At' },
      ],
    });

    // Write data
    await csvWriter.writeRecords(transactions);

    // Send file
    res.download(filePath, fileName, (err) => {
      if (err) console.error(err);
      // Delete file after download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error(unlinkErr);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export to CSV' });
  }
});

module.exports = router;

