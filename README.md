# 🚚 Food Ordering Web App (MERN Stack)

## ✨ Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Contact](#contact)

## 📊 Introduction
This is a full-stack food ordering web application built using the MERN stack (MongoDB, Express, React, Node.js). The application consists of a customer-facing app for ordering food and an admin app for managing orders, menu items, and more.
## 🚀 Live Demo

- **User Panel:**  
  👉 https://mern-food-delivery-frontend-d3fz.onrender.com

- **Admin Panel:**  
  👉 https://food-delivery-admin-uz91.onrender.com

---

## 🚀 Features
- User authentication and authorization
- Browse food items
- Add items to the cart and place orders
- Stripe Payment Integration: Secure and reliable payment processing using Stripe.
- Order tracking
- Admin panel to manage menu items, orders

## 🛠️ Technologies Used
- **Frontend:** React.js, React Context API, React Router
- **Backend:** Node.js, Express.js
- **Payment Gateway:** Stripe
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS

## Installation
### Prerequisites
- Node.js
- MongoDB

## 🚀 Run Locally — Step-by-step

Make sure you have Node.js (v20+ recommended) and npm installed.

### Clone the Repository
```sh
git clone https://github.com/anurag01122/mern-food-delivery-app.git
cd mern-food-delivery-app
```

## Backend Setup
Navigate to the backend directory:

```sh
cd backend

```
Install dependencies:

```sh
npm install
```

Create a .env file in the backend directory and add the following:

```sh
JWT_SECRET = "random#secret"
STRIPE_SECRET_KEY = "your_stripe_secret_key_here" 
⚠️ Note: Do not commit your .env file. Create your own keys from Stripe Dashboard and use them locally.

```
 
Start the backend server:

```sh
npm run server
```
## Frontend Setup
Navigate to the frontend directory:

```sh

cd frontend
```

Install dependencies:
```sh

npm install
```

Start the frontend server:
```sh

npm run dev
```

## Admin App Setup

Navigate to the admin directory:
```sh

cd admin
```

Install dependencies:

```sh
npm install
```

Start the admin app :
```sh
npm run dev
```

## Usage
Access the customer-facing app at (https://mern-food-delivery-app-1-p8f0.onrender.com)
Access the admin app at (https://food-delivery-admin-uz91.onrender.com)
Register as a new user or log in with existing credentials.
Browse the menu, add items to the cart, and place an order.
Pay using dummy visa card
Use the admin panel to manage orders, menu items.



## 📜 API Documentation
The API endpoints for the backend can be documented using tools like Postman or Swagger. Include endpoints for user authentication, menu items, orders, and more.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the code style and include relevant tests.

👨‍💻 Contributors

[Anurag Kumar](https://github.com/anurag01122)
 — Project Owner

## 📫 Contact
For any questions or suggestions, feel free to contact me.





