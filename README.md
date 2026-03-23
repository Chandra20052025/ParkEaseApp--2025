# 🅿️ ParkEase

A smart parking management web application that allows users to book, manage, and share parking slots in real time — built with vanilla HTML, CSS, JavaScript, and Firebase.

---

## 📱 Features

- **User Authentication** — Secure signup and login with email verification via Firebase Auth
- **Slot Booking** — Book car or bike parking slots with date and time selection
- **Real-time Availability** — Live slot availability updates using Firestore onSnapshot
- **Booking History** — View all past and upcoming bookings with cancel option
- **Friends List** — Add friends and send parking slot requests
- **Notifications** — In-app notifications for incoming parking requests
- **Search User** — Find users by vehicle number
- **Edit Profile** — Update name, vehicle number, license number, and mobile
- **UPI Payment** — Simple UPI payment integration after booking
- **Privacy Policy, About Us, Help & FAQ** — Supporting pages

---

## 🗂️ Project Structure

```
parkease/
│
├── app/
│   ├── images/                  # SVG and image assets
│   │
│   ├── Frame1.html              # Splash / intro screen
│   ├── Frame1.css
│   │
│   ├── Frame2.html              # Login & Signup
│   ├── Frame2.css
│   │
│   ├── Frame3.html              # Dashboard (main menu)
│   ├── Frame3.css
│   │
│   ├── Frame4.html              # Friends List & slot requests
│   ├── Frame4.css
│   │
│   ├── Frame5.html              # Car slot booking
│   ├── Frame5.css               # Shared CSS for Frame5 & frame6
│   │
│   ├── frame6.html              # Bike slot booking
│   │
│   ├── Frame7.html              # Search user by vehicle number
│   ├── Frame7.css
│   │
│   ├── Frame8.html              # Booking history
│   ├── Frame8.css               # Shared CSS for Frame8 + supporting pages
│   │
│   ├── payment.html             # UPI payment page
│   ├── edit.html                # Edit profile
│   ├── aboutus.html             # About Us
│   ├── faq.html                 # Help & FAQ
│   ├── privacy.html             # Privacy Policy
│   │
│   ├── firebaseConfig.js        # Shared Firebase configuration
│   └── firestore_functions.js   # Shared Firestore utility functions
```

---

## 🔧 Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure |
| CSS3 | Styling |
| Vanilla JavaScript | Logic & interactivity |
| Firebase Auth | User authentication |
| Cloud Firestore | Database |
| Firebase Analytics | Usage analytics |

---

## 🚀 Getting Started

### Prerequisites
- [VS Code](https://code.visualstudio.com/)
- [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code
- A Firebase project

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/Chandra20052025/ParkEaseApp--2025.git
cd ParkEaseApp--2025
```

**2. Configure Firebase**

Open `app/firebaseConfig.js` and replace with your own Firebase project credentials:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

**3. Set up Firebase**
- Enable **Email/Password** authentication in Firebase Console
- Create a **Firestore Database** in production mode
- Publish the following **Firestore Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /Users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }

    match /carBookings/{bookingId} {
      allow read, write: if request.auth != null;
    }

    match /bikeBookings/{bookingId} {
      allow read, write: if request.auth != null;
    }

    match /ParkingRequests/{requestId} {
      allow read, write: if request.auth != null;
    }

    match /HelpQuestions/{questionId} {
      allow create: if request.auth != null;
      allow read: if false;
    }

    match /carSlots/{slotId} {
      allow read, write: if request.auth != null;
    }

    match /bikeSlots/{slotId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**4. Run the project**
- Right click `app/Frame1.html` in VS Code
- Click **"Open with Live Server"**
- The app will open in your browser at `http://127.0.0.1:5500/app/Frame1.html`

---

## 🗄️ Firestore Collections

| Collection | Description |
|------------|-------------|
| `Users` | User profiles (name, email, mobile, vehicleNo, licenseNo, friends) |
| `carBookings` | Car slot bookings |
| `bikeBookings` | Bike slot bookings |
| `ParkingRequests` | Slot sharing requests between friends |
| `HelpQuestions` | User submitted help/support questions |
| `carSlots` | Car slot availability status |
| `bikeSlots` | Bike slot availability status |

---

## 📸 App Flow

```
Frame1 (Splash)
    ↓
Frame2 (Login / Signup)
    ↓
Frame3 (Dashboard)
    ├── Frame4 (Friends List)
    ├── Frame5 (Car Booking) → payment.html
    ├── frame6 (Bike Booking) → payment.html
    ├── Frame7 (Search User)
    └── Frame8 (Booking History)
```

---

## ⚠️ Known Limitations

- Payment is UPI deep-link only — no server-side payment verification
- No admin panel for managing all bookings
- SMS notifications not yet implemented

---

## 👤 Author

**Chandra** — [@Chandra20052025](https://github.com/Chandra20052025)

---

## 📄 License

This project is for educational purposes. Feel free to fork and build on it!
