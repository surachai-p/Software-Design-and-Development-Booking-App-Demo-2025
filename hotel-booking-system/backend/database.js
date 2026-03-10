const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs'); // ต้องดึง bcryptjs มาใช้เข้ารหัสรหัสผ่าน Admin

// 1. สร้างการเชื่อมต่อกับฐานข้อมูล (จะสร้างไฟล์ database.sqlite ให้ถ้ายังไม่มี)
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:', err.message);
  } else {
    console.log('เชื่อมต่อ SQLite สำเร็จ');
    createTables(); // เรียกใช้งานฟังก์ชันสร้างตารางหลังจากเชื่อมต่อสำเร็จ
  }
});

// 2. ฟังก์ชันสร้างตาราง (โค้ดเดิมของคุณ)
const createTables = () => {
  // ใช้ serialize เพื่อให้คำสั่งทำงานเรียงลำดับ 1 -> 2 -> 3
  db.serialize(() => {
    
    // 1. สร้างตาราง users
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id       INTEGER   PRIMARY KEY AUTOINCREMENT,
        username TEXT      UNIQUE NOT NULL,
        password TEXT      NOT NULL,
        role     TEXT      NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('สร้างตาราง users พัง:', err.message);
    });

    // 2. สร้างตาราง bookings
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
      if (err) console.error('สร้างตาราง bookings พัง:', err.message);
    });

    // 3. สร้าง admin account
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
      ['admin', adminPassword, 'admin'],
      (err) => {
        if (err) {
          console.error('สร้าง Admin พัง:', err.message);
        } else {
          console.log('เช็ค/สร้าง Admin สำเร็จ');
        }
      }
    );
  });
};

// 3. ส่งออก db ไปให้ไฟล์อื่น (เช่น server.js) ใช้งาน (บรรทัดนี้คือตัวแก้ Error 500)
module.exports = db;