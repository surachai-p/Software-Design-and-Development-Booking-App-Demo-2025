const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_hotel_booking';

app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
        req.user = user;
        next();
    });
};

// POST /api/login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });
        if (!user) return res.status(401).json({ message: 'Invalid username or password' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    });
});

// POST /api/bookings (Public)
app.post('/api/bookings', (req, res) => {
    const { fullname, email, phone, checkin, checkout, roomtype, guests, comment } = req.body;
    const sql = `INSERT INTO bookings (fullname, email, phone, checkin, checkout, roomtype, guests, comment)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [fullname, email, phone, checkin, checkout, roomtype, guests, comment], function(err) {
        if (err) return res.status(500).json({ message: 'Error creating booking' });
        res.status(201).json({ id: this.lastID, message: 'Booking created successfully' });
    });
});

// GET /api/bookings (Protected)
app.get('/api/bookings', authenticateToken, (req, res) => {
    db.all('SELECT * FROM bookings ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error fetching bookings' });
        res.json(rows);
    });
});

// GET /api/bookings/:id (Protected)
app.get('/api/bookings/:id', authenticateToken, (req, res) => {
    db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error fetching booking' });
        if (!row) return res.status(404).json({ message: 'Booking not found' });
        res.json(row);
    });
});

// PUT /api/bookings/:id (Protected)
app.put('/api/bookings/:id', authenticateToken, (req, res) => {
    const { fullname, email, phone, checkin, checkout, roomtype, guests, status, comment } = req.body;
    const sql = `UPDATE bookings
                 SET fullname = ?, email = ?, phone = ?, checkin = ?, checkout = ?, roomtype = ?, guests = ?, status = ?, comment = ?
                 WHERE id = ?`;
    db.run(sql, [fullname, email, phone, checkin, checkout, roomtype, guests, status, comment, req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Error updating booking' });
        if (this.changes === 0) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking updated successfully' });
    });
});

// DELETE /api/bookings/:id (Protected)
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM bookings WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Error deleting booking' });
        if (this.changes === 0) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
