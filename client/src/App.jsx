import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SevaSelector from './components/SevaSelector';
import BookingForm from './components/BookingForm';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';
import MyBookings from './components/MyBookings';
import AdminPortal from './components/AdminPortal';
import { Sparkles, Calendar, ShieldCheck, MapPin, Phone, Clock, Heart, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'my-bookings' | 'admin'

  // Master Data
  const [sevas, setSevas] = useState([]);
  const [selectedSeva, setSelectedSeva] = useState(null);
  const [auspiciousDates, setAuspiciousDates] = useState([]);
  const [nakshatras, setNakshatras] = useState([]);
  const [gothras, setGothras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Flow State
  const [pendingBookingData, setPendingBookingData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Fetch initial master data
  useEffect(() => {
    async function loadData() {
      try {
        const [sevasRes, datesRes, refRes] = await Promise.all([
          fetch('/api/sevas'),
          fetch('/api/auspicious-dates'),
          fetch('/api/reference-data')
        ]);

        const sevasData = await sevasRes.json();
        const datesData = await datesRes.json();
        const refData = await refRes.json();

        if (sevasData.sevas) {
          setSevas(sevasData.sevas);
          // Default select the Tailabhisheka (most sacred for Shani dev)
          const taila = sevasData.sevas.find(s => s.id === 'taila') || sevasData.sevas[0];
          setSelectedSeva(taila);
        }

        if (datesData.dates) {
          setAuspiciousDates(datesData.dates);
        }

        if (refData.nakshatras) {
          setNakshatras(refData.nakshatras);
          setGothras(refData.gothras);
        }
      } catch (err) {
        console.error('Error loading master data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle Booking Form submission (Opens payment modal)
  const handleBookingSubmit = (formData) => {
    setPendingBookingData(formData);
    setShowPaymentModal(true);
  };

  // Handle Payment success (Posts to API and opens receipt)
  const handlePaymentSuccess = async (paymentRef) => {
    setShowPaymentModal(false);
    try {
      const payload = {
        ...pendingBookingData,
        paymentRef
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete booking');
      }

      setActiveReceipt(data.booking);
      setPendingBookingData(null);
    } catch (err) {
      alert('Error finalizing booking: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="text-4xl animate-bounce">🛕</div>
            <p className="text-sm font-sacred text-amber-300">
              Loading Sri Shaneeshwara Temple Seva Portal...
            </p>
          </div>
        ) : (
          <>
            {/* TAB 1: BOOK SEVA */}
            {activeTab === 'book' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Hero Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/80 via-slate-900 to-[#101728] border border-amber-600/40 p-6 sm:p-8 shadow-2xl">
                  <div className="max-w-3xl space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Shani Shanti & Navagraha Dosha Nivarana Seva</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-bold font-sacred text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 leading-tight">
                      Sacred Abhisheka Seva Booking
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      Book authentic Vedic Abhisheka performed on auspicious <strong>Saturdays (Shanivara)</strong>, <strong>Amavasya</strong>, and sacred Shani Parva days. The Head Archaka performs individual Sankalpa taking your <strong>Name, Gothra, and Janma Nakshatra</strong>.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-4 text-xs text-amber-200/90 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" /> 100% Vedic Rituals
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" /> Individual Sankalpa Recitation
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-amber-400" /> Consecrated Prasadam Dispatched
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seva Selector Cards */}
                <SevaSelector
                  sevas={sevas}
                  selectedSeva={selectedSeva}
                  onSelectSeva={(seva) => setSelectedSeva(seva)}
                />

                {/* Booking Form */}
                {selectedSeva && (
                  <BookingForm
                    selectedSeva={selectedSeva}
                    auspiciousDates={auspiciousDates}
                    nakshatras={nakshatras}
                    gothras={gothras}
                    onSubmitBooking={handleBookingSubmit}
                  />
                )}
              </div>
            )}

            {/* TAB 2: MY BOOKINGS */}
            {activeTab === 'my-bookings' && (
              <div className="animate-fadeIn">
                <MyBookings onOpenReceipt={(booking) => setActiveReceipt(booking)} />
              </div>
            )}

            {/* TAB 3: ADMIN PORTAL */}
            {activeTab === 'admin' && (
              <div className="animate-fadeIn">
                <AdminPortal
                  onOpenReceipt={(booking) => setActiveReceipt(booking)}
                  auspiciousDates={auspiciousDates}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedSeva && (
        <PaymentModal
          bookingData={pendingBookingData}
          selectedSeva={selectedSeva}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal
          booking={activeReceipt}
          onClose={() => setActiveReceipt(null)}
          onBookAnother={() => {
            setActiveReceipt(null);
            setActiveTab('book');
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-amber-900/40 bg-slate-950 text-slate-400 text-xs py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-amber-300 font-bold font-sacred text-base mb-2">
              ಶ್ರೀ ಶನೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನಮ್
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
              Sri Shaneeshwara Swamy Devasthanam is an ancient spiritual center dedicated to Lord Shani Bhagavan, removing hardships, blessing devotees with patience, strength, and divine karmic grace.
            </p>
            <p className="font-mono text-amber-400 text-[11px]">
              ॥ ಓಂ ಶಂ ಶನೈಶ್ಚರಾಯ ನಮಃ ॥
            </p>
          </div>

          <div>
            <h5 className="text-slate-200 font-semibold mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Temple Darshan & Pooja Timings
            </h5>
            <ul className="text-[11px] space-y-1.5 text-slate-400">
              <li>• <strong>Saturdays (Special):</strong> 05:30 AM to 01:30 PM & 04:30 PM to 09:30 PM</li>
              <li>• <strong>Weekdays:</strong> 06:00 AM to 12:00 PM & 05:30 PM to 08:30 PM</li>
              <li>• <strong>Morning Abhisheka Batches:</strong> 07:30 AM, 08:30 AM, 09:30 AM, 11:00 AM</li>
              <li>• <strong>Maha Mangalarathi:</strong> 12:30 PM & 08:30 PM</li>
            </ul>
          </div>

          <div>
            <h5 className="text-slate-200 font-semibold mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Contact & Location
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
              Sri Shaneeshwara Temple Trust, Devasthanam Main Road, Near Sacred Peepal Tree, Temple Nagar
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-amber-400" /> Seva Helpline: +91 98450 00000 / 080-26780000
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Email: seva@srisheneashwara.org
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Sri Shaneeshwara Swamy Temple Trust. All Rights Reserved.</span>
          <span className="text-amber-500/80 font-serif">॥ ಸರ್ವೇ ಭವಂತು ಸುಖಿನಃ ಸರ್ವೇ ಸಂತು ನಿರಾಮಯಾಃ ॥</span>
        </div>
      </footer>
    </div>
  );
}
