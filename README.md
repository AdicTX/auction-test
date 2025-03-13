# Auction Platform

This project is an online auction platform built with **Vite + React** for the frontend and **Node.js + Express + Sequelize + MySQL** for the backend. Below are the steps to set up and run the project on your local environment.

---

## Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (package managers)
- **MySQL** 

---

## Project Setup

### 1. Backend Configuration

1. **Install dependencies**:
   Navigate to the backend folder and install the required dependencies:

   ```bash
   cd aution-backend
   npm install

Set up the database:

Ensure MySQL is installed and running.

Create a database named auction in your MySQL server.

Configure the database credentials in the backend .env file:

    DB_NAME=auction
    DB_USER=root
    DB_PASSWORD=
    DB_HOST=localhost
    JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
    JWT_EXPIRES_IN=1h
    PORT=3000
    NODE_ENV=development

Start the server:
  Once configured, start the backend server:
  
      npm run dev

### 2. **Frontend Configuration
Install dependencies:
Navigate to the frontend folder and install the required dependencies:

      cd auction-frontend
      npm install

Configure the backend URL:
Ensure the frontend .env file has the correct backend URL:

    VITE_API_URL=http://localhost:3000

Start the application:
Once configured, start the frontend application:

    npm run dev

Hardcoded Users
The project includes predefined users for testing. You can log in with the following credentials:

    Username Password Role
    admin1 password1 admin
    admin2 password2 admin
    user1 password1 regular
    user2 password2 regular
    user3 password3 regular


