import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Download,
  Printer,
  Filter,
  Search,
  CheckCircle,
  Clock,
  RefreshCw,
  Calendar,
  Users,
  IndianRupee,
  Eye,
  X,
  Sparkles,
  CalendarDays
} from 'lucide-react';

export default function AdminPortal({ onOpenReceipt, auspiciousDates = [] }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterSeva, setFilterSeva] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Priest Sankalpa Sheet Modal View
  const [showPriestSheet, setShowPriestSheet] = useState(false);

  // Helper date calculations
  const getSaturday = (weeksAhead = 0) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const daysUntilSat = (6 - day + 7) % 7;
    d.setDate(d.getDate() + daysUntilSat + weeksAhead * 7);
    return d.toISOString().split('T')[0];
  };

  const todayDateStr = new Date().toISOString().split('T')[0];
  const thisSaturdayStr = getSaturday(0);
  const nextSaturdayStr = getSaturday(1);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (password === 'shani@admin2026') {
      setIsAuthenticated(true);
      setAuthError('');
      fetchAdminData('shani@admin2026');
    } else {
      setAuthError('Incorrect Admin Password. (Default is shani@admin2026)');
    }
  };

  const handleQuickDemoUnlock = () => {
    setPassword('shani@admin2026');
    setIsAuthenticated(true);
    setAuthError('');
    fetchAdminData('shani@admin2026');
  };

  const fetchAdminData = async (pwd = password) => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pwd }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // 2. Fetch Bookings with date & other filters
      let url = `/api/bookings?password=${encodeURIComponent(pwd)}`;
      if (filterDate) url += `&date=${encodeURIComponent(filterDate)}`;
      if (filterSeva) url += `&sevaType=${encodeURIComponent(filterSeva)}`;
      if (filterStatus) url += `&status=${encodeURIComponent(filterStatus)}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [filterDate, filterSeva, filterStatus, searchTerm]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    let url = `/api/admin/export-csv?password=${encodeURIComponent(password)}`;
    if (filterDate) url += `&date=${encodeURIComponent(filterDate)}`;
    if (filterSeva) url += `&sevaType=${encodeURIComponent(filterSeva)}`;
    if (filterStatus) url += `&status=${encodeURIComponent(filterStatus)}`;
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
    window.open(url, '_blank');
  };

  const handleResetFilters = () => {
    setFilterDate('');
    setFilterSeva('');
    setFilterStatus('');
    setSearchTerm('');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900/90 rounded-3xl p-8 border border-amber-800/50 shadow-2xl space-y-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-950 mx-auto flex items-center justify-center text-3xl shadow-lg ring-1 ring-amber-400/30">
          🔒
        </div>
        <div>
          <h2 className="text-xl font-bold font-sacred text-amber-200">
            Temple Management Login
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted to Sri Shaneeshwara Temple Trustees & Head Priests
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 rounded-xl px-4 py-2.5 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-wider"
            />
            {authError && (
              <p className="text-xs text-red-400 mt-1.5">{authError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-sm text-white transition shadow-lg shadow-amber-950/40"
          >
            Authenticate & Open Dashboard
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800">
          <p className="text-[11px] text-slate-500 mb-2">
            Demo credentials preset: <code className="text-amber-400 font-mono">shani@admin2026</code>
          </p>
          <button
            type="button"
            onClick={handleQuickDemoUnlock}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
          >
            Click here for Instant Demo Unlock
          </button>
        </div>
      </div>
    );
  }

  // Calculate filtered totals
  const filteredRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-900/30 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-sacred text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Temple Trust Admin & Priest Portal</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage Abhisheka schedules, archana Sankalpa lists & accounts
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowPriestSheet(true)}
            className="px-3 py-2 rounded-xl bg-purple-950/80 border border-purple-700/60 text-purple-200 hover:bg-purple-900/80 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Priest Sankalpa Sheet</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title={filterDate ? `Export CSV for ${filterDate}` : 'Export all bookings to CSV'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV {filterDate && `(${filterDate})`}</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 hover:bg-red-900/50 text-xs font-semibold transition"
          >
            Lock
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-900/40 shadow">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Total Bookings
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-500 opacity-60" />
              <span>{stats.totalBookings}</span>
            </div>
            <span className="text-[10px] text-slate-400">All registered devotees</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-900/40 shadow">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Total Dakshina Seva
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 flex items-center gap-1 font-serif">
              <span>₹</span>
              <span>{stats.totalRevenue?.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[10px] text-slate-400">Direct to Temple Trust account</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-900/40 shadow">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Today's Sevas
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-sky-500 opacity-60" />
              <span>{stats.todayCount}</span>
            </div>
            <span className="text-[10px] text-slate-400">Batches for today</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-900/40 shadow">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Pooja Status
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-200 mt-1">
              <span className="text-emerald-400">{stats.completedCount} Done</span>
              <span className="text-slate-500 mx-1.5">/</span>
              <span className="text-amber-400">{stats.confirmedCount} Pend</span>
            </div>
            <span className="text-[10px] text-slate-400">Completed vs Pending</span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar with Complete Date Filtering */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-amber-900/30 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filter Bookings Ledger</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {bookings.length} record(s) matching criteria
          </span>
        </div>

        {/* Row 1: Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* 1. Date Picker Filter */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Pooja Date (ದಿನಾಂಕ)</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className={`w-full bg-slate-950 text-slate-100 rounded-xl px-3 py-2 border text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition ${
                  filterDate ? 'border-amber-500 ring-1 ring-amber-500/50' : 'border-slate-700'
                }`}
              />
              {filterDate && (
                <button
                  type="button"
                  onClick={() => setFilterDate('')}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                  title="Clear Date Filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Auspicious Dates Dropdown */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Temple Auspicious Days</span>
            </label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 rounded-xl px-3 py-2 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 truncate"
            >
              <option value="">-- All Auspicious Days --</option>
              {auspiciousDates?.slice(0, 15).map((d) => (
                <option key={d.date} value={d.date}>
                  {d.date} — {d.label.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Search */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Search Devotee / Phone</span>
            </label>
            <input
              type="text"
              placeholder="Name, Phone, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 rounded-xl px-3 py-2 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* 4. Seva Type */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-300">
              Seva Type (ಸೇವೆ)
            </label>
            <select
              value={filterSeva}
              onChange={(e) => setFilterSeva(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 rounded-xl px-3 py-2 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">All Abhisheka Types</option>
              <option value="milk">Milk Abhisheka (ಕ್ಷೀರಾಭಿಷೇಕ)</option>
              <option value="taila">Tailabhisheka (ತೈಲಾಭಿಷೇಕ)</option>
              <option value="panchamrutha">Panchamrutha (ಪಂಚಾಮೃತಾಭಿಷೇಕ)</option>
            </select>
          </div>

          {/* 5. Status & Reset */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-300">
              Pooja Status (ಸ್ಥಿತಿ)
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 rounded-xl px-3 py-2 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED (Pending)</option>
                <option value="COMPLETED">COMPLETED (Done)</option>
              </select>

              <button
                type="button"
                onClick={handleResetFilters}
                className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium shrink-0"
                title="Reset all filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Quick Date Preset Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">
            Quick Date Filter:
          </span>

          <button
            type="button"
            onClick={() => setFilterDate('')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
              !filterDate
                ? 'bg-amber-600 text-white border-amber-500 font-semibold shadow-sm'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            All Dates ({stats?.totalBookings || bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterDate(todayDateStr)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
              filterDate === todayDateStr
                ? 'bg-amber-600 text-white border-amber-500 font-semibold shadow-sm'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            Today ({todayDateStr})
          </button>

          <button
            type="button"
            onClick={() => setFilterDate(thisSaturdayStr)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
              filterDate === thisSaturdayStr
                ? 'bg-amber-600 text-white border-amber-500 font-semibold shadow-sm'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            This Saturday ({thisSaturdayStr})
          </button>

          <button
            type="button"
            onClick={() => setFilterDate(nextSaturdayStr)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
              filterDate === nextSaturdayStr
                ? 'bg-amber-600 text-white border-amber-500 font-semibold shadow-sm'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            Next Saturday ({nextSaturdayStr})
          </button>
        </div>

        {/* Active Filter Pill Summary Banner */}
        {filterDate && (
          <div className="bg-amber-950/50 border border-amber-600/50 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Filtered by Pooja Date:{' '}
                <strong className="text-amber-300 font-mono text-sm">{filterDate}</strong>
                {' '}(
                {new Date(filterDate + 'T00:00:00').toLocaleDateString('en-IN', {
                  weekday: 'long'
                })}
                ) — <strong>{bookings.length}</strong> booking(s) found, Total Dakshina:{' '}
                <strong className="text-emerald-400 font-serif">₹{filteredRevenue}</strong>
              </span>
            </div>

            <button
              onClick={() => setFilterDate('')}
              className="text-xs text-amber-300 hover:text-white underline font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Date Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span>Bookings Ledger ({bookings.length} found)</span>
            {filterDate && (
              <span className="text-[11px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/50 font-mono">
                Date: {filterDate}
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-500">
            Order: Chronological by Seva Date
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Devotee & Phone</th>
                <th className="py-3 px-4">Gothra & Nakshatra</th>
                <th className="py-3 px-4">Seva Name</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Family Sankalpa</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                    <div className="space-y-1">
                      <p className="text-base">📅</p>
                      <p className="font-semibold text-slate-300">
                        No bookings found {filterDate ? `for date ${filterDate}` : 'matching the selected filters'}.
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Try selecting another date or click "All Dates".
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const isMatchingFilteredDate = filterDate && b.seva_date === filterDate;
                  const isToday = b.seva_date === todayDateStr;

                  return (
                    <tr
                      key={b.id}
                      className={`hover:bg-slate-850/50 transition ${
                        isMatchingFilteredDate ? 'bg-amber-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-amber-300 text-[11px]">
                        {b.booking_id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100">{b.devotee_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">+91 {b.phone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-amber-200">{b.gothra.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-400">{b.nakshatra.split(' ')[0]}</div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-200">
                        {b.seva_name.split('(')[0]}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200 flex items-center gap-1.5">
                          <span>{b.seva_date}</span>
                          {isToday && (
                            <span className="text-[9px] bg-sky-950 text-sky-300 px-1.5 py-0.2 rounded border border-sky-700/50 font-bold">
                              TODAY
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-amber-400 font-medium">
                          {b.seva_time || '08:00 AM'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-400 max-w-xs">
                        {b.family_members && b.family_members.length > 0 ? (
                          <div>
                            <span className="text-amber-300 font-medium">
                              {b.family_members.length} member(s):
                            </span>{' '}
                            {b.family_members.map((m) => m.name).join(', ')}
                          </div>
                        ) : (
                          <span className="text-slate-600">Primary only</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-bold text-amber-400 font-serif">
                        ₹{b.amount}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                b.id,
                                b.booking_status === 'COMPLETED' ? 'CONFIRMED' : 'COMPLETED'
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                              b.booking_status === 'COMPLETED'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/60'
                                : 'bg-amber-950/80 text-amber-300 border-amber-600/50 hover:bg-amber-900/60'
                            }`}
                          >
                            {b.booking_status === 'COMPLETED' ? '✓ Performed' : 'Mark Done'}
                          </button>

                          <button
                            onClick={() => onOpenReceipt(b)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="View Receipt"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Priest Daily Sankalpa Sheet Modal */}
      {showPriestSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-6 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4 print:hidden">
              <h3 className="text-lg font-bold font-serif text-amber-900">
                Priest Archana & Sankalpa Chanting Sheet (ಪೂಜಾ ಸಂಕಲ್ಪ ಪತ್ರ)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-amber-700 text-white rounded-lg text-xs font-bold hover:bg-amber-800 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sheet</span>
                </button>
                <button
                  onClick={() => setShowPriestSheet(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="text-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold font-serif text-amber-950">
                ॥ ಶ್ರೀ ಶನೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನಮ್ ॥
              </h2>
              <p className="text-xs text-amber-900 font-semibold uppercase tracking-wider">
                Daily Abhishek Sankalpa Register for Temple Archaka (Priest)
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                Date:{' '}
                <strong className="text-slate-900 font-mono">
                  {filterDate || 'All Registered Dates'}
                </strong>{' '}
                • Total Devotee Sankalpas: <strong>{bookings.length}</strong>
              </p>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-center text-slate-500 py-6 text-xs">
                  No devotee Sankalpa records scheduled for this date.
                </p>
              ) : (
                bookings.map((b, idx) => (
                  <div key={b.id} className="border border-slate-300 rounded-lg p-3 bg-slate-50/50 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-1.5">
                      <span className="font-bold text-amber-950 text-sm">
                        #{idx + 1}. {b.seva_name} ({b.seva_time || '08:00 AM'})
                      </span>
                      <span className="font-mono text-xs text-slate-500">Ref: {b.booking_id}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Devotee Name:</span>
                        <strong className="text-slate-900 text-sm">{b.devotee_name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Gothra:</span>
                        <strong className="text-amber-900">{b.gothra}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Nakshatra:</span>
                        <strong className="text-amber-900">{b.nakshatra}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Pooja Date:</span>
                        <span className="font-mono text-slate-700 font-semibold">{b.seva_date}</span>
                      </div>
                    </div>

                    {b.family_members && b.family_members.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-slate-200/70 text-[11px]">
                        <span className="text-slate-600 font-semibold">Family Members in Sankalpa: </span>
                        {b.family_members.map((m, i) => (
                          <span key={i} className="inline-block mr-3">
                            <strong>{m.name}</strong> ({m.relationship}, {m.nakshatra})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
