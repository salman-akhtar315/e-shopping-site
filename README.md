
# EcomeProject

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Why was this built?

This project was built to demonstrate modern full-stack web development capabilities. It addresses real-world e-commerce requirements such as:
- Secure user authentication and session management.
- Complex state management for shopping carts and user data.
- Handling file uploads efficiently and storing them in the cloud.
- Designing a scalable database schema for products, categories, users, and orders.
- Creating a responsive, intuitive, and modern user interface that works seamlessly across all devices.


## What is this project?

EcomeProject is a complete online shopping platform. It provides a seamless user experience for browsing products, managing a shopping cart, securely logging in or registering, and placing orders. It also features an administrative panel for managing the store's inventory (products, categories), users, and monitoring orders.

### Key Features
- **Frontend**: Responsive UI built with React 19 (Vite), styled with TailwindCSS v4, and state managed by Redux Toolkit.
- **Backend**: Robust RESTful API built with Express 5 and Node.js.
- **Database**: MongoDB via Mongoose for flexible and scalable data storage.
- **Authentication**: Secure user authentication and authorization using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Media Uploads**: Integrated with Cloudinary for handling product images via Multer.


## How to Run Locally

### Prerequisites
Make sure you have Node.js installed on your system.

### 1. Setup the Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (if one doesn't exist) and populate it with the required environment variables:
```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend development server:
```bash
npm run dev
```
The backend server will run on `http://localhost:8000`.

### 2. Setup the Frontend
Open a new terminal window, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.
