import React, { useState } from 'react';
import { Search, Calendar, User, Phone, CheckCircle, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';

export default function MyBookings({ onOpenReceipt }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter your mobile phone number or Booking Reference ID');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch(`/api/bookings/lookup?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to search bookings');
      }
      setResults(data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-sacred text-amber-300">
          Devotee Seva Status & Receipt Lookup
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Track your upcoming Abhisheka schedule or retrieve your consecrated Seva receipt
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-amber-900/40 shadow-xl space-y-3">
        <label className="block text-xs font-semibold text-slate-300">
          Enter Registered Mobile Number or Booking Reference ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. 9845123456 or SHANI-2026-8912"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-950 text-slate-100 rounded-xl pl-10 pr-4 py-2.5 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Booking</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </p>
        )}
      </form>

      {/* Results Display */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Found {results.length} record(s)</span>
            <span>Sri Shaneeshwara Swamy Devasthanam</span>
          </div>

          {results.length === 0 ? (
            <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center space-y-2">
              <span className="text-3xl">🔍</span>
              <h3 className="text-sm font-semibold text-slate-300">No Bookings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No abhisheka seva records found for "{query}". Please verify the 10-digit mobile number or Booking ID.
              </p>
            </div>
          ) : (
            results.map((b) => (
              <div
                key={b.id}
                className="bg-slate-900/90 rounded-2xl p-5 border border-amber-900/30 hover:border-amber-600/50 transition shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                      {b.booking_id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        b.booking_status === 'COMPLETED'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                          : 'bg-amber-950/80 text-amber-300 border-amber-600/50'
                      }`}
                    >
                      {b.booking_status === 'COMPLETED' ? '✓ Pooja Performed' : 'Scheduled / Confirmed'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100">
                    {b.seva_name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {b.seva_date} ({b.seva_time || '08:00 AM'})
                    </span>
                    <span>
                      Devotee: <strong>{b.devotee_name}</strong>
                    </span>
                    <span>
                      Gothra: <strong>{b.gothra.split(' ')[0]}</strong>
                    </span>
                    <span>
                      Nakshatra: <strong>{b.nakshatra.split(' ')[0]}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                  <span className="text-sm font-bold text-amber-300 font-serif">
                    ₹{b.amount}
                  </span>
                  <button
                    onClick={() => onOpenReceipt(b)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-600/30 transition shadow"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
