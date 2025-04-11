<!-- README.md -->

Task Management Web App
Joseph Koop
GUI Programming
April 11, 2024

To run this app:

   1. Download this directory. 
   2. Connect a database (see below).
   3. Navigate to the directory in a terminal.
   4. Type "npm start".
   5. Visit localhost:3000 in a browser.

Database setup:

   1. Install PostgrSQL.
   2. Create a new database, user, and tables.
   3. Create a .env file for storing environment variables.
   4. Add your user name, password, and database name to the .env file. Set host and port to the defaults.
   5. Create a javascript file in config directory and setup connection pool.
   6. In the model file, import query from your config file.
   7. Use await/async and try/catch alongside postgreSQL queries in the model to interact with the database.

Example .env file:

   1. DB_HOST=localhost
   2. DB_USER=user_name
   3. DB_PASSWORD=password
   4. DB_NAME=database_name
   5. DB_PORT=5432