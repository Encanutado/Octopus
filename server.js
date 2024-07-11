const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// MySQL connection setup
const connection = mysql.createConnection({
    host: '192.168.1.60',
    user: 'root',
    password: 'Smartphone420',
    database: 'simple_app'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Registration route
app.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, address, age, gender, email, phoneNumber, dateOfBirth } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = 'INSERT INTO users (username, password_hash, first_name, last_name, address, age, gender, email, phone_number, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, hashedPassword, firstName, lastName, address, age, gender, email, phoneNumber, dateOfBirth], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error registering user');
            return;
        }
        res.status(201).send('User registered');
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error logging in');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid username or password');
            return;
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            res.status(401).send('Invalid username or password');
            return;
        }

        res.status(200).send('Login successful');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
