const express    = require('express');
const cors       = require('cors');
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');
const db         = require('./database');

const app        = express();
const PORT       = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Middleware: ตรวจสอบ JWT Token
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

// ================= API ENDPOINTS ================= //

// POST /api/login - เข้าสู่ระบบ
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err)   return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
});

// POST /api/bookings - สร้างการจองใหม่ (ไม่ต้อง Login)
app.post('/api/bookings', (req, res) => {
  const { fullname, email, phone, checkin, checkout, roomtype, guests } = req.body;
  const sql = `INSERT INTO bookings (fullname, email, phone, checkin, checkout, roomtype, guests) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [fullname, email, phone, checkin, checkout, roomtype, guests], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    db.get('SELECT * FROM bookings WHERE id = ?', [this.lastID], (err, row) => {
      res.status(201).json(row);
    });
  });
});

// GET /api/bookings - ดูการจองทั้งหมด (ต้อง Login)
app.get('/api/bookings', authenticateToken, (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/bookings/:id - ดูการจองรายบุคคล (ต้อง Login)
app.get('/api/bookings/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    res.json(row);
  });
});

// PUT /api/bookings/:id - แก้ไขการจอง (ต้อง Login)
app.put('/api/bookings/:id', authenticateToken, (req, res) => {
  const { fullname, email, phone, checkin, checkout, roomtype, guests, comment } = req.body;
  const sql = `UPDATE bookings SET fullname=?, email=?, phone=?, checkin=?, checkout=?, roomtype=?, guests=?, comment=? WHERE id=?`;
  db.run(sql, [fullname, email, phone, checkin, checkout, roomtype, guests, comment, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (err, row) => {
      res.json(row);
    });
  });
});

// DELETE /api/bookings/:id - ลบการจอง (ต้อง Login)
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM bookings WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    
    // 📌 แก้ไขตรงนี้: เปลี่ยนข้อความตอบกลับให้มีชื่อตามที่อาจารย์สั่ง
    res.json({ status: 'ลบข้อมูลสำเร็จโดย นายเสกสรรค์ ผคุโนพาส', id: req.params.id });
  });
});

// 📌 เพิ่มตรงนี้: GET /api/users - ดูรายการผู้ใช้ทั้งหมด โดยไม่แสดง password (ต้อง Login)
app.get('/api/users', authenticateToken, (req, res) => {
  const sql = 'SELECT id, username, role, created_at FROM users ORDER BY created_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));