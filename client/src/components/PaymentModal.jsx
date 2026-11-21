import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, QrCode, Smartphone, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { isNative } from '../config/api';

export default function PaymentModal({
  bookingData,
  selectedSeva,
  onClose,
  onPaymentSuccess
}) {
  const [processing, setProcessing] = useState(false);
  const [selectedApp, setSelectedApp] = useState('gpay');

  const handleLaunchUPI = () => {
    const upiUrl = `upi://pay?pa=srisheneashwara.trust@okhdfcbank&pn=Sri+Shaneeshwara+Swamy+Temple&am=${selectedSeva?.amount}&cu=INR&tn=${encodeURIComponent(selectedSeva?.name || 'Abhisheka')}`;
    window.location.href = upiUrl;
  };

  const handleSimulatePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const paymentRef = `UPI-SHANI-${Date.now().toString().slice(-8)}`;
      onPaymentSuccess(paymentRef);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-[#131a29] to-slate-950 rounded-3xl border border-amber-600/60 shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪔</span>
            <div>
              <h3 className="font-sacred font-bold text-amber-300 text-base">
                Temple Seva Dakshina
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Unified Payments Interface (UPI)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Box */}
        <div className="my-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-center">
          <p className="text-xs text-amber-300/80 uppercase tracking-widest font-serif">
            Total Dakshina Payable
          </p>
          <div className="text-3xl font-black text-amber-400 font-serif my-1">
            ₹{selectedSeva?.amount}
          </div>
          <p className="text-xs text-slate-300 font-medium">
            {selectedSeva?.name}
          </p>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sri Shaneeshwara Swamy Temple Trust Account</span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="relative p-2.5 bg-white rounded-xl shadow-lg ring-2 ring-amber-500/40">
            {/* High visual quality simulated QR code SVG */}
            <svg
              className="w-40 h-40"
              viewBox="0 0 100 100"
              fill="black"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Outer corner squares */}
              <rect x="10" y="10" width="22" height="22" fill="#0f172a" rx="3" />
              <rect x="14" y="14" width="14" height="14" fill="white" />
              <rect x="17" y="17" width="8" height="8" fill="#e65100" />

              <rect x="68" y="10" width="22" height="22" fill="#0f172a" rx="3" />
              <rect x="72" y="14" width="14" height="14" fill="white" />
              <rect x="75" y="17" width="8" height="8" fill="#e65100" />

              <rect x="10" y="68" width="22" height="22" fill="#0f172a" rx="3" />
              <rect x="14" y="72" width="14" height="14" fill="white" />
              <rect x="17" y="75" width="8" height="8" fill="#e65100" />

              {/* Data modules */}
              <circle cx="50" cy="50" r="8" fill="#d4af37" />
              <rect x="44" y="12" width="5" height="18" fill="#1e293b" />
              <rect x="52" y="16" width="6" height="6" fill="#1e293b" />
              <rect x="12" y="44" width="18" height="5" fill="#1e293b" />
              <rect x="70" y="44" width="18" height="6" fill="#1e293b" />
              <rect x="44" y="70" width="6" height="18" fill="#1e293b" />
              <rect x="54" y="76" width="6" height="6" fill="#1e293b" />
              <rect x="36" y="36" width="6" height="6" fill="#1e293b" />
              <rect x="58" y="36" width="6" height="6" fill="#1e293b" />
              <rect x="36" y="58" width="6" height="6" fill="#1e293b" />
              <rect x="58" y="58" width="6" height="6" fill="#1e293b" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded shadow">
                🛕
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            UPI ID: <span className="text-amber-300 font-semibold">srisheneashwara.trust@okhdfcbank</span>
          </p>
        </div>

        {/* UPI Apps selection */}
        <div className="mt-3">
          <p className="text-[11px] text-slate-400 mb-1.5 text-center">
            Or pay directly using installed UPI App:
          </p>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { id: 'gpay', label: 'GPay', color: 'border-blue-500/50 text-blue-400' },
              { id: 'phonepe', label: 'PhonePe', color: 'border-purple-500/50 text-purple-400' },
              { id: 'paytm', label: 'Paytm', color: 'border-cyan-500/50 text-cyan-400' },
              { id: 'bhim', label: 'BHIM', color: 'border-orange-500/50 text-orange-400' }
            ].map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => setSelectedApp(app.id)}
                className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold transition ${
                  selectedApp === app.id
                    ? 'bg-slate-800 text-white border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {app.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 space-y-2">
          {/* Direct UPI App launcher on Android */}
          <button
            type="button"
            onClick={handleLaunchUPI}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition"
          >
            <Smartphone className="w-4 h-4 text-slate-950" />
            <span>Pay via UPI App (GPay / PhonePe / Paytm)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-900" />
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={handleSimulatePayment}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verifying UPI Transaction...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Simulate Successful UPI Payment (₹{selectedSeva?.amount})</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 text-center"
          >
            Cancel & Return to Form
          </button>
        </div>
      </div>
    </div>
  );
}
