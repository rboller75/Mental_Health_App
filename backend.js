// Required packages
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const SECRET_KEY = 'your_secret_key';

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
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
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

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ userId: this.lastID });
    });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
    res.json({ token });
  });
});

// Create Entry (Protected)
app.post('/entries', authenticateToken, (req, res) => {
  const { date, mood, emotions, journal } = req.body;
  const user_id = req.user.id;

  db.run(`INSERT INTO entries (user_id, date, mood, emotions, journal) VALUES (?, ?, ?, ?, ?)`,
    [user_id, date, mood, emotions, journal],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ entryId: this.lastID });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});