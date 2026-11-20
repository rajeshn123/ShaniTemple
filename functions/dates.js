// Generates auspicious temple dates: Saturdays, Amavasyas, and Shani festivals
function getAuspiciousDates(daysAhead = 120) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const knownAuspiciousEvents = [
    { date: '2026-11-21', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2026-11-28', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2026-12-05', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2026-12-08', label: 'Margashirsha Amavasya (Deepam & Pitru-Shani Seva)', type: 'amavasya' },
    { date: '2026-12-12', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2026-12-19', label: 'Shani Trayodashi (Highly Auspicious)', type: 'festival' },
    { date: '2026-12-26', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2027-01-02', label: 'Shanivara (New Year Special Shanivara)', type: 'saturday' },
    { date: '2027-01-06', label: 'Pushya Amavasya (Special Shani Pooja)', type: 'amavasya' },
    { date: '2027-01-09', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2027-01-16', label: 'Shanivara - Makara Sankranti Special', type: 'festival' },
    { date: '2027-01-23', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2027-01-30', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2027-02-05', label: 'Magha Amavasya (Mauni Amavasya - Shani Shanti)', type: 'amavasya' },
    { date: '2027-02-06', label: 'Shani Amavasya Maha Parva (Most Sacred)', type: 'festival' },
    { date: '2027-02-13', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2027-02-20', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2027-02-27', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2027-03-06', label: 'Shanivara (Saturday Abhisheka)', type: 'saturday' },
    { date: '2027-03-07', label: 'Phalguna Amavasya', type: 'amavasya' }
  ];

  const eventMap = new Map();
  knownAuspiciousEvents.forEach(e => eventMap.set(e.date, e));

  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    if (d.getDay() === 6 && !eventMap.has(dateStr)) {
      eventMap.set(dateStr, {
        date: dateStr,
        label: 'Shanivara (Saturday Abhisheka)',
        type: 'saturday'
      });
    }
  }

  return Array.from(eventMap.values())
    .filter(item => item.date >= today.toISOString().split('T')[0])
    .sort((a, b) => a.date.localeCompare(b.date));
}

module.exports = { getAuspiciousDates };
