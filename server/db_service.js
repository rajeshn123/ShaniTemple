// Unified Database Service supporting Cloud Firestore (Production/Firebase) and SQLite (Local fallback)
const path = require('node:path');

// Determine if running in Firebase Cloud Functions / Cloud Run or explicit Firestore mode
const isCloudEnvironment = !!(
  process.env.K_SERVICE ||
  process.env.FUNCTION_NAME ||
  process.env.FIREBASE_CONFIG ||
  process.env.USE_FIRESTORE === 'true'
);

let firestoreDb = null;
if (isCloudEnvironment) {
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    firestoreDb = admin.firestore();
    console.log('🔥 Initialized Cloud Firestore database mode');
  } catch (err) {
    console.warn('⚠️ Firebase Admin initialization failed, falling back to SQLite:', err.message);
  }
}

// Fallback SQLite instance
let sqliteDb = null;
function getSqliteDb() {
  if (!sqliteDb) {
    sqliteDb = require('./db');
  }
  return sqliteDb;
}

/**
 * 1. Create a new booking
 */
async function createBooking(bookingData) {
  const {
    devoteeName,
    phone,
    gothra,
    nakshatra,
    seva,
    sevaDate,
    sevaTime,
    familyMembers,
    paymentMethod,
    paymentRef
  } = bookingData;

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `SHANI-${new Date().getFullYear()}-${randomSuffix}`;
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const createdAt = new Date().toISOString();
  const finalPaymentRef = paymentRef || `UPI-SHANI-${Date.now().toString().slice(-8)}`;

  const bookingDoc = {
    booking_id: bookingId,
    devotee_name: devoteeName.trim(),
    phone: cleanPhone,
    gothra: gothra.trim(),
    nakshatra: nakshatra.trim(),
    seva_type: seva.id,
    seva_name: seva.name,
    seva_date: sevaDate,
    seva_time: sevaTime || '06:00 AM',
    amount: seva.amount,
    family_members: familyMembers || [],
    payment_method: paymentMethod || 'UPI',
    payment_status: 'PAID',
    payment_ref: finalPaymentRef,
    booking_status: 'CONFIRMED',
    created_at: createdAt
  };

  // Firestore Mode
  if (firestoreDb) {
    const docRef = await firestoreDb.collection('bookings').add(bookingDoc);
    return { id: docRef.id, ...bookingDoc };
  }

  // SQLite Mode
  const db = getSqliteDb();
  const stmt = db.prepare(`
    INSERT INTO bookings (
      booking_id, devotee_name, phone, gothra, nakshatra, seva_type, seva_name,
      seva_date, seva_time, amount, family_members, payment_method, payment_status,
      payment_ref, booking_status, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const result = stmt.run(
    bookingDoc.booking_id,
    bookingDoc.devotee_name,
    bookingDoc.phone,
    bookingDoc.gothra,
    bookingDoc.nakshatra,
    bookingDoc.seva_type,
    bookingDoc.seva_name,
    bookingDoc.seva_date,
    bookingDoc.seva_time,
    bookingDoc.amount,
    JSON.stringify(bookingDoc.family_members),
    bookingDoc.payment_method,
    bookingDoc.payment_status,
    bookingDoc.payment_ref,
    bookingDoc.booking_status,
    bookingDoc.created_at
  );

  const newBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
  newBooking.family_members = JSON.parse(newBooking.family_members || '[]');
  return newBooking;
}

/**
 * 2. Lookup bookings by mobile phone or Booking Reference ID
 */
async function lookupBookings(query) {
  const cleanQuery = (query || '').trim();
  const cleanDigits = cleanQuery.replace(/\D/g, '');

  // Firestore Mode
  if (firestoreDb) {
    const col = firestoreDb.collection('bookings');
    let results = [];

    if (cleanDigits.length >= 7) {
      // Query by phone
      const snapshot = await col.where('phone', '>=', cleanDigits.slice(-10)).limit(20).get();
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.phone && data.phone.includes(cleanDigits)) {
          results.push({ id: doc.id, ...data });
        }
      });
    } else {
      // Query by booking_id
      const snapshot = await col.where('booking_id', '==', cleanQuery.toUpperCase()).get();
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
    }

    results.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    return results;
  }

  // SQLite Mode
  const db = getSqliteDb();
  let bookings;
  if (cleanDigits.length >= 7) {
    const stmt = db.prepare('SELECT * FROM bookings WHERE phone LIKE ? ORDER BY id DESC');
    bookings = stmt.all(`%${cleanDigits}%`);
  } else {
    const stmt = db.prepare('SELECT * FROM bookings WHERE booking_id LIKE ? ORDER BY id DESC');
    bookings = stmt.all(`%${cleanQuery.toUpperCase()}%`);
  }

  bookings.forEach(b => {
    b.family_members = typeof b.family_members === 'string' ? JSON.parse(b.family_members || '[]') : b.family_members;
  });
  return bookings;
}

/**
 * 3. List bookings for Admin Portal with filters & search
 */
async function listBookings(filters = {}) {
  const { date, startDate, endDate, sevaType, search, status } = filters;

  // Firestore Mode
  if (firestoreDb) {
    let queryRef = firestoreDb.collection('bookings');

    if (date) {
      queryRef = queryRef.where('seva_date', '==', date);
    }
    if (startDate) {
      queryRef = queryRef.where('seva_date', '>=', startDate);
    }
    if (endDate) {
      queryRef = queryRef.where('seva_date', '<=', endDate);
    }
    if (sevaType) {
      queryRef = queryRef.where('seva_type', '==', sevaType);
    }
    if (status) {
      queryRef = queryRef.where('booking_status', '==', status);
    }

    const snapshot = await queryRef.get();
    let bookings = [];
    snapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    // In-memory filter for search terms (Name, Phone, Ref, Gothra)
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      bookings = bookings.filter(b =>
        (b.devotee_name && b.devotee_name.toLowerCase().includes(term)) ||
        (b.phone && b.phone.includes(term)) ||
        (b.booking_id && b.booking_id.toLowerCase().includes(term)) ||
        (b.gothra && b.gothra.toLowerCase().includes(term))
      );
    }

    bookings.sort((a, b) => (a.seva_date || '').localeCompare(b.seva_date || '') || (b.created_at || '').localeCompare(a.created_at || ''));
    return bookings;
  }

  // SQLite Mode
  const db = getSqliteDb();
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
    b.family_members = typeof b.family_members === 'string' ? JSON.parse(b.family_members || '[]') : b.family_members;
  });
  return bookings;
}

/**
 * 4. Update booking status
 */
async function updateBookingStatus(id, newStatus) {
  // Firestore Mode
  if (firestoreDb) {
    // If id is a Firestore document ID
    const docRef = firestoreDb.collection('bookings').doc(String(id));
    const doc = await docRef.get();
    if (doc.exists) {
      await docRef.update({ booking_status: newStatus });
      return true;
    }

    // Try finding by booking_id
    const querySnap = await firestoreDb.collection('bookings').where('booking_id', '==', String(id)).limit(1).get();
    if (!querySnap.empty) {
      await querySnap.docs[0].ref.update({ booking_status: newStatus });
      return true;
    }
    return false;
  }

  // SQLite Mode
  const db = getSqliteDb();
  const stmt = db.prepare('UPDATE bookings SET booking_status = ? WHERE id = ? OR booking_id = ?');
  const result = stmt.run(newStatus, id, id);
  return result.changes > 0;
}

/**
 * 5. Compute admin metrics & dashboard stats
 */
async function getAdminStats() {
  const todayStr = new Date().toISOString().split('T')[0];

  // Firestore Mode
  if (firestoreDb) {
    const snapshot = await firestoreDb.collection('bookings').get();
    let totalBookings = 0;
    let totalRevenue = 0;
    let completedCount = 0;
    let confirmedCount = 0;
    let todayCount = 0;
    const sevaCounts = {};

    snapshot.forEach(doc => {
      const b = doc.data();
      totalBookings++;
      totalRevenue += Number(b.amount || 0);
      if (b.booking_status === 'COMPLETED') completedCount++;
      if (b.booking_status === 'CONFIRMED') confirmedCount++;
      if (b.seva_date === todayStr) todayCount++;

      const key = b.seva_type || 'other';
      if (!sevaCounts[key]) {
        sevaCounts[key] = { seva_type: key, seva_name: b.seva_name, count: 0, totalAmount: 0 };
      }
      sevaCounts[key].count++;
      sevaCounts[key].totalAmount += Number(b.amount || 0);
    });

    return {
      totalBookings,
      totalRevenue,
      completedCount,
      confirmedCount,
      todayCount,
      sevaBreakdown: Object.values(sevaCounts)
    };
  }

  // SQLite Mode
  const db = getSqliteDb();
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

  const todayStmt = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE seva_date = ?');
  const todayCount = todayStmt.get(todayStr).count;

  return {
    totalBookings: totalStats.totalCount || 0,
    totalRevenue: totalStats.totalRevenue || 0,
    completedCount,
    confirmedCount,
    todayCount,
    sevaBreakdown
  };
}

module.exports = {
  createBooking,
  lookupBookings,
  listBookings,
  updateBookingStatus,
  getAdminStats
};
