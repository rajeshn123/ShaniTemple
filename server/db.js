const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'temple_bookings.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id TEXT UNIQUE NOT NULL,
    devotee_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    gothra TEXT NOT NULL,
    nakshatra TEXT NOT NULL,
    seva_type TEXT NOT NULL,
    seva_name TEXT NOT NULL,
    seva_date TEXT NOT NULL,
    seva_time TEXT NOT NULL DEFAULT '08:00 AM',
    amount INTEGER NOT NULL,
    family_members TEXT DEFAULT '[]',
    payment_method TEXT DEFAULT 'UPI',
    payment_status TEXT DEFAULT 'PAID',
    payment_ref TEXT,
    booking_status TEXT DEFAULT 'CONFIRMED',
    created_at TEXT NOT NULL
  );
`);

// Seed some initial bookings if empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM bookings');
const { count } = countStmt.get();

if (count === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO bookings (
      booking_id, devotee_name, phone, gothra, nakshatra, seva_type, seva_name,
      seva_date, seva_time, amount, family_members, payment_method, payment_status,
      payment_ref, booking_status, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const initialBookings = [
    [
      'SHANI-2026-8912',
      'Venkatesh Murthy',
      '9845123456',
      'Kashyapa',
      'Rohini',
      'taila',
      'Tailabhisheka (तैलभिषेक - तिल तैल)',
      '2026-11-21',
      '08:30 AM',
      251,
      JSON.stringify([
        { name: 'Sujatha V', nakshatra: 'Mrigashirsha', relationship: 'Spouse' },
        { name: 'Abhinav Murthy', nakshatra: 'Punarvasu', relationship: 'Son' }
      ]),
      'UPI',
      'PAID',
      'UPI-SHANI-98218273',
      'CONFIRMED',
      new Date().toISOString()
    ],
    [
      'SHANI-2026-4421',
      'Ananya Sharma',
      '9886543210',
      'Bharadwaja',
      'Ashwini',
      'milk',
      'Milk Abhisheka (क्षीराभिषेक)',
      '2026-11-21',
      '07:30 AM',
      151,
      JSON.stringify([]),
      'UPI',
      'PAID',
      'UPI-SHANI-11293847',
      'COMPLETED',
      new Date().toISOString()
    ],
    [
      'SHANI-2026-7362',
      'Raghavendra Rao',
      '9448112233',
      'Vasishta',
      'Pushya',
      'panchamrutha',
      'Panchamrutha Abhisheka (पंचामृताभिषेक)',
      '2026-11-28',
      '09:00 AM',
      501,
      JSON.stringify([
        { name: 'Padmavathi Rao', nakshatra: 'Uttara Phalguni', relationship: 'Spouse' }
      ]),
      'UPI',
      'PAID',
      'UPI-SHANI-55619283',
      'CONFIRMED',
      new Date().toISOString()
    ]
  ];

  for (const b of initialBookings) {
    insertStmt.run(...b);
  }
}

module.exports = db;
