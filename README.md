Project Setup Guide (Frontend + Backend + XAMPP + MySQL)

========================================================
REQUIREMENTS
========================================================
Install the following before running the project:

1. XAMPP (for MySQL + Apache)
2. Node.js and npm
3. Nodemon (install with: npm install -g nodemon)
4. React, Express.js, mysql2, Axios (installed through npm)

========================================================
DATABASE SETUP (XAMPP)
========================================================
1. Open XAMPP Control Panel.
2. Start MySQL and Apache .
3. Open phpMyAdmin: http://localhost/phpmyadmin
4. Create a database named: Project_DM
5. Import the file: Project_DM.sql or run it through sql panel ( file located in web scraping project\backend\database setup)

========================================================
PROJECT INSTALLATION
========================================================
1. Download or clone the project.
2. Extract all contents into a single main folder.

========================================================
BACKEND SETUP
========================================================
1. Open a terminal inside the backend folder:
   cd backend

2. Install dependencies:
   npm install

3. Start the backend using Nodemon:
   nodemon server.js

You should see:
"Server running..."
"MySQL connected..."

========================================================
FRONTEND SETUP (REACT)
========================================================
1. Open a second terminal inside the MyApp or frontend folder:
   cd my-app

2. Install dependencies:
   npm install

3. Start the frontend:
   npm start

The React app will run at:
http://localhost:3000

========================================================
CONNECTING FRONTEND & BACKEND
========================================================
Ensure Axios requests use your backend URL:
http://localhost:5000

========================================================
RUNNING THE FULL STACK
========================================================
1. Start XAMPP → Start MySQL.
2. Backend terminal → nodemon server.js
3. Frontend terminal → npm start
4. Open your browser → http://localhost:3000

========================================================
FEATURES INCLUDED
========================================================
- Dynamic product listing
- Search, sorting, filtering
- Product detail pages
- Recently viewed items
- Favorites / wishlist
- Apriori-based recommendation engine
- Full MySQL backend + Node.js API
