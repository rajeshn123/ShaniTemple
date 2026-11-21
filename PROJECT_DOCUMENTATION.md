# Sri Shaneeshwara Swamy Temple — Complete Project & Conversation Documentation

This document serves as a permanent, readable archive of the entire development, customization, deployment, and mobile conversion journey for the **Sri Shaneeshwara Swamy Temple (ಶ್ರೀ ಶನೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನ)** Abhisheka booking application.

---

## 1. 🛕 Project Overview & Requirements
* **Deity & Temple**: Sri Shaneeshwara Swamy Temple (ಶ್ರೀ ಶನೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನ).
* **Core Functionality**:
  * Online booking for 3 sacred Abhishekas:
    1. **Milk Abhisheka (ಕ್ಷೀರಾಭಿಷೇಕ - ಹಾಲು)** — ₹151
    2. **Tailabhisheka (ತೈಲಾಭಿಷೇಕ - ಎಳ್ಳೆಣ್ಣೆ)** — ₹251 *(special black sesame oil seva)*
    3. **Panchamrutha Abhisheka (ಪಂಚಾಮೃತಾಭಿಷೇಕ)** — ₹501 *(5 nectars)*
  * **Timing**: Single static **06:00 AM (Brahma Muhurtha / ಪ್ರಾತಃಕಾಲ)** batch.
  * **Vedic Sankalpa Details**: Devotee Name, 10-digit Phone, 27 Vedic Nakshatras, Major Gothras, and Family Members archana list.
  * **Auspicious Temple Calendar**: Highlights upcoming Saturdays, Shani Amavasya, Shani Trayodashi, and Masa Shivaratri over the next 120 days.
  * **Instant UPI Payment**: GPay, PhonePe, Paytm simulation + native Android intent launcher.
  * **Digital Consecrated Receipt**: Printable letterhead receipt with token ID (e.g. `SHANI-2026-1620`), priest signature block, and guidelines.
  * **Devotee Self-Lookup**: Devotees search by phone or booking token to retrieve and reprint receipts.
  * **Admin & Priest Portal (`/admin`)**:
    * Password: `shani@admin2026`
    * Real-time metrics from Cloud Firestore.
    * Date-based booking filtering (single date, ranges, auspicious day quick picks).
    * Priest Sankalpa Sheet for early morning chanting.
    * Status updates (CONFIRMED ➔ COMPLETED / CANCELLED).
    * CSV / Excel export.

---

## 2. 🚀 Cloud Infrastructure & Production Links
* **Live Web Application**: [https://shani-temple-2026.web.app](https://shani-temple-2026.web.app)
* **Live Admin Portal**: [https://shani-temple-2026.web.app/admin](https://shani-temple-2026.web.app/admin) *(Password: `shani@admin2026`)*
* **Firebase Console**: [https://console.firebase.google.com/project/shani-temple-2026/overview](https://console.firebase.google.com/project/shani-temple-2026/overview)
* **Cloud Firestore Database**: [https://console.firebase.google.com/project/shani-temple-2026/firestore/databases/-default-/data](https://console.firebase.google.com/project/shani-temple-2026/firestore/databases/-default-/data)
* **Cloud Functions 2nd Gen API**: `https://asia-south1-shani-temple-2026.cloudfunctions.net/api` *(Region: `asia-south1` - Mumbai)*
* **GitHub Repository**: [https://github.com/rajeshn123/ShaniTemple.git](https://github.com/rajeshn123/ShaniTemple.git) *(Branch: `main`)*

---

## 3. 📱 Native Android Mobile App
* **Framework**: Capacitor 7 embedding React 19 + Tailwind CSS into Android Gradle project.
* **Application ID**: `org.shanitemple.app`
* **App Display Name**: `Sri Shaneeshwara Temple` (ಶ್ರೀ ಶನೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನ)
* **Compiled APK Location**: `releases/SriShaneeshwaraTemple-debug.apk` *(Size: 4.06 MB)*
* **Mobile Enhancements**:
  * **Direct UPI Intent**: One-tap button to launch Google Pay, PhonePe, Paytm via `upi://pay` intent with pre-filled amount and temple UPI ID.
  * **WhatsApp Receipt Share**: Native Share Sheet to forward consecrated receipts directly to family on WhatsApp.
  * **Hardware Back Button**: Handled via `@capacitor/app` to dismiss modals smoothly.
  * **Cloud Sync**: Mobile app automatically routes API calls over HTTPS to the live Mumbai backend.
* **To Install on Phone**:
  ```powershell
  & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r "E:\Rajesh\ShaniTemple\releases\SriShaneeshwaraTemple-debug.apk"
  ```

---

## 4. 🗄️ Database Architecture & Growth Capacity
* **Database Engine**: Google Cloud Firestore (Native Mode) in `asia-south1` (Mumbai).
* **Storage Limits**: Virtually unlimited (Petabytes+). Google Firestore auto-scales horizontally across distributed servers.
* **Per Document Size**: Up to 1 MB. (Each temple booking uses only ~1 KB).
* **Free Tier Every Month**:
  * 1 GiB storage free (holds ~1,000,000 bookings).
  * 20,000 writes/day free (~600,000 bookings/month).
  * 50,000 reads/day free (~1.5 Million lookups/month).
* **Cost beyond free tier**: ~$0.18 / GB / month (~₹15 per GB / month).

---

## 5. 🏪 How to Publish on Google Play Store
1. **Google Play Console Account**: Create account at [play.google.com/console](https://play.google.com/console) ($25 one-time registration).
2. **Generate Release Keystore**:
   ```powershell
   & "C:\Program Files\Java\jdk-17\bin\keytool.exe" -genkey -v `
     -keystore "E:\Rajesh\ShaniTemple\shani-release-key.jks" `
     -alias "shani-temple-key" `
     -keyalg RSA -keysize 2048 -validity 10000 `
     -dname "CN=Sri Shaneeshwara Temple, OU=Trust, O=Devasthanam, L=Bangalore, ST=Karnataka, C=IN"
   ```
3. **Build Android App Bundle (`.aab`)**:
   ```powershell
   cd E:\Rajesh\ShaniTemple\client\android
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"
   .\gradlew.bat bundleRelease
   ```
4. **Upload**: Submit `app-release.aab` in Google Play Console under **Production > Create Release**.

---

## 6. 🎨 How to Change the App Icon
1. Place a **1024 × 1024 px PNG** at `client/assets/icon.png`.
2. Run in `client/`:
   ```powershell
   npx @capacitor/assets generate --android
   cd android
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"
   .\gradlew.bat assembleDebug
   ```

---

## 7. 💾 Raw Conversation Log Locations (System Generated)
* **Compact JSONL Log**: `C:\Users\rajes\.gemini\antigravity\brain\c6b87542-f795-4426-9717-59e9cf2d77b5\.system_generated\logs\transcript.jsonl`
* **Full Transcript JSONL**: `C:\Users\rajes\.gemini\antigravity\brain\c6b87542-f795-4426-9717-59e9cf2d77b5\.system_generated\logs\transcript_full.jsonl`
* **Walkthrough Artifact**: `C:\Users\rajes\.gemini\antigravity\brain\c6b87542-f795-4426-9717-59e9cf2d77b5\walkthrough.md`
