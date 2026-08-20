# MET5 - 23080053- ĐỖ HẢI LINH - NHÓM 2
**Badminton Booking & Management System (Final Project)**

## 1. Project Purpose & Executive Summary
This is a comprehensive web-based business application designed for Badminton Court Owners and Players. It solves the real-world business problem of manual court reservations, scattered matchmaking, and inefficient payment tracking. 
- **For Players (Customers):** View available courts, book slots, make QR payments, and find partners (Matchmaking).
- **For Managers (Admins):** Manage users, confirm bookings, track revenue statistics in real-time, and publish news/promotions.

## 2. Features & Functional Scope
- **User Authentication:** Registration and Login with encrypted passwords (BCrypt).
- **Role-based Access Control:** Distinct workflows for `ADMIN` and `CUSTOMER`.
- **Dynamic Booking Workflow:** Pending -> Pending Payment (QR/Bank) -> Confirmed (Admin side).
- **Matchmaking System:** Players can create requests to find partners (specifying gender, cost, spots needed).
- **Admin Dashboard:** Real-time revenue charts, court occupancy, user statistics, and user management.
- **News & Promotions:** Admins can publish news dynamically which syncs to the customer homepage.

## 3. Technology Stack & Architecture
- **Frontend:** React, TypeScript, TailwindCSS (Vite Build System).
- **Backend:** PHP (PDO) acting as RESTful APIs.
- **Database:** MySQL / MariaDB (Relational Database).
- **Security:** Prepared Statements against SQL Injection (`PDO::ATTR_EMULATE_PREPARES = false`), Password Hashing, HTML input validation.

## 4. Installation & Setup Instructions
### Prerequisites
- XAMPP / MAMP or any server running PHP 8+ and MySQL.
- Node.js (v18+) and npm.

### Step-by-step Setup
1. **Database Import:**
   - Open phpMyAdmin (usually `http://localhost/phpmyadmin`).
   - Create a new database named `badminton_booking_db`.
   - Import the provided file `HSB2006_MET5_23080053_DoHaiLinh_Database.sql`.
   *(Note: The database contains all schema and sample data required for assessment).*

2. **Backend Setup:**
   - Move the `backend` folder into your XAMPP `htdocs` directory (e.g. `C:\xampp\htdocs\badminton-booking-backend`).
   - Open `backend/db_connection.php` and verify the `$username` and `$password` match your MySQL setup (default is `root` and empty password).
   - Ensure your PHP server is running on port `8000`. (If you use another port, update the API URLs in the React frontend). You can also run it via terminal:
     ```bash
     cd backend
     php -S localhost:8000
     ```

3. **Frontend Setup:**
   - Open a terminal and navigate to the `frontend` folder.
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev`
   - The application will open at `http://localhost:5173`.

## 5. Test Accounts
- **Admin Account:** 
  - Email: `superadmin@smashhub.vn` (Hoặc email admin của bạn trong Database)
  - Password: `123456`
- **Customer Account:**
  - Email: `an.nguyen@email.com`
  - Password: `123456`

## 6. Third-Party Libraries & Assets
- **Lucide React & Google Material Symbols:** Icons for user interfaces.
- **TailwindCSS:** Utility-first CSS framework.
- **Recharts (via custom SVG):** Admin dashboard charts.
- **Unsplash:** Placeholder images for courts and news.

## 7. Known Limitations
- The system currently supports simulated QR Bank Transfer. Direct Gateway API (e.g., VNPAY/MOMO) is mocked to fit the scope of a university project.
- Real-time WebSockets are not used; the dashboard updates on mount or via action triggers.

---
*This repository and application are submitted as the final examination requirement for VNU HSB2006 - MET5.*
