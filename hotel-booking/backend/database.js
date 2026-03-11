const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// 1. เชื่อมต่อฐานข้อมูล
const db = new sqlite3.Database('./bookings.db', (err) => {
  if (err) return console.error(err.message);
  console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
});

// 2. สร้างตารางทั้งหมด (เขียนครั้งเดียว ไม่ต้องประกาศชื่อซ้ำ)
db.serialize(() => {
  // สร้างตาราง users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // สร้างตาราง bookings
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    email TEXT,
    phone TEXT,
    checkin TEXT,
    checkout TEXT,
    roomtype TEXT,
    guests INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 3. สร้าง User Admin เริ่มต้น (ถ้ายังไม่มี)
  const adminUser = 'admin';
  const adminPass = 'admin123';
  
  db.get('SELECT * FROM users WHERE username = ?', [adminUser], async (err, row) => {
    if (!row) {
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [adminUser, hashedPassword, 'admin']);
      console.log('สร้าง User Admin เรียบร้อย (admin / admin123)');
    }
  });
});

module.exports = db;
const createTables = () => {
  // ตาราง users สำหรับระบบ Login
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id       INTEGER   PRIMARY KEY AUTOINCREMENT,
      username TEXT      UNIQUE NOT NULL,
      password TEXT      NOT NULL,
      role     TEXT      NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ตาราง bookings สำหรับข้อมูลการจอง
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id         INTEGER   PRIMARY KEY AUTOINCREMENT,
      fullname   TEXT      NOT NULL,
      email      TEXT      NOT NULL,
      phone      TEXT      NOT NULL,
      checkin    DATE      NOT NULL,
      checkout   DATE      NOT NULL,
      roomtype   TEXT      NOT NULL,
      guests     INTEGER   NOT NULL,
      status     TEXT      DEFAULT 'pending',
      comment    TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // สร้าง admin account เริ่มต้น (INSERT OR IGNORE = ข้ามถ้ามีอยู่แล้ว)
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
    ['admin', adminPassword, 'admin']
  );
};

module.exports = db;