# Next.js/Express.js with Socket IO chat application

This project is a simple chat application using Next.js and Express.js. The main purpose of the application is to experiment with Socket.io connections. It also contains JWT authentication by the Express.js side handled with cookies by Next.js.

## Technologies used
![Express.js](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=MySQL&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101.svg?style=for-the-badge&logo=socketdotio&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white)

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

- Navigate with your terminal into the `front-end` folder
- Execute `npm install` to install all dependencies
- Create a file named `.env.local` into the root of the folder
- Into the `.env.local` file, paste and modify the code below:
  ```bash
  # Modify this according to your back-end URL
  NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
  ```
- Execute the folder with `npm run dev`
- The front-end should be running on `http://localhost:3000/` or where you set the port for
