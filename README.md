📱 Habit Tracker App

A modern Habit Tracking Mobile Application built using React Native (Expo) and Node.js. This app helps users build consistent habits, track daily progress, maintain streaks, and stay motivated with smart reminders.

🚀 Features
✅ Create and manage daily/weekly habits
🎯 Mood-based habit suggestions
🔥 Streak tracking system
📅 Weekly calendar view
🔔 Smart notifications & reminders
🎨 Custom color selection for habits
🗑️ Edit & delete habits
📊 Real-time data sync with backend
🛠️ Tech Stack
📱 Frontend
React Native (Expo)
JavaScript
Expo Notifications
🌐 Backend
Node.js
Express.js
MongoDB (Mongoose)# Habit_Tracker

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker
2️⃣ Backend Setup
cd backend
npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string
PORT=3000

Run server:

npm start
3️⃣ Frontend Setup
cd frontend
npm install
npx expo start
🔗 API Endpoints
Method	Endpoint	Description
POST	/habits	Create a new habit
GET	/habitslist	Get all habits
PUT	/habits//completed	Mark habit as completed
DELETE	/habits/	Delete habit
🔔 Notifications
Smart reminders for incomplete habits
Daily notification scheduling
Streak protection alerts
📱 Build APK
npx expo build:android

OR (new method)

npx expo prebuild
npx expo run:android


Key Learnings
State management in React Native
REST API integration
MongoDB database handling
Notification scheduling
Mobile UI/UX design
🔥 Future Enhancements
📊 Analytics dashboard
⏰ Custom reminder time picker
👥 Social habit sharing
☁️ Cloud sync & authentication


