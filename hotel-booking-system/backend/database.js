const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./hotel_booking.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');

  db.serialize(() => {
    // สร้างตาราง users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )`, () => {
      // สร้าง User: admin และ Password: admin123
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', ?, 'admin')`, [hashedPassword]);
      console.log('Admin user created successfully!');
    });

    // สร้างตาราง bookings
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT, email TEXT, phone TEXT, checkin TEXT, checkout TEXT, roomtype TEXT, guests INTEGER, comment TEXT, status TEXT DEFAULT 'pending'
    )`);
  });
});

module.exports = db;