<h1 align="center">🚨 Silent Signal</h1>

<p align="center">
  <b>Emergency Alert Mobile Application</b><br>
  Built using <b>React Native (Expo)</b>, <b>FastAPI</b>, and <b>MySQL</b>
</p>

<hr>

<h2>📌 Project Overview</h2>

<p>
Silent Signal is a mobile emergency alert system designed to help users send an instant SOS alert during dangerous or urgent situations.
With a single tap, the app sends emergency information to the backend server and stores it in the database.
</p>

<hr>

<h2>🚀 Features</h2>

<ul>
  <li>📱 One-tap emergency help button</li>
  <li>📩 SMS alert trigger</li>
  <li>🌍 Sends user location</li>
  <li>⚡ FastAPI backend integration</li>
  <li>🗄️ MySQL database storage</li>
  <li>📡 Mobile hotspot / local network supported</li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>

<ul>
  <li><b>Frontend:</b> React Native + Expo</li>
  <li><b>Backend:</b> FastAPI</li>
  <li><b>Database:</b> MySQL</li>
  <li><b>Language:</b> Python, JavaScript</li>
</ul>

<hr>

<h2>📂 Project Structure</h2>

<pre>
Silent Signal/
│── frontend/
│   ├── app/
│   ├── assets/
│   ├── package.json
│
│── backend/
│   ├── app/
│   │   └── main.py
│   └── venv/
</pre>

<hr>

<h2>⚙️ Installation & Run</h2>

<h3>🔹 Backend</h3>

<pre>
cd backend
venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
</pre>

<h3>🔹 Frontend</h3>

<pre>
cd frontend
npm install
npm start
</pre>

<h3>🔹 Database</h3>
mysql -u root -p
USE emergency_db;
SHOW TABLES;
SELECT * FROM emergency_alerts;

<pre>
cd backend
venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
</pre>

<hr>

<h2>📡 API Endpoint</h2>

<pre>
POST /send-alert
</pre>

<h3>Request Body</h3>

<pre>
{
  "user_id": 101,
  "location": "Mathura"
}
</pre>

<hr>

<h2>🗄️ Database</h2>

<p><b>Database Name:</b> emergency_db</p>

<p><b>Table:</b> emergency_alerts</p>

<hr>

<h2>📸 Screenshots</h2>

<p><img width="300" height="600" alt="image" src="https://github.com/user-attachments/assets/a36a854b-8359-4e4c-b859-d9e8e321100f" />

  <img width="300" height="600" alt="image" src="https://github.com/user-attachments/assets/7969402b-d023-46a1-81f0-f57bf5dbad92" />

</p>

<hr>

<h2>🎯 Future Enhancements</h2>

<ul>
  <li>📍 Live GPS tracking</li>
  <li>📞 Auto emergency calling</li>
  <li>🔔 Push notifications</li>
  <li>☁️ Cloud deployment</li>
  <li>👮 Police / Guardian live alerts</li>
</ul>

<hr>

<h2>👨‍💻 Author</h2>

<p>
Akhil Singh <br>
GitHub: <a href="https://github.com/akhil-singh28">akhil-singh28</a>
</p>

<hr>

<h3 align="center">⭐ If you like this project, give it a star ⭐</h3>
