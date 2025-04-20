// Required packages
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// SQLite3 Database Setup
const db = new sqlite3.Database('./mental_health.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to the mental_health SQLite database.');
});

// Create Tables
const createTables = () => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    mood TEXT,
    emotions TEXT,
    journal TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
};

createTables();

// Health Check Route
app.get('/', (req, res) => {
  res.send('Mental Health App Backend is Running!');
});

// === USERS ROUTES ===
// Create User
app.post('/users', (req, res) => {
  const { username, email } = req.body;
  db.run(`INSERT INTO users (username, email) VALUES (?, ?)`,
    [username, email],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, username, email });
    });
});

// === ENTRIES ROUTES ===
// Create Entry
app.post('/entries', (req, res) => {
  const { user_id, date, mood, emotions, journal } = req.body;
  db.run(`INSERT INTO entries (user_id, date, mood, emotions, journal) VALUES (?, ?, ?, ?, ?)`,
    [user_id, date, mood, emotions, journal],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, user_id, date, mood, emotions, journal });
    });
});

// Get All Entries
app.get('/entries', (req, res) => {
  db.all(`SELECT * FROM entries`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update Entry
app.put('/entries/:id', (req, res) => {
  const { mood, emotions, journal } = req.body;
  const id = req.params.id;
  db.run(`UPDATE entries SET mood = ?, emotions = ?, journal = ? WHERE id = ?`,
    [mood, emotions, journal, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: `Entry ${id} updated.` });
    });
});

// Delete Entry
app.delete('/entries/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM entries WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Entry ${id} deleted.` });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

