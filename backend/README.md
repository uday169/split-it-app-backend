# Split It - Backend API

Backend server for the Split It expense sharing application.

## Features

- ✅ Email OTP Authentication (no passwords)
- ✅ JWT token-based sessions
- ✅ User management
- ✅ Group management
- ✅ Expense tracking
- ✅ Balance calculation
- ✅ Settlement flow
- ✅ Email notifications

## Tech Stack

- Node.js v20+ LTS
- TypeScript (strict mode)
- Express.js v4
- Firebase Firestore (database)
- Nodemailer (email)
- JWT for authentication
- Zod for validation
- Winston for logging

## Setup

### Prerequisites

- Node.js v20+
- Firebase project with Firestore enabled
- SMTP credentials (Mailtrap for dev, SendGrid/AWS SES for prod)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Firebase credentials and SMTP settings
nano .env
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings → Service Accounts
5. Click "Generate new private key"
6. Copy the credentials to your `.env` file

### Firestore Security Rules

Set these rules in Firebase Console to deny all client access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Firestore Indexes

Create the following composite indexes in Firebase Console:

1. **emailOtps**
   - Collection ID: `emailOtps`
   - Fields: `email` (Ascending), `verified` (Ascending), `createdAt` (Descending)

2. **emailOtps (for rate limiting)**
   - Collection ID: `emailOtps`
   - Fields: `email` (Ascending), `createdAt` (Ascending)

More indexes will be needed as we add groups, expenses, etc.

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Format code
npm run format
```

The server will start on port 3000 by default.

## API Endpoints

### Authentication

- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token

### User Management

- `GET /api/users/me` - Get current user profile (requires auth)
- `PUT /api/users/me` - Update current user profile (requires auth)

### Health Check

- `GET /health` - Server health check

## API Documentation

### Send OTP

```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully"
  }
}
```

### Verify OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "userId123",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

### Get Current User

```http
GET /api/users/me
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "userId123",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── config.ts     # Environment config
│   │   ├── firebase.ts   # Firebase initialization
│   │   └── logger.ts     # Winston logger
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # JWT authentication
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── repositories/     # Database access layer
│   │   ├── otp.repository.ts
│   │   └── user.repository.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   ├── schemas/         # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   └── user.schema.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── email.service.ts
│   │   └── user.service.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── jwt.ts
│   │   └── otp.ts
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── tests/               # Tests (to be added)
├── logs/                # Log files
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── package.json
└── tsconfig.json
```

## Error Handling

All API errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Missing or invalid JWT token
- `VALIDATION_ERROR` - Invalid request data
- `OTP_RATE_LIMIT` - Too many OTP requests
- `OTP_EXPIRED` - OTP has expired
- `INVALID_OTP` - Incorrect OTP
- `USER_NOT_FOUND` - User doesn't exist

## Security

- Rate limiting on OTP endpoints (3 requests per 15 minutes)
- JWT tokens expire after 30 days
- All passwords and sensitive data in environment variables
- CORS restricted to frontend URL
- Helmet middleware for security headers
- Input validation with Zod schemas

## Logging

Logs are written to:
- `logs/error.log` - Error level logs
- `logs/combined.log` - All logs
- Console (development only)

## Next Steps

- [ ] Implement group management
- [ ] Add expense tracking
- [ ] Build balance calculation engine
- [ ] Create settlement flow
- [ ] Add automated tests
- [ ] Deploy to production

## License

MIT
