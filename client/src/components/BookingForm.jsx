import React, { useState } from 'react';
import { Calendar, User, Phone, Sparkles, Plus, Trash2, Heart, Info, Clock, AlertCircle } from 'lucide-react';

export default function BookingForm({
  selectedSeva,
  auspiciousDates,
  nakshatras,
  gothras,
  onSubmitBooking
}) {
  const [formData, setFormData] = useState({
    devoteeName: '',
    phone: '',
    gothra: 'Kashyapa (ಕಶ್ಯಪ)',
    customGothra: '',
    nakshatra: 'Rohini (ರೋಹಿಣಿ)',
    sevaDate: auspiciousDates?.[0]?.date || '',
    sevaTime: '08:00 AM',
    notes: ''
  });

  const [familyMembers, setFamilyMembers] = useState([]);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    nakshatra: 'Rohini (ರೋಹಿಣಿ)',
    relationship: 'Spouse'
  });

  const [errors, setErrors] = useState({});

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const addFamilyMember = () => {
    if (!newMember.name.trim()) {
      alert('Please enter family member name');
      return;
    }
    setFamilyMembers((prev) => [...prev, { ...newMember }]);
    setNewMember({
      name: '',
      nakshatra: 'Rohini (रोहिणी)',
      relationship: 'Spouse'
    });
    setShowAddFamily(false);
  };

  const removeFamilyMember = (index) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.devoteeName.trim()) {
      newErrors.devoteeName = 'Devotee Name is required for Sankalpa';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (!formData.sevaDate) {
      newErrors.sevaDate = 'Please select an auspicious date';
    }

    const finalGothra = formData.gothra.startsWith('Other')
      ? formData.customGothra.trim() || 'Kashyapa (Default)'
      : formData.gothra;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmitBooking({
      ...formData,
      gothra: finalGothra,
      familyMembers,
      amount: selectedSeva.amount,
      sevaType: selectedSeva.id
    });
  };

  const selectedDateObj = auspiciousDates?.find((d) => d.date === formData.sevaDate);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 2: Auspicious Date & Timing */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-amber-900/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold font-sacred text-amber-200 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Step 2: Auspicious Date & Time Slot</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly scheduled on Saturdays (Shanivara), Amavasyas & Special Shani Festivals
            </p>
          </div>
          {selectedDateObj && (
            <span className="hidden sm:inline-block text-[11px] px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 font-medium">
              ✨ {selectedDateObj.label}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Auspicious Date Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span>Select Auspicious Pooja Date *</span>
            </label>
            <select
              name="sevaDate"
              value={formData.sevaDate}
              onChange={handleInputChange}
              className={`w-full bg-slate-950 text-slate-100 rounded-xl px-3.5 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                errors.sevaDate ? 'border-red-500' : 'border-slate-700 hover:border-amber-600/70'
              }`}
            >
              <option value="" disabled>-- Select an Auspicious Temple Date --</option>
              {auspiciousDates?.map((d) => (
                <option key={d.date} value={d.date}>
                  {new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })} — {d.label}
                </option>
              ))}
            </select>
            {errors.sevaDate && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.sevaDate}
              </p>
            )}
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Morning Abhisheka Batch *</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['07:30 AM', '08:30 AM', '09:30 AM', '11:00 AM'].map((time) => (
                <button
                  type="button"
                  key={time}
                  onClick={() => setFormData((prev) => ({ ...prev, sevaTime: time }))}
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition ${
                    formData.sevaTime === time
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500 font-semibold shadow-inner'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Devotee & Sankalpa Details */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-amber-900/40 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-lg font-bold font-sacred text-amber-200 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              <span>Step 3: Devotee Sankalpa Information</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Provide Name, Gothra, Nakshatra and Phone Number for temple archana
            </p>
          </div>
          <span className="text-[11px] text-amber-400/90 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 self-start sm:self-auto">
            Vedic Sankalpa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Devotee Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Primary Devotee Name (ಯಜಮಾನರ ಹೆಸರು) *</span>
              <span className="text-[10px] text-slate-400 font-normal">As in Sankalpa</span>
            </label>
            <input
              type="text"
              name="devoteeName"
              placeholder="e.g., Rajesh Kumar"
              value={formData.devoteeName}
              onChange={handleInputChange}
              className={`w-full bg-slate-950 text-slate-100 rounded-xl px-3.5 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                errors.devoteeName ? 'border-red-500' : 'border-slate-700 hover:border-amber-600/70'
              }`}
            />
            {errors.devoteeName && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.devoteeName}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Mobile Phone Number *</span>
              <span className="text-[10px] text-slate-400 font-normal">For SMS & Receipt Lookup</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-slate-400 font-mono">
                +91
              </div>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full bg-slate-950 text-slate-100 rounded-xl pl-11 pr-3.5 py-2.5 border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                  errors.phone ? 'border-red-500' : 'border-slate-700 hover:border-amber-600/70'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Gothra */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Gothra (ಗೋತ್ರ) *</span>
              <span className="text-[10px] text-slate-400 font-normal">Vedic Lineage</span>
            </label>
            <select
              name="gothra"
              value={formData.gothra}
              onChange={handleInputChange}
              className="w-full bg-slate-950 text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-700 hover:border-amber-600/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            >
              {gothras?.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {formData.gothra.startsWith('Other') && (
              <input
                type="text"
                name="customGothra"
                placeholder="Enter your Gothra name"
                value={formData.customGothra}
                onChange={handleInputChange}
                className="w-full mt-2 bg-slate-950 text-slate-100 rounded-xl px-3.5 py-2 border border-amber-600/60 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            )}
          </div>

          {/* Nakshatra */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Birth Star / Nakshatra (ನಕ್ಷತ್ರ) *</span>
              <span className="text-[10px] text-slate-400 font-normal">27 Vedic Stars</span>
            </label>
            <select
              name="nakshatra"
              value={formData.nakshatra}
              onChange={handleInputChange}
              className="w-full bg-slate-950 text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-700 hover:border-amber-600/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            >
              {nakshatras?.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Family Members for Sankalpa (Optional) */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-amber-400" />
                <span>Family Members for Sankalpa (Optional)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                The Head Priest will chant names and nakshatras of family members during the Abhishek
              </p>
            </div>

            {!showAddFamily && (
              <button
                type="button"
                onClick={() => setShowAddFamily(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-700/60 text-amber-300 text-xs font-medium hover:bg-amber-900/60 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Family Member</span>
              </button>
            )}
          </div>

          {/* Added Family Members List */}
          {familyMembers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {familyMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200">{member.name}</span>
                    <span className="text-amber-400/90 ml-1.5">({member.relationship})</span>
                    <p className="text-[10px] text-slate-400">{member.nakshatra}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="text-slate-500 hover:text-red-400 p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Family Member Form Drawer */}
          {showAddFamily && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-800/40 space-y-3 mb-2 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Radhika"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full bg-slate-900 text-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Relationship</label>
                  <select
                    value={newMember.relationship}
                    onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                    className="w-full bg-slate-900 text-slate-100 rounded-lg px-2 py-1.5 border border-slate-700 text-xs"
                  >
                    <option value="Spouse">Spouse (ಪತ್ನಿ / ಪತಿ)</option>
                    <option value="Son">Son (ಪುತ್ರ / ಮಗ)</option>
                    <option value="Daughter">Daughter (ಪುತ್ರಿ / ಮಗಳು)</option>
                    <option value="Mother">Mother (ತಾಯಿ)</option>
                    <option value="Father">Father (ತಂದೆ)</option>
                    <option value="Brother">Brother (ಸಹೋದರ)</option>
                    <option value="Sister">Sister (ಸಹೋದರಿ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Nakshatra</label>
                  <select
                    value={newMember.nakshatra}
                    onChange={(e) => setNewMember({ ...newMember, nakshatra: e.target.value })}
                    className="w-full bg-slate-900 text-slate-100 rounded-lg px-2 py-1.5 border border-slate-700 text-xs"
                  >
                    {nakshatras?.map((n) => (
                      <option key={n} value={n}>
                        {n.split(' ')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddFamily(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold"
                >
                  Save Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary & Submit */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 rounded-2xl p-5 border border-amber-600/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400/90 font-serif">
            Booking Summary
          </span>
          <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>{selectedSeva?.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {formData.sevaTime}
            </span>
          </h4>
          <p className="text-xs text-slate-400">
            Devotee: <strong className="text-slate-200">{formData.devoteeName || '—'}</strong> | Gothra:{' '}
            <strong className="text-slate-200">{formData.gothra.split(' ')[0]}</strong> | Nakshatra:{' '}
            <strong className="text-slate-200">{formData.nakshatra.split(' ')[0]}</strong>
            {familyMembers.length > 0 && ` + ${familyMembers.length} family member(s)`}
          </p>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-amber-900/50 hover:from-amber-400 hover:to-amber-600 active:scale-95 transition-all flex items-center justify-center gap-2 ring-1 ring-amber-300/40"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Confirm & Pay Dakshina (₹{selectedSeva?.amount})</span>
        </button>
      </div>
    </form>
  );
}
