# Centillion Gateway Backend

Backend API for the Centillion Gateway website built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User registration and authentication
- Email verification system
- JWT-based authentication
- Password change functionality
- Rate limiting and security middleware
- TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Email service account (Gmail, SendGrid, etc.)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/centillion-gateway
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@centilliongateway.com
   FRONTEND_URL=http://localhost:3000
   EMAIL_VERIFICATION_EXPIRE=24h
   ```

## Development

1. Start MongoDB service
2. Run in development mode:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` with hot reloading.

## Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/change-password` - Change password (protected)
- `GET /api/auth/me` - Get current user (protected)

### Health Check
- `GET /health` - Server health check

## Email Configuration

The application uses nodemailer for sending emails. For Gmail:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in EMAIL_PASS

## Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- JWT authentication
- Password hashing with bcrypt
- Email verification tokens

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```
