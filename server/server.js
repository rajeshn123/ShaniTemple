const express = require('express');
const cors = require('cors');
const path = require('node:path');
const db = require('./db');
const { getAuspiciousDates } = require('./dates');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shani@admin2026';

app.use(cors());
app.use(express.json());

// Reference Data: 27 Vedic Nakshatras & Major Gothras (Kannada & English)
const NAKSHATRAS = [
  'Ashwini (ಅಶ್ವಿನಿ)',
  'Bharani (ಭರಣಿ)',
  'Krittika (ಕೃತಿಕಾ)',
  'Rohini (ರೋಹಿಣಿ)',
  'Mrigashirsha (ಮೃಗಶಿರ)',
  'Ardra (ಆರಿದ್ರಾ)',
  'Punarvasu (ಪುನರ್ವಸು)',
  'Pushya (ಪುಷ್ಯ)',
  'Ashlesha (ಆಶ್ಲೇಷಾ)',
  'Magha (ಮಖಾ)',
  'Purva Phalguni (ಪೂರ್ವ ಫಲ್ಗುಣಿ)',
  'Uttara Phalguni (ಉತ್ತರ ಫಲ್ಗುಣಿ)',
  'Hasta (ಹಸ್ತ)',
  'Chitra (ಚಿತ್ತಾ)',
  'Swati (ಸ್ವಾತಿ)',
  'Vishakha (ವಿಶಾಖಾ)',
  'Anuradha (ಅನೂರಾಧಾ)',
  'Jyeshtha (ಜ್ಯೇಷ್ಠ)',
  'Mula (ಮೂಲ)',
  'Purva Ashadha (ಪೂರ್ವಾಷಾಢ)',
  'Uttara Ashadha (ಉತ್ತರಾಷಾಢ)',
  'Shravana (ಶ್ರವಣ)',
  'Dhanishta (ಧನಿಷ್ಠಾ)',
  'Shatabhisha (ಶತಭಿಷಾ)',
  'Purva Bhadrapada (ಪೂರ್ವಾಭಾದ್ರ)',
  'Uttara Bhadrapada (ಉತ್ತರಾಭಾದ್ರ)',
  'Revati (ರೇವತಿ)'
];

const GOTHRAS = [
  'Kashyapa (ಕಶ್ಯಪ)',
  'Bharadwaja (ಭಾರದ್ವಾಜ)',
  'Vasishta (ವಸಿಷ್ಠ)',
  'Vishwamitra (ವಿಶ್ವಾಮಿತ್ರ)',
  'Gautama (ಗೌತಮ)',
  'Jamadagni (ಜಮದಗ್ನಿ)',
  'Atri (ಅತ್ರಿ)',
  'Agastya (ಅಗಸ್ತ್ಯ)',
  'Harita (ಹಾರೀತ)',
  'Kaundinya (ಕೌಂಡಿನ್ಯ)',
  'Shrivatsa (ಶ್ರೀವತ್ಸ)',
  'Sandilya (ಶಾಂಡಿಲ್ಯ)',
  'Mudgala (ಮುದ್ಗಲ)',
  'Parashara (ಪರಾಶರ)',
  'Angirasa (ಆಂಗಿರಸ)',
  'Other / Not Known (ಇತರ / ತಿಳಿದಿಲ್ಲ)'
];

const SEVAS = [
  {
    id: 'milk',
    name: 'Milk Abhisheka (ಕ್ಷೀರಾಭಿಷೇಕ)',
    amount: 151,
    deity: 'Lord Shaneeshwara',
    duration: '30 mins',
    timing: '07:30 AM & 10:00 AM',
    description: 'Sacred bath offered with fresh cow milk to Lord Shani.',
    significance: 'Cooling the planetary heat, bringing mental peace, harmony in family, and removing physical ailments.',
    prasadam: 'Pooja Kumkuma, Vibhuti, Panchamrutha Theertha & Akshathe.'
  },
  {
    id: 'taila',
    name: 'Tailabhisheka (ತೈಲಾಭಿಷೇಕ - ಎಳ್ಳೆಣ್ಣೆ)',
    amount: 251,
    deity: 'Lord Shaneeshwara',
    duration: '45 mins',
    timing: '08:30 AM & 11:00 AM',
    description: 'Devotional offering of pure black sesame (Til / Ellu) oil directly over the sacred Shani Shila.',
    significance: 'Most revered seva for Lord Shani. Pacifies Sade Sati (7.5 years transit), Ashtama Shani, Kantaka Shani, removes obstacles, and protects from accidents and malefic planetary influences.',
    prasadam: 'Raksha Sutra (black thread), consecrated sesame oil drops, Vibhuti & Shani Mahaprasadam.'
  },
  {
    id: 'panchamrutha',
    name: 'Panchamrutha Abhisheka (ಪಂಚಾಮೃತಾಭಿಷೇಕ)',
    amount: 501,
    deity: 'Lord Shaneeshwara',
    duration: '60 mins',
    timing: '09:00 AM & 11:30 AM',
    description: 'Grand sacred abhisheka using 5 divine nectars: Cow Milk, Curd, Desi Ghee, Pure Forest Honey, and Khanda Sugar/Fruits.',
    significance: 'Supreme purification of body, mind, and karma. Promotes longevity, spiritual illumination, prosperity, and total dissolution of severe graha doshas.',
    prasadam: 'Special Sankalpa Silver coin (token), consecrated Panchamrutha, Dry Fruits Prasadam, Raksha Thread & Temple Calendar.'
  }
];

// Helper to authenticate admin
function verifyAdmin(req, res, next) {
  const authHeader = req.headers['x-admin-password'] || req.query.password;
  if (!authHeader || authHeader !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
  }
  next();
}

// 1. Get Sevas
app.get('/api/sevas', (req, res) => {
  res.json({ success: true, sevas: SEVAS });
});

// 2. Get Auspicious Dates
app.get('/api/auspicious-dates', (req, res) => {
  const dates = getAuspiciousDates(120);
  res.json({ success: true, dates });
});

// 3. Get Reference Data (Nakshatras, Gothras)
app.get('/api/reference-data', (req, res) => {
  res.json({
    success: true,
    nakshatras: NAKSHATRAS,
    gothras: GOTHRAS
  });
});

// 4. Create Booking
app.post('/api/bookings', (req, res) => {
  try {
    const {
      devoteeName,
      phone,
      gothra,
      nakshatra,
      sevaType,
      sevaDate,
      sevaTime,
      familyMembers,
      paymentMethod,
      paymentRef
    } = req.body;

    // Validate inputs
    if (!devoteeName || !devoteeName.trim()) {
      return res.status(400).json({ error: 'Devotee Name is required' });
    }
    if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, '').slice(-10))) {
      return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
    }
    if (!gothra) {
      return res.status(400).json({ error: 'Gothra is required' });
    }
    if (!nakshatra) {
      return res.status(400).json({ error: 'Nakshatra is required' });
    }
    const seva = SEVAS.find(s => s.id === sevaType);
    if (!seva) {
      return res.status(400).json({ error: 'Invalid Seva type selected' });
    }
    if (!sevaDate) {
      return res.status(400).json({ error: 'Seva Date is required' });
    }

    // Generate unique booking ID: SHANI-YEAR-RANDOM
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SHANI-${new Date().getFullYear()}-${randomSuffix}`;
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    const stmt = db.prepare(`
      INSERT INTO bookings (
        booking_id, devotee_name, phone, gothra, nakshatra, seva_type, seva_name,
        seva_date, seva_time, amount, family_members, payment_method, payment_status,
        payment_ref, booking_status, created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const createdAt = new Date().toISOString();
    const finalPaymentRef = paymentRef || `UPI-SHANI-${Date.now().toString().slice(-8)}`;

    const result = stmt.run(
      bookingId,
      devoteeName.trim(),
      cleanPhone,
      gothra.trim(),
      nakshatra.trim(),
      seva.id,
      seva.name,
      sevaDate,
      sevaTime || '08:00 AM',
      seva.amount,
      JSON.stringify(familyMembers || []),
      paymentMethod || 'UPI',
      'PAID',
      finalPaymentRef,
      'CONFIRMED',
      createdAt
    );

    const newBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
    newBooking.family_members = JSON.parse(newBooking.family_members || '[]');

    res.status(201).json({
      success: true,
      message: 'Abhisheka booking confirmed successfully. May Lord Shaneeshwara shower his blessings upon your family.',
      booking: newBooking
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to process booking. ' + err.message });
  }
});

// 5. Devotee Lookup (by phone or booking ID)
app.get('/api/bookings/lookup', (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Please enter a phone number or Booking Reference ID' });
  }

  const cleanDigits = query.replace(/\D/g, '');
  let bookings;

  if (cleanDigits.length >= 7) {
    const stmt = db.prepare('SELECT * FROM bookings WHERE phone LIKE ? ORDER BY id DESC');
    bookings = stmt.all(`%${cleanDigits}%`);
  } else {
    const stmt = db.prepare('SELECT * FROM bookings WHERE booking_id LIKE ? ORDER BY id DESC');
    bookings = stmt.all(`%${query.toUpperCase()}%`);
  }

  bookings.forEach(b => {
    b.family_members = JSON.parse(b.family_members || '[]');
  });

  res.json({ success: true, count: bookings.length, bookings });
});

// 6. Admin: List Bookings with Filters & Search
app.get('/api/bookings', verifyAdmin, (req, res) => {
  try {
    const { date, startDate, endDate, sevaType, search, status } = req.query;

    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    if (date) {
      sql += ' AND seva_date = ?';
      params.push(date);
    }
    if (startDate) {
      sql += ' AND seva_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND seva_date <= ?';
      params.push(endDate);
    }
    if (sevaType) {
      sql += ' AND seva_type = ?';
      params.push(sevaType);
    }
    if (status) {
      sql += ' AND booking_status = ?';
      params.push(status);
    }
    if (search && search.trim()) {
      sql += ' AND (devotee_name LIKE ? OR phone LIKE ? OR booking_id LIKE ? OR gothra LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY seva_date ASC, id DESC';

    const stmt = db.prepare(sql);
    const bookings = stmt.all(...params);

    bookings.forEach(b => {
      b.family_members = JSON.parse(b.family_members || '[]');
    });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    console.error('Error fetching admin bookings:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Admin: Update Status
app.patch('/api/bookings/:id/status', verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const stmt = db.prepare('UPDATE bookings SET booking_status = ? WHERE id = ?');
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ success: true, message: `Booking status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Admin: Statistics & Overview
app.get('/api/admin/stats', verifyAdmin, (req, res) => {
  try {
    const totalStmt = db.prepare('SELECT COUNT(*) as totalCount, SUM(amount) as totalRevenue FROM bookings');
    const totalStats = totalStmt.get();

    const completedStmt = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE booking_status = 'COMPLETED'");
    const completedCount = completedStmt.get().count;

    const confirmedStmt = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE booking_status = 'CONFIRMED'");
    const confirmedCount = confirmedStmt.get().count;

    const sevaBreakdownStmt = db.prepare(`
      SELECT seva_type, seva_name, COUNT(*) as count, SUM(amount) as totalAmount
      FROM bookings
      GROUP BY seva_type, seva_name
    `);
    const sevaBreakdown = sevaBreakdownStmt.all();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayStmt = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE seva_date = ?');
    const todayCount = todayStmt.get(todayStr).count;

    res.json({
      success: true,
      stats: {
        totalBookings: totalStats.totalCount || 0,
        totalRevenue: totalStats.totalRevenue || 0,
        completedCount,
        confirmedCount,
        todayCount,
        sevaBreakdown
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Admin: Export CSV
app.get('/api/admin/export-csv', verifyAdmin, (req, res) => {
  try {
    const { date, startDate, endDate, sevaType, status, search } = req.query;

    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    if (date) {
      sql += ' AND seva_date = ?';
      params.push(date);
    }
    if (startDate) {
      sql += ' AND seva_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND seva_date <= ?';
      params.push(endDate);
    }
    if (sevaType) {
      sql += ' AND seva_type = ?';
      params.push(sevaType);
    }
    if (status) {
      sql += ' AND booking_status = ?';
      params.push(status);
    }
    if (search && search.trim()) {
      sql += ' AND (devotee_name LIKE ? OR phone LIKE ? OR booking_id LIKE ? OR gothra LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY seva_date ASC, id ASC';

    const stmt = db.prepare(sql);
    const bookings = stmt.all(...params);

    let csv = 'Booking ID,Devotee Name,Phone,Gothra,Nakshatra,Seva Name,Seva Date,Seva Time,Amount (INR),Payment Status,Payment Ref,Status,Family Members,Booked At\n';
    
    for (const b of bookings) {
      let family = '';
      try {
        const famArr = JSON.parse(b.family_members || '[]');
        family = famArr.map(f => `${f.name} (${f.nakshatra || ''} - ${f.relationship || ''})`).join('; ');
      } catch (e) {
        family = '';
      }

      const row = [
        `"${b.booking_id}"`,
        `"${b.devotee_name}"`,
        `"${b.phone}"`,
        `"${b.gothra}"`,
        `"${b.nakshatra}"`,
        `"${b.seva_name}"`,
        `"${b.seva_date}"`,
        `"${b.seva_time}"`,
        b.amount,
        `"${b.payment_status}"`,
        `"${b.payment_ref}"`,
        `"${b.booking_status}"`,
        `"${family.replace(/"/g, '""')}"`,
        `"${b.created_at}"`
      ];
      csv += row.join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ShaniTemple_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).send('Error exporting CSV: ' + err.message);
  }
});

// Serve frontend static build
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🛕 Sri Shaneeshwara Temple Server is running on http://localhost:${PORT}`);
});
