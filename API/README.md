# CCQC-PROJECT
This is my project Farzana Pasha Jahangeer
Under the guidance of Professor Kumal Halder
Application: Booking Managment System
Phase 1

# Todo Application

A modern todo application built with React frontend and Node.js backend, featuring a clean Material-UI interface and REST API integration.

## Prerequisites

- Node.js (v18 or higher)
- npm (v6 or higher)
- npx (v10 or higher)
- Docker (for containerization)
- MySQL (8.x or higher)

## Project Structure

```
project/
├── API/               # Node.js API backend
├── WEB/               # React frontend 
└── .github/           # GitHub Actions workflows
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=servicedb


   #Application Port
   PORT=7070

   #App JWT
   TOKEN_EXPIRATION=
   TOKEN_SECRET=
   TOKEN_EXPIRATION_TYPE=
   ```

4. Test API Unit Test

   ```
   npm test
   ```

5. E2E Test
   ```
   npx cypress run
   npx cypress open
   ```

6. START Application

   ```
   npm start
   ```

The backend will be available at `http://localhost:7070`.

## Features

- User authentication
- Create, read, update, and delete users, clients, leades
- RESTful API backend
- TypeScript support
- Docker containerization
- GitHub Actions CI/CD pipeline

## API Endpoints

- `POST /api/login` - Login
- `GET /api/getuser:id` - Get spesific user details
- `GET api/getalluser` - get the list of all users
- `DELETE /api/deletelead:id` - Delete a user

## Docker Support

Build the images:

```bash
# Backend
cd backend
docker build -t ccqc-api .

Run the containers:

```bash
# Backend
docker run -p 7070:7070 ccqc-api

```

## Deployment

The application uses GitHub Actions for CI/CD and can be deployed to Google Cloud Run. The workflow files are located in `.github/workflows/`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
