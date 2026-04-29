# <p align="center">🚨 Silent Signal<p>

<p align="center">
  <b style="font-size:18px;">Emergency Alert Mobile Application</b><br/>
  Built using <b>React Native (Expo)</b>, <b>FastAPI</b>, and <b>MySQL</b>
</p>

---

## 📌 Project Overview

Silent Signal is a mobile emergency alert system designed to help users send instant SOS alerts during dangerous or urgent situations.

With a single tap on the **HELP NOW** button, the app triggers emergency actions such as:
- Calling trusted contacts  
- Sending SMS with live location  
- Activating siren + flashlight  
- Saving emergency evidence  

---

## 🚀 Features

### 📱 Core Safety Features
- One-tap **HELP NOW** button with animation
- Auto-call to primary contact
- SMS alerts with live GPS location
- Quick emergency calls (Police, Ambulance, Fire)

### 👥 Contact System
- Add and manage **3 trusted contacts**
- Set primary emergency contact
- Automatic SMS to all contacts

### 📍 Location & Tracking
- Live GPS location sharing
- Google Maps integration
- Real-time tracking support

### 🎤 Evidence System
- Voice recording (start/stop)
- Photo capture evidence
- Playback & history logs

### 📊 App Features
- Dark / Light mode toggle
- Alert history with timestamps
- Local storage (AsyncStorage)
- Clean UI with animations

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React Native (Expo)            |
| Backend     | FastAPI (Python)               |
| Database    | MySQL                          |
| Storage     | AsyncStorage                   |
| Languages   | JavaScript, TypeScript, Python |

---

## 📂 Project Structure
Silent Signal/<br>
│
├── frontend/<br>
│ ├── screens/<br>
│ │ ├── Home.tsx<br>
│ │ ├── Profile.tsx<br>
│ │ ├── Explore.tsx<br>
│ │ └── Tracking.tsx<br>
│ │<br>
│ ├── assets/<br>
│ ├── utils/<br>
│ │ └── language.ts<br>
│ │<br>
│ ├── App.tsx<br>
│ ├── package.json<br>
│ └── app.json<br>
│<br>
├── backend/<br>
│ ├── app/<br>
│ │ └── main.py<br>
│ ├── requirements.txt<br>
│ └── venv/<br>
│<br>
└── README.md


---

## ⚙️ Installation

---

### Backend Setup
cd backend <br>
python -m venv <br>

# Activate
venv\Scripts\activate                      # Windows    <br>
source venv/bin/activate                   # Mac/Linux    <br>
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload    <br>

pip install fastapi uvicorn pydantic mysql-connector-python  <br>

### Frontend Setup<br>
cd frontend<br>
npm install<br>
npx expo start<br>

## Database Setup (MySQL)<br>
CREATE DATABASE emergency_db;<br>
<br>
USE emergency_db;<br>
<br>
CREATE TABLE emergency_alerts (<br>
    id INT AUTO_INCREMENT PRIMARY KEY,<br>
    user_id INT NOT NULL,<br>
    location VARCHAR(255),<br>
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,<br>
    contacts_notified INT,<br>
    status VARCHAR(50)<br>
);<br>

CREATE TABLE contacts (<br>
    id INT AUTO_INCREMENT PRIMARY KEY,<br>
    user_id INT,<br>
    name VARCHAR(100),<br>
    relation VARCHAR(50),<br>
    phone VARCHAR(15),<br>
    is_primary BOOLEAN DEFAULT FALSE<br>
);

## 📸 Screens Overview  <br>
<p align="center">
  <!-- Home Screen -->
  <img width="200" src="https://github.com/user-attachments/assets/home-image-link" />
  
  <!-- Explore Screen -->
  <img width="200" src="https://github.com/user-attachments/assets/explore-image-link" />
  
  <!-- Profile Screen -->
  <img width="200" src="https://github.com/user-attachments/assets/profile-image-link" />
  
  <!-- GPS Live Tracking -->
  <img width="200" src="https://github.com/user-attachments/assets/gps-live-image-link" />
  
  <!-- GPS Coordinates -->
  <img width="200" src="https://github.com/user-attachments/assets/gps-image-link" />
  
  <!-- Alert History -->
  <img width="200" src="https://github.com/user-attachments/assets/alert-image-link" />
</p>




## 🏠 Home Screen<br>
HELP NOW emergency button<br>
Quick actions<br>
Alert history<br>
## 🎤 Explore Screen
Voice recording system<br>
Photo evidence capture<br>
## 👤 Profile Screen<br>
Manage 3 emergency contacts<br>
Set primary contact<br>

## 📍 Tracking Screen<br>
Live GPS tracking<br>
Google Maps integration<br>
## 🔐 Permissions Required<br>

<uses-permission android:name="android.permission.CALL_PHONE" /><br>
<uses-permission android:name="android.permission.SEND_SMS" /><br>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /><br>
<uses-permission android:name="android.permission.CAMERA" /><br>
<uses-permission android:name="android.permission.RECORD_AUDIO" /><br>

## 🎯 How It Works<br>
Tap HELP NOW<br>
Get GPS location<br>
Send SMS to all contacts<br>
Call primary contact<br>
Save alert history<br>
Show animation feedback<br>

## 👨‍💻 Author<br>

Akhil Pratap Singh<br>
GitHub: akhil-singh28<br>
## ⭐ Support<br>

If you like this project, give it a ⭐ on GitHub.<br>
<p align="center"> <b>Made with ❤️ for emergency safety</b> </p><br>





