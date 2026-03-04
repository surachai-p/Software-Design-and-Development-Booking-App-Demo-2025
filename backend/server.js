const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(express.json());

// Middleware ตรวจสอบ Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    req.user = user;
    next();
  });
};

// --- Endpoints ---

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  });
});

// สร้างการจอง
app.post('/api/bookings', (req, res) => {
  const { fullname, email, phone, checkin, checkout, roomtype, guests } = req.body;
  const sql = `INSERT INTO bookings (fullname, email, phone, checkin, checkout, roomtype, guests) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [fullname, email, phone, checkin, checkout, roomtype, guests], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'จองสำเร็จ' });
  });
});

// ดูข้อมูลการจองทั้งหมด (ต้อง Login)
app.get('/api/bookings', authenticateToken, (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// ลบข้อมูล (ต้อง Login)
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM bookings WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    // ใช้ชื่อตามที่กำหนดในใบงาน
    res.json({ status: 'ลบข้อมูลสำเร็จโดย Weerapat Uamkasem' });
  });
});

app.listen(PORT, () => console.log(`Backend Server รันอยู่ที่พอร์ต ${PORT}`));