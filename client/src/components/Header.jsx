import React from 'react';
import { Sparkles, Calendar, Search, ShieldCheck, Flame } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="border-b border-amber-900/40 bg-gradient-to-r from-[#0a0d14] via-[#151a27] to-[#0a0d14] sticky top-0 z-40 backdrop-blur-md shadow-2xl">
      {/* Top Sacred Mantra Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-b border-amber-800/40 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-amber-200/90 tracking-widest font-serif overflow-hidden">
          <span className="hidden sm:inline">॥ ಓಂ ಶಂ ಶನೈಶ್ಚರಾಯ ನಮಃ ॥</span>
          <span className="mx-auto flex items-center gap-2 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>॥ ನೀಲಾಂಜನ ಸಮಾಭಾಸಂ ರವಿಪುತ್ರಂ ಯಮಾಗ್ರಜಮ್ । ಛಾಯಾಮಾರ್ತಾಂಡ ಸಂಭೂತಂ ತಂ ನಮಾಮಿ ಶನೈಶ್ಚರಮ್ ॥</span>
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          </span>
          <span className="hidden sm:inline">॥ ಓಂ ಪ್ರಾಂ ಪ್ರೀಂ ಪ್ರೌಂ ಸಃ ಶನೈಶ್ಚರಾಯ ನಮಃ ॥</span>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Temple Name & Logo */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('book')}>
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 p-0.5 shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/30 flex items-center justify-center relative group">
            <div className="w-full h-full rounded-2xl bg-slate-950/90 flex items-center justify-center text-2xl">
              🛕
            </div>
            <span className="absolute -bottom-1 -right-1 text-xs">✨</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-sacred text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-wider">
                ಶ್ರೀ ಶನೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನಮ್
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-amber-400/90 uppercase font-serif">
              Sri Shaneeshwara Swamy Temple
            </p>
            <p className="text-[11px] text-slate-400">
              Official Abhisheka Seva Booking & Sankalpa Portal
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 p-1.5 rounded-xl border border-amber-900/30 shadow-inner">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'book'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/40 ring-1 ring-amber-400/40'
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Book Abhisheka</span>
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'my-bookings'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/40 ring-1 ring-amber-400/40'
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>Lookup Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin Portal</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
