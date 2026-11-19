# Sri Shaneeshwara Swamy Temple - Abhisheka Seva Booking Portal

An end-to-end full-stack web application for an ancient Hindu temple, specialized for Sri Shaneeshwara Swamy (Lord Shani). Devotees can book auspicious Abhisheka sevas with authentic Vedic Sankalpa details, simulated UPI payment, and downloadable consecrated receipts. Includes a secure Admin & Priest Management Dashboard.

---

## ✨ Features

### 🪔 1. Three Traditional Abhishekas
- **Milk Abhisheka (क्षीराभिषेक) — ₹151**: Sacred bath with fresh cow milk; calms planetary heat, brings mental peace & health.
- **Tailabhisheka (तैलभिषेक - तिल तैल) — ₹251**: Supreme offering of pure black sesame (Til) oil directly onto the sacred Shani Shila. Most revered for mitigating Sade Sati, Kantaka Shani, and removing hurdles.
- **Panchamrutha Abhisheka (पंचामृताभिषेक) — ₹501**: Grand Maha Seva with 5 sacred nectars (Milk, Curd, Ghee, Pure Honey, Sugar/Jaggery) for complete graha dosha nivarana, longevity, and prosperity.

### 📜 2. Vedic Devotee Form & Sankalpa
- **Name**: Primary devotee (Yajamana).
- **Phone Number**: 10-digit mobile number for status lookup and SMS notification.
- **Gothra**: Dropdown with 15 major Vedic Gothras (Kashyapa, Bharadwaja, Vasishta, Vishwamitra, etc.) + custom Gothra entry.
- **Nakshatra**: Comprehensive list of all 27 traditional Vedic Janma Nakshatras (Ashwini, Bharani, Krittika, Rohini, Mrigashirsha, etc.).
- **Family Members for Sankalpa**: Devotees can optionally add family members (spouse, children, parents) with their respective nakshatras so the priest recites everyone's name during the archana.

### 📅 3. Auspicious Shani Schedule
- Dates are strictly filtered to upcoming auspicious temple days: **Every Saturday (Shanivara)**, **Amavasya (New Moon)**, and sacred festivals like **Shani Trayodashi**, **Shani Jayanti**, and **Mauni Amavasya**.
- Pre-defined morning pooja batches: `07:30 AM`, `08:30 AM`, `09:30 AM`, `11:00 AM`.

### 💳 4. Simulated UPI / QR Code Payment
- Interactive QR Code modal with authentic temple trust UPI ID (`srisheneashwara.trust@okhdfcbank`).
- Instant payment simulation with dynamic reference token (`UPI-SHANI-XXXXXXXX`).

### 🖨️ 5. Consecrated Temple Receipt & Token
- Beautiful printable temple receipt featuring temple emblem, registration number, unique Booking Token (`SHANI-2026-XXXX`), devotee & family particulars, and temple guidelines.
- Instant print/save to PDF functionality.

### 🔍 6. Devotee Booking Lookup
- Devotees can lookup their past and upcoming bookings anytime by entering their mobile phone number or Booking ID.

### 🛡️ 7. Admin & Priest Portal (`/admin`)
- **Password Protected**: Preset password `shani@admin2026` (with quick demo unlock option).
- **KPI Metrics**: Total Bookings, Total Dakshina Collected (₹), Today's Seva Batches, Completed vs Pending.
- **Ledger with Real-time Filters**: Filter by date, seva type, status, or search by name/phone.
- **Pooja Status Management**: One-click status toggle (`Mark Done` / `✓ Performed`).
- **Priest Sankalpa Sheet**: Printable daily register formatted specifically for the Head Archaka to hold and recite names during morning abhishekas.
- **CSV Export**: Instant download of the full bookings ledger.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React icons, Canvas Confetti.
- **Backend**: Node.js v26 Express server with CORS.
- **Database**: Built-in `node:sqlite` (zero native dependency issues, synchronous and fast SQLite).

---

## 🚀 How to Run

### Step 1: Start the Backend Server
```bash
cd server
node server.js
```
The server will run on `http://localhost:5000`.

### Step 2: Start the Frontend Client
```bash
cd client
npm run dev
```
The client will run on `http://localhost:3000`.
Proxy is configured in Vite to automatically route `/api/*` calls to the backend server.
