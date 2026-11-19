import React, { useEffect } from 'react';
import { Printer, Download, CheckCircle, Sparkles, X, Calendar, User, Phone, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReceiptModal({ booking, onClose, onBookAnother }) {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const family = Array.isArray(booking.family_members)
    ? booking.family_members
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl my-8 bg-gradient-to-b from-[#141b2b] via-[#0d121f] to-[#070a12] rounded-3xl border border-amber-500/50 shadow-2xl p-6 sm:p-8 text-slate-100">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Receipt Container */}
        <div id="temple-receipt" className="border-2 border-amber-600/40 rounded-2xl p-6 bg-slate-950/70 relative overflow-hidden">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <span className="text-[180px]">🛕</span>
          </div>

          {/* Temple Letterhead */}
          <div className="text-center border-b border-amber-800/40 pb-4 mb-4">
            <div className="text-xs tracking-widest text-amber-400 font-serif mb-1">
              ॥ ಶ್ರೀ ಶನೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನ ಟ್ರಸ್ಟ್ ॥
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sacred text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              SRI SHANEESHWARA TEMPLE
            </h2>
            <p className="text-[11px] text-amber-300/80 font-serif uppercase tracking-wider">
              Sacred Abhisheka Seva Booking & Sankalpa Receipt
            </p>
            <p className="text-[10px] text-slate-400">
              Temple Reg. No: TR/BLR/1968/SHN • Devasthanam Rd, Temple Nagar
            </p>
          </div>

          {/* Success Banner */}
          <div className="flex items-center justify-between bg-emerald-950/50 border border-emerald-600/40 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-300">
                  Sankalpa Confirmed & Payment Received
                </p>
                <p className="text-[10px] text-emerald-400/80">
                  May Lord Shaneeshwara protect and bless your family
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Token / Ref No.</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-amber-300">
                {booking.booking_id}
              </span>
            </div>
          </div>

          {/* Seva & Timing Details */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/60 rounded-xl p-3.5 border border-slate-800 mb-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Seva Booked
              </span>
              <span className="font-bold text-amber-200 text-sm block">
                {booking.seva_name}
              </span>
              <span className="text-[11px] text-amber-400/90 font-medium">
                Dakshina Paid: ₹{booking.amount}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Pooja Date & Batch
              </span>
              <span className="font-bold text-slate-100 text-sm block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {booking.seva_date}
              </span>
              <span className="text-[11px] text-slate-300">
                Batch Time: <strong>{booking.seva_time || '08:00 AM'}</strong>
              </span>
            </div>
          </div>

          {/* Devotee Sankalpa Information */}
          <div className="border border-amber-900/40 rounded-xl p-3.5 bg-slate-900/40 mb-4 text-xs space-y-2">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>Devotee Sankalpa Particulars</span>
              <span className="text-[10px] text-slate-400 font-normal">Archana List</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Primary Devotee:</span>
                <span className="font-bold text-slate-100">{booking.devotee_name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Mobile Phone:</span>
                <span className="font-mono text-slate-200">+91 {booking.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Gothra:</span>
                <span className="font-semibold text-amber-200">{booking.gothra}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Nakshatra:</span>
                <span className="font-semibold text-amber-200">{booking.nakshatra}</span>
              </div>
            </div>

            {/* Family Members in Sankalpa */}
            {family && family.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 mt-2">
                <span className="text-[10px] text-slate-400 block mb-1">
                  Family Members in Sankalpa ({family.length}):
                </span>
                <div className="space-y-1">
                  {family.map((f, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded">
                      <span>
                        • <strong>{f.name}</strong> ({f.relationship})
                      </span>
                      <span className="text-amber-400 text-[10px]">{f.nakshatra}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment & Security Footnote */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-3 gap-2">
            <div>
              <span>Payment Ref: </span>
              <strong className="text-slate-200 font-mono">{booking.payment_ref}</strong>
              <span className="mx-2">•</span>
              <span className="text-emerald-400 font-medium">Status: {booking.payment_status}</span>
            </div>
            <div className="text-amber-400 font-serif">
              ॥ ಶುಭಮಸ್ತು • ಸರ್ವ ಕಾರ್ಯ ಸಿದ್ಧಿರ್ಭವತು ॥
            </div>
          </div>

          <div className="mt-3 p-2 bg-slate-900/80 rounded-lg text-[9px] text-slate-400 leading-relaxed border border-slate-800">
            <strong>Temple Guidelines:</strong> Please present this receipt on your mobile or in print at the Seva Counter before 07:30 AM. Traditional attire (Dhoti/Kurta for men, Saree/Chudidar for women) is recommended. If you cannot attend in person, the Acharya will perform the Sankalpa on your behalf and consecrated Raksha thread with Vibhuti prasadam can be collected anytime.
          </div>
        </div>

        {/* Action Buttons (Print-hidden) */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onBookAnother}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
          >
            Book Another Seva
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-900/50 flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
