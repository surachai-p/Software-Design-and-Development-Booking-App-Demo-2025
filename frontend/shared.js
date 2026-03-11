// ─── Shared State & Utilities ───────────────────────────────────────────────
const USERS = [{ id: 1, username: 'admin', password: 'admin123', role: 'admin' }];

let bookings = [
  { id: 1, fullname: 'สมชาย ใจดี',     email: 'somchai@example.com',   phone: '0812345678', checkin: '2025-04-01', checkout: '2025-04-03', roomtype: 'deluxe',   guests: 2, status: 'pending', comment: 'ต้องการห้องชั้นล่าง' },
  { id: 2, fullname: 'วิภาวดี รักไทย', email: 'wipawadee@example.com', phone: '0898765432', checkin: '2025-04-05', checkout: '2025-04-08', roomtype: 'suite',    guests: 3, status: 'pending', comment: '' },
  { id: 3, fullname: 'ประสิทธิ์ มีสุข', email: 'prasit@example.com',    phone: '0823456789', checkin: '2025-04-10', checkout: '2025-04-11', roomtype: 'standard', guests: 1, status: 'pending', comment: 'ขอเตียงเดี่ยว' },
];
let nextId = 4;

const roomNames = { standard: 'ห้องมาตรฐาน', deluxe: 'ห้องดีลักซ์', suite: 'ห้องสวีท' };
const maxGuests = { standard: 2, deluxe: 3, suite: 4 };

// Session helpers (sessionStorage เพื่อแชร์ข้ามหน้า)
function saveSession(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
  // sync bookings ด้วย
  sessionStorage.setItem('bookings', JSON.stringify(bookings));
}

function loadSession() {
  const raw = sessionStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function syncBookings() {
  const raw = sessionStorage.getItem('bookings');
  if (raw) bookings = JSON.parse(raw);
}

function saveBookings() {
  sessionStorage.setItem('bookings', JSON.stringify(bookings));
}

function clearSession() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('bookings');
}

// DOM helpers
function val(id) { return document.getElementById(id).value.trim(); }
function esc(s)  { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function showAlert(id, msg, type = 'err') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'alert alert-' + type + (msg ? ' show' : '');
}

function openModal(id)  { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }