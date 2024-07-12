const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/user', (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Internal server error');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(results[0]);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
