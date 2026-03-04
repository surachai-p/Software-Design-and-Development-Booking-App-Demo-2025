const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('bookings.db', (err) => {
  if (err) console.error('Error connecting to database:', err);
  else {
    console.log('เชื่อมต่อฐานข้อมูล SQLite สำเร็จ');
    createTables();
  }
});

const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      checkin DATE NOT NULL,
      checkout DATE NOT NULL,
      roomtype TEXT NOT NULL,
      guests INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // สร้าง Admin เริ่มต้น
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
    ['admin', adminPassword, 'admin']
  );
};

module.exports = db;