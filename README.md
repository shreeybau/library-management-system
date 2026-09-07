# 📚 Library Management System

A full-stack library management system with QR-code lookups, live overdue tracking, and a dark, cinematic UI — track every book, issue and return loans, generate scannable QR codes, and monitor the whole library from a live admin dashboard.

## Features

- **Book catalog** — add, view, and delete books with title, author, ISBN, category, and quantity
- **Search & filter** — search books by title/author/ISBN, filter by category and availability
- **Issue & Return management** — issue books to borrowers, return them, and view all currently active issues
- **QR code generation** — generate a scannable QR code per book for quick lookup
- **Admin dashboard** — total/available/issued/overdue book counts, full transaction table with search and status filtering, and CSV/Excel export
- **Overdue tracking** — automatically calculates and flags how many days a book is overdue based on a 14-day loan period

## Tech Stack

- **Frontend:** React, Axios, qrcode.react
- **Backend:** Node.js, Express
- **Database:** SQLite (via better-sqlite3)
- **Export:** exceljs, csv-writer

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Running

**1. Clone the repo**

    git clone https://github.com/YOUR_USERNAME/library-management-system.git
    cd library-management-system

**2. Set up the backend**

    cd backend
    npm install
    npm run dev

This starts the API server at `http://localhost:5000` and initializes the SQLite database automatically.

**3. Set up the frontend** (in a new terminal)

    cd frontend
    npm install
    npm start

This opens the app at `http://localhost:3000`.

> Both servers need to stay running simultaneously for the app to work.

## Project Structure

    library-management-system/
    ├── backend/
    │   ├── routes/          # API routes (books, transactions, qrcode, export, admin)
    │   ├── db.js            # SQLite connection & schema
    │   └── server.js        # Express app entry point
    └── frontend/
        └── src/
            ├── components/  # React components (BookList, IssueReturn, QRCodeGenerator, SearchFilter, ExportData, AdminDashboard)
            └── styles/       # Component-level CSS

## Additional Features Beyond the Original Scope

- **Admin Dashboard** with live stats (total/available/issued/overdue), searchable/filterable transaction history, and one-click CSV/Excel report downloads
- **Overdue day calculation** — each issued book shows exactly how many days overdue it is, computed server-side from the due date
- A custom dark, cinematic visual theme applied consistently across every page via CSS custom properties (design tokens), rather than per-component styling

## What I Learned

- Structuring a full-stack app with a clean separation between an Express/SQLite backend and a React frontend communicating over REST
- Debugging real-world issues across the stack: missing npm dependencies breaking server startup, request/response field mismatches between frontend forms and backend validation, and stale dev-server/browser caches masking whether code changes actually took effect
- Using CSS custom properties (`:root` variables) to drive a consistent theme across many components from a single source of truth, making a full visual redesign a matter of changing one file
- Writing SQL migrations that run safely on every server start (checking for a column's existence before altering a table) to evolve a schema without breaking existing data
- The importance of keeping frontend request payloads and backend validation logic in sync, and how a single field-name mismatch (`quantity` vs `total_copies`) can silently break an entire feature

## Known Limitations

- QR code "scanning" is currently manual (paste the generated QR data into a text field) rather than camera-based
- Overdue tracking only applies to books issued after the `due_date` column was added; previously issued books will need to be re-issued to get a due date

## Demo

[demo link]
