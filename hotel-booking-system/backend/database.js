const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('bookings.db', (err) => {
  if (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:', err);
  } else {
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
    createTables();
  }
});

const createTables = () => {
  db.serialize(() => {
    // ตาราง users สำหรับระบบ Login
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id       INTEGER   PRIMARY KEY AUTOINCREMENT,
        username TEXT      UNIQUE NOT NULL,
        password TEXT      NOT NULL,
        role     TEXT      NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('สร้างตาราง users ล้มเหลว:', err);
    });

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
    `, (err) => {
      if (err) console.error('สร้างตาราง bookings ล้มเหลว:', err);
    });

    // สร้าง admin account เริ่มต้น (INSERT OR IGNORE = ข้ามถ้ามีอยู่แล้ว)
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
      ['admin', adminPassword, 'admin'],
      (err) => {
        if (err) console.error('สร้าง admin user ล้มเหลว:', err);
      }
    );
  });
};

module.exports = db;
