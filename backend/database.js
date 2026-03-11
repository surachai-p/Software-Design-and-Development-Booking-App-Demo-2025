const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./bookings.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
    }
});

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Bookings table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT,
        email TEXT,
        phone TEXT,
        checkin DATE,
        checkout DATE,
        roomtype TEXT,
        guests INTEGER,
        status TEXT DEFAULT 'pending',
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed admin user
    db.get("SELECT * FROM users WHERE username = 'admin'", async (err, row) => {
        if (!row) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
                ['admin', hashedPassword, 'admin'], 
                (err) => {
                    if (err) console.error('Error creating admin user:', err.message);
                    else console.log('Admin user created successfully');
                }
            );
        }
    });
});

module.exports = db;
