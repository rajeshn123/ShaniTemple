const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Ensure initial seed documents exist in Firestore
let isSeeded = false;
async function ensureSeeded() {
  if (isSeeded) return;
  try {
    const snap = await db.collection('bookings').limit(1).get();
    if (snap.empty) {
      console.log('🌱 Seeding initial temple bookings into Cloud Firestore...');
      const batch = db.batch();

      const initialBookings = [
        {
          booking_id: 'SHANI-2026-8912',
          devotee_name: 'ವೆಂಕಟೇಶ್ ಮೂರ್ತಿ (Venkatesh Murthy)',
          phone: '9845123456',
          gothra: 'Kashyapa (ಕಶ್ಯಪ)',
          nakshatra: 'Rohini (ರೋಹಿಣಿ)',
          seva_type: 'taila',
          seva_name: 'Tailabhisheka (ತೈಲಾಭಿಷೇಕ - ಎಳ್ಳೆಣ್ಣೆ)',
          seva_date: '2026-11-21',
          seva_time: '06:00 AM',
          amount: 251,
          family_members: [
            { name: 'Sujatha V', nakshatra: 'Mrigashirsha (ಮೃಗಶಿರ)', relationship: 'Spouse (ಪತ್ನಿ / ಪತಿ)' },
            { name: 'Abhinav Murthy', nakshatra: 'Punarvasu (ಪುನರ್ವಸು)', relationship: 'Son (ಪುತ್ರ / ಮಗ)' }
          ],
          payment_method: 'UPI',
          payment_status: 'PAID',
          payment_ref: 'UPI-SHANI-98218273',
          booking_status: 'CONFIRMED',
          created_at: new Date().toISOString()
        },
        {
          booking_id: 'SHANI-2026-4421',
          devotee_name: 'ಅನನ್ಯ ಶರ್ಮ (Ananya Sharma)',
          phone: '9886543210',
          gothra: 'Bharadwaja (ಭಾರದ್ವಾಜ)',
          nakshatra: 'Ashwini (ಅಶ್ವಿನಿ)',
          seva_type: 'milk',
          seva_name: 'Milk Abhisheka (ಕ್ಷೀರಾಭಿಷೇಕ)',
          seva_date: '2026-11-21',
          seva_time: '06:00 AM',
          amount: 151,
          family_members: [],
          payment_method: 'UPI',
          payment_status: 'PAID',
          payment_ref: 'UPI-SHANI-11293847',
          booking_status: 'COMPLETED',
          created_at: new Date().toISOString()
        },
        {
          booking_id: 'SHANI-2026-7362',
          devotee_name: 'ರಾಘವೇಂದ್ರ ರಾವ್ (Raghavendra Rao)',
          phone: '9448112233',
          gothra: 'Vasishta (ವಸಿಷ್ಠ)',
          nakshatra: 'Pushya (ಪುಷ್ಯ)',
          seva_type: 'panchamrutha',
          seva_name: 'Panchamrutha Abhisheka (ಪಂಚಾಮೃತಾಭಿಷೇಕ)',
          seva_date: '2026-11-28',
          seva_time: '06:00 AM',
          amount: 501,
          family_members: [
            { name: 'Padmavathi Rao', nakshatra: 'Uttara Phalguni (ಉತ್ತರ ಫಲ್ಗುಣಿ)', relationship: 'Spouse (ಪತ್ನಿ / ಪತಿ)' }
          ],
          payment_method: 'UPI',
          payment_status: 'PAID',
          payment_ref: 'UPI-SHANI-55619283',
          booking_status: 'CONFIRMED',
          created_at: new Date().toISOString()
        }
      ];

      for (const item of initialBookings) {
        const docRef = db.collection('bookings').doc();
        batch.set(docRef, item);
      }
      await batch.commit();
      console.log('✅ Initial Firestore seeding complete.');
    }
    isSeeded = true;
  } catch (err) {
    console.warn('Seed check warning:', err.message);
  }
}

/**
 * 1. Create booking in Firestore
 */
async function createBooking(bookingData) {
  await ensureSeeded();
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

  const docRef = await db.collection('bookings').add(bookingDoc);
  return { id: docRef.id, ...bookingDoc };
}

/**
 * 2. Lookup bookings
 */
async function lookupBookings(query) {
  await ensureSeeded();
  const cleanQuery = (query || '').trim();
  const cleanDigits = cleanQuery.replace(/\D/g, '');
  const col = db.collection('bookings');
  let results = [];

  if (cleanDigits.length >= 7) {
    const snapshot = await col.where('phone', '==', cleanDigits.slice(-10)).get();
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
  } else {
    const snapshot = await col.where('booking_id', '==', cleanQuery.toUpperCase()).get();
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
  }

  results.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return results;
}

/**
 * 3. List bookings for Admin
 */
async function listBookings(filters = {}) {
  await ensureSeeded();
  const { date, startDate, endDate, sevaType, search, status } = filters;

  let queryRef = db.collection('bookings');

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

/**
 * 4. Update booking status
 */
async function updateBookingStatus(id, newStatus) {
  const docRef = db.collection('bookings').doc(String(id));
  const doc = await docRef.get();
  if (doc.exists) {
    await docRef.update({ booking_status: newStatus });
    return true;
  }

  const querySnap = await db.collection('bookings').where('booking_id', '==', String(id)).limit(1).get();
  if (!querySnap.empty) {
    await querySnap.docs[0].ref.update({ booking_status: newStatus });
    return true;
  }
  return false;
}

/**
 * 5. Compute Admin stats
 */
async function getAdminStats() {
  await ensureSeeded();
  const todayStr = new Date().toISOString().split('T')[0];
  const snapshot = await db.collection('bookings').get();

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

module.exports = {
  createBooking,
  lookupBookings,
  listBookings,
  updateBookingStatus,
  getAdminStats
};
