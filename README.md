# 🛒 GroceryHub – MERN Stack Grocery Management System

GroceryHub is a full-stack MERN application designed to manage a grocery store efficiently.  
It includes inventory management, billing, reports, authentication, and alerts in a modern UI.

---

## 🚀 Features

- 🔐 User Authentication (Login / Signup)
- 📦 Inventory Management (Add, Edit, View Products)
- 🧾 Billing System with GST calculation & PDF invoice
- 📊 Reports Dashboard (Sales analytics with charts)
- 🚨 Low-Stock Alerts
- 🔄 Real-time frontend ↔ backend integration
- 🗄️ MongoDB database support

---

## 🧑‍💻 Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Chart.js
- CSS (Custom Styling)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Passport (Google OAuth – optional)

---

## 📂 Project Structure

GroceryHub/

├── backend/

│ ├── config/

│ ├── controllers/

│ ├── models/

│ ├── middleware/

│ ├── routes/

│ ├── server.js

│ └── .env

│

├── frontend/

│ ├── src/

│ │ ├── components/

│ │ ├── context/

│ │ ├── loaders/

│ │ ├── pages/

│ │ ├── styles/

│ │ ├── utils/

│ │ └── App.jsx

│ └── package.json

│

└── package.json


---

## ⚙️ Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- Git
- VS Code

---

## 🔑 Environment Variables

Create a `.env` file inside the **backend** folder:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key



---

## 📥 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/groceryhub.git
cd groceryhub


2️⃣ Install Backend Dependencies
cd backend
npm install

3️⃣ Install Frontend Dependencies
cd ../frontend
npm install

4️⃣ Run the Application (Both Frontend & Backend)

From the root folder:

npm install
npm run dev

This uses concurrently to start:

Backend → http://localhost:5000
Frontend → http://localhost:5173

```
---

## 📦 Inventory Module

The Inventory module allows efficient management of grocery products with real-time database synchronization.

- Add, view, edit, and delete products
- Manage product name, category, price, quantity, and image
- Track stock availability with low-stock indicators
- Search and filter products easily
- Data persisted securely using MongoDB

---

## 🧾 Billing Module

The Billing module handles customer purchases and invoice generation.

- Add products to cart directly from inventory
- Manage quantities dynamically
- Automatic GST calculation
- Generate and download PDF invoices
- Ensures accurate and fast billing workflow

---

## 📊 Reports Module

The Reports module provides business insights through analytics.

- View sales summaries and statistics
- Filter reports by date range
- Interactive bar and pie charts using Chart.js
- Backend-driven data aggregation
- Helps analyze store performance and trends

  ---


## 🧠 Learning Outcomes

This project helped strengthen full-stack development skills.

- Built a complete MERN stack application
- Understood RESTful API design and data flow
- Implemented authentication and protected routes
- Connected frontend with MongoDB through a Node.js backend
- Worked with charts, PDF generation, and real-world features

---

## 🚀 Future Improvements

The project can be extended with additional features.

- Role-based access control (Admin / Staff)
- Cloud-based image uploads
- Real-time notifications
- Deployment on Vercel and Render
- Improved mobile responsiveness

---

## 🤝 Contributing

Contributions are welcome and appreciated.

- Fork the repository
- Create a new feature branch
- Submit a pull request with clear changes

---

## 📜 License

This project is open-source and licensed under the MIT License.
