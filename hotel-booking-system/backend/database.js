const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

// สร้างหรือเชื่อมต่อ database
const db = new sqlite3.Database("./hotel.db", (err) => {
  if (err) {
    console.error("เชื่อมต่อฐานข้อมูลไม่สำเร็จ", err.message);
  } else {
    console.log("เชื่อมต่อฐานข้อมูลสำเร็จ");

    // ตาราง users
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `);

    // ตาราง bookings
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
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
      )
    `);

    // สร้าง admin account เริ่มต้น
    const adminPassword = bcrypt.hashSync("admin123", 10);

    db.run(
      `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
      ["admin", adminPassword, "admin"]
    );
  }
});

module.exports = db;