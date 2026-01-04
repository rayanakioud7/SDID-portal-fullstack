# 🎓 SDID Academic Portal (Full Stack)

A secure, role-based academic management system designed for the **Licence of Science and Techniques (LST)** program. This platform facilitates interaction between Students, Professors, and Administrators with a modern "Cyber-Moroccan" UI.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Tech Stack](https://img.shields.io/badge/Stack-Spring%20Boot%20%2B%20React-blue)

## 🌟 Key Features

### 🛡️ Security & Roles
* **Gatekeeper System:** New registrations are "Pending" until approved by an Admin.
* **Role-Based Access:**
    * **Admin:** Approve/Ban users, promote Students to Instructors.
    * **Instructor:** Create courses, manage grades (Coming Soon).
    * **Student:** View modules, submit assignments (Coming Soon).
* **Secure Auth:** BCrypt password hashing & robust JWT-ready architecture.

### 🎨 Frontend (React + Tailwind)
* **Cyber-Moroccan Aesthetic:** A unique blend of futuristic UI with traditional Zellige patterns.
* **Responsive Design:** Built with Tailwind CSS for seamless mobile/desktop experience.
* **Real-Time Dashboard:** Instant status updates without page reloads.

### ⚙️ Backend (Spring Boot)
* **RESTful API:** Clean architecture with Controllers, Services, and Repositories.
* **Data Integrity:** Strict validation (Email regex, Password length) handled globally.
* **Database:** MySQL relational schema with foreign key constraints.

## 🚀 Getting Started

### Prerequisites
* Java 17+
* Node.js & npm
* MySQL Server

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/rayanakioud7/SDID-portal-fullstack.git](https://github.com/rayanakioud7/SDID-portal-fullstack.git)
    ```

2.  **Setup Backend**
    * Open `Backend/src/main/resources/application.properties` and update your MySQL credentials.
    * Run the Spring Boot application.

3.  **Setup Frontend**
    ```bash
    cd Frontend
    npm install
    npm run dev
    ```

## 📸 Screenshots
*(You can upload your screenshots here later!)*

---
*Built by Rayan Akioud and Mohammed Sabri - SDID Student 2026*