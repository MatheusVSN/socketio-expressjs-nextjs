# Next.js/Express.js chat application

This project is a simple chat application using Next.js and Express.js. The main purpose of the application is to experiment with Socket.io connections. It also contains JWT authentication by the Express.js side handled with cookies by Next.js.

## Requirements

- [Node.js](https://nodejs.org/en)
- [MySQL](https://www.mysql.com/)

## Setting up the database

- Open your MySQL Workbench
- Navigate into your local instance and log in with your credentials
- Execute this MySQL Script to create the database:
  ```mysql
  CREATE DATABASE IF NOT EXISTS simple_chat;
  ```

## Setting up the back-end

- Navigate with your terminal into the `back-end` folder
- Execute `npm install` to install all dependencies
- Create a file named `.env` into the root of the folder
- Into the `.env` file, paste and modify of the code below:

  ```bash
  JWT_ACESS_SECRET=SECRET
  JWT_REFRESH_SECRET=ANOTHER_SECRET123

  DATABASE_URL="mysql://{ROOT}:{PASSWORD}@localhost:{PORT}/simple_chat"
  ```

  - Replace the {ROOT} with your database root username
  - Replace {PASSWORD} with your database root password
  - Replace {PORT} with your database PORT
  - Example:

  ```bash
  DATABASE_URL="mysql://root:mypassword@localhost:3306/simple_chat"
  ```

- Execute `npx prisma db push` to apply the project database schema onto your local MySQL
- Execute the project with `npm run dev`
- The server should be running on `http://localhost:3333/` or where you set the port for

## Setting up the front-end

- Navigate with your teminal into the `front-end`folder
- Execute `npm install` to install all dependencies
- Create a file named `.env.local` into the root of the folder
- Into the `.env.local` file, paste and modify the code below:
  ```bash
  # Modify this accordinly to your back-end url(without "/")
  NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
  ```
- Execute the folder with `npm run dev`
- The front-end should be running on `http://localhost:3000/` or where you set the port for
