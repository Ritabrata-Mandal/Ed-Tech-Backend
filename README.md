# 🎓 EdTech Backend Application

A scalable backend system for an EdTech platform built using **Node.js, Express.js, and MongoDB**, supporting user authentication, course management, payments, and media uploads.

---

## 🚀 Features

- User authentication with **JWT & bcrypt**
- Role-based access control (**Student / Instructor / Admin**)
- Course creation, enrollment, and management
- Secure online payments using **Razorpay**
- Media and file uploads using **Cloudinary**
- OTP-based email verification and notifications
- RESTful API architecture with modular routing

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT, bcrypt, Cookies  
- **Payments:** Razorpay  
- **Media Storage:** Cloudinary  
- **Email Service:** Nodemailer  
- **Utilities:** dotenv, express-fileupload, CORS

---

## 📁 Project Structure

# 🎓 EdTech Backend Platform

A production-ready backend for an EdTech platform that supports **user authentication, course management, payments, and media handling**, built using **Node.js, Express, and MongoDB**.

This project focuses on **scalability, security, and clean backend architecture**, following real-world development practices.

---

## 🚀 Key Features

- Secure user authentication using **JWT & bcrypt**
- Role-based access control (**Student / Instructor / Admin**)
- Course creation, enrollment, and management APIs
- Integrated **Razorpay** payment gateway for course purchases
- Media and video uploads handled via **Cloudinary**
- OTP-based email verification and notifications
- Modular RESTful API architecture
- Centralized error handling and environment-based configuration

---

## 🛠️ Tech Stack

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose ODM

**Authentication & Security**
- JSON Web Tokens (JWT)
- bcrypt
- Cookies

**Third-Party Services**
- Razorpay (Payments)
- Cloudinary (Media storage)
- Nodemailer (Email & OTP)

**Utilities**
- dotenv
- express-fileupload
- CORS
- Nodemon

---

## 📁 Project Structure

Ed-Tech-Backend/
├── config/ # Database & cloud configuration
├── controllers/ # Business logic
├── models/ # Mongoose schemas
├── routes/ # API routes
├── middlewares/ # Auth & validation middleware
├── utils/ # Helper utilities (OTP, mail, etc.)
├── index.js # App entry point
├── package.json
├── package-lock.json
└── .gitignore

yaml
Copy code

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email
MAIL_PASS=your_app_password

yaml
Copy code

⚠️ **Do not commit `.env` files to GitHub**

---

## ▶️ Getting Started (Local Setup)

```bash
git clone https://github.com/Ritabrata-Mandal/Ed-Tech-Backend.git
cd Ed-Tech-Backend
npm install
npm run dev
Server will start at:

arduino
Copy code
http://localhost:3000
🔗 API Endpoints
Feature	Base Route
Authentication	/api/v1/auth
User Profile	/api/v1/profile
Courses	/api/v1/course
Payments	/api/v1/payment

📌 Learning Outcomes
Designed a scalable backend architecture

Implemented secure authentication & authorization

Integrated real-world payment and cloud services

Improved understanding of REST APIs and backend best practices

📈 Future Enhancements
API documentation using Swagger/Postman

Admin analytics dashboard

Course review & rating system

Deployment using Docker & cloud platforms

👤 Author
Ritabrata Mandal
GitHub: https://github.com/Ritabrata-Mandal

⭐ If you like this project, feel free to star the repository!

yaml
Copy code

---

## 🔥 Why this README is strong
✔ Recruiter-friendly  
✔ Clean structure  
✔ Real-world terminology  
✔ Shows backend depth, not just CRUD  

If you want next, I can:
- Make it **ATS-optimized**
- Add **badges** (Node, MongoDB, Razorpay)
- Write **Postman API docs**
- Prepare **resume bullet points matching this README**

Just tell me 👍






