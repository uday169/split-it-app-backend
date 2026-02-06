# Split It - Expense Sharing App

A Splitwise-like mobile application for sharing expenses among groups, built with modern best practices and a focus on simplicity.

## 🎯 Project Overview

Split It is a mobile-first expense sharing application that allows users to:
- Create groups for shared expenses
- Add expenses and automatically calculate splits
- Track balances (who owes whom)
- Settle up with manual confirmations
- Receive email notifications for activities

## 🏗️ Tech Stack

### Mobile App
- **Framework**: React Native with Expo SDK 50
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React Query (TanStack Query v5)
- **Forms**: React Hook Form + Zod validation
- **API Client**: Axios

### Backend
- **Runtime**: Node.js LTS (v20)
- **Framework**: Express v4
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Email OTP + JWT tokens
- **Email**: Nodemailer
- **Validation**: Zod
- **Logging**: Winston

### Infrastructure
- **Database**: Firebase Firestore (NoSQL)
- **Backend Hosting**: Railway / Render / Fly.io
- **Mobile Build**: EAS Build (Expo Application Services)
- **Email Provider**: SendGrid / AWS SES / Mailgun (via SMTP)

## 📋 Product Scope

### ✅ Must Have (MVP)
- Email-only login with OTP (no passwords)
- Create and manage groups
- Add members to groups by email
- Add shared expenses with automatic split calculation
- Auto balance calculation (who owes whom)
- Manual settlement flow with confirmation
- Email notifications (expense added, settlement reminders)

### ❌ Must NOT Have (Out of Scope)
- Payment integrations (Stripe, PayPal, etc.)
- Push notifications
- Multi-tenant SaaS features
- Admin panel / dashboard
- Web application
- Social login (Google, Facebook, etc.)

## 📁 Project Structure

```
split-it-app-backend/
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── repositories/       # Database access layer
│   │   ├── routes/             # API routes
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # Business logic
│   │   ├── templates/          # Email templates
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   └── index.ts            # Entry point
│   └── tests/                  # Unit & integration tests
│
├── mobile/                      # React Native mobile app
│   ├── src/
│   │   ├── api/                # API client functions
│   │   ├── components/         # Reusable components
│   │   ├── hooks/              # React Query hooks
│   │   ├── navigation/         # Navigation structure
│   │   ├── screens/            # Screen components
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── store/              # Auth storage
│   │   ├── theme/              # Design system
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utility functions
│   └── assets/                 # Images, fonts
│
└── docs/                        # Documentation (this folder)
    ├── ARCHITECTURE.md          # System architecture
    ├── API_CONTRACT.md          # API specifications
    ├── FIREBASE_SCHEMA.md       # Database schema
    ├── TASK_BREAKDOWN.md        # Implementation tasks
    ├── TECH_STACK.md            # Technology justifications
    ├── MOBILE_SCREENS.md        # UI/UX specifications
    └── FUTURE_ENHANCEMENTS.md   # Future features
```

## 📚 Documentation

All design and planning documentation is located in the root directory:

1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - High-level system architecture, data flows, and component interactions
2. **[FIREBASE_SCHEMA.md](FIREBASE_SCHEMA.md)** - Complete Firestore data model with schemas and indexes
3. **[API_CONTRACT.md](API_CONTRACT.md)** - Full API specification with endpoints, request/response formats
4. **[TASK_BREAKDOWN.md](TASK_BREAKDOWN.md)** - Phase-wise task breakdown with time estimates (12 phases, 60+ tasks)
5. **[TECH_STACK.md](TECH_STACK.md)** - Technology choices with justifications and alternatives considered
6. **[MOBILE_SCREENS.md](MOBILE_SCREENS.md)** - Complete mobile UI/UX specifications with wireframes
7. **[FUTURE_ENHANCEMENTS.md](FUTURE_ENHANCEMENTS.md)** - Post-MVP features and roadmap

## 🚀 Quick Start

### Prerequisites
- Node.js v20+ LTS
- npm or yarn
- Firebase project (Firestore enabled)
- Expo CLI
- Android Studio or Xcode (for mobile development)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Firebase credentials and SMTP settings
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
npm start
# Press 'a' for Android or 'i' for iOS
```

## 🔑 Key Features

### Authentication Flow
1. User enters email
2. Backend generates and sends 6-digit OTP via email
3. User enters OTP
4. Backend verifies OTP and issues JWT token (30-day expiry)
5. Mobile app stores JWT securely and uses it for all API calls

### Balance Calculation Algorithm
1. For each group, fetch all expenses and splits
2. For each pair of users (A, B):
   - Calculate: Amount A paid for B's splits
   - Calculate: Amount B paid for A's splits
   - Net balance = (A paid for B) - (B paid for A)
3. Subtract confirmed settlements
4. Return simplified balances (who owes whom)

### Split Types
- **Equal Split**: Amount divided equally among selected members
- **Manual Split**: User specifies individual amounts (must sum to total)

## 🎨 Design Principles

- **Minimal & Clean**: No clutter, focus on content
- **Modern UI**: Rounded corners, cards, smooth transitions
- **Android-First**: Optimized for Android (Material Design inspired)
- **Type-Safe**: TypeScript everywhere with strict mode
- **Stateless Backend**: Horizontally scalable, no session storage

## 🧪 Testing Strategy

### Backend
- **Unit Tests**: Business logic in services
- **Integration Tests**: API endpoints with Firebase emulator
- **Tool**: Jest + Supertest

### Mobile
- **Component Tests**: React Testing Library
- **Integration Tests**: Key user flows
- **Tool**: Jest + React Native Testing Library

## 🔒 Security

- **Authentication**: Backend-driven OTP with JWT
- **Validation**: Zod schemas on both frontend and backend
- **Rate Limiting**: 3 OTP requests per 15 minutes
- **Secure Storage**: JWT stored in encrypted storage (Expo Secure Store)
- **CORS**: Restricted to mobile app origin
- **Headers**: Helmet middleware for secure HTTP headers

## 📊 Performance Considerations

- **Caching**: React Query with 5-minute stale time on mobile
- **Pagination**: All list endpoints support pagination
- **Indexes**: Firestore composite indexes for common queries
- **Denormalization**: Store member count to avoid joins
- **Async Operations**: Email sending is fire-and-forget

## 🚀 Deployment

### Backend
1. Push code to Git repository
2. Connect to Railway/Render/Fly.io
3. Set environment variables
4. Auto-deploy on push

### Mobile
1. Update API base URL to production
2. Run `eas build --platform android --profile preview`
3. Download APK and distribute for testing

## 📈 Estimated Timeline

**Total Development Time**: 150-170 hours (~4-5 weeks for solo developer)

**Critical Path**:
1. Setup & Auth (2 weeks)
2. Core Features (2 weeks)
3. Mobile UI & Integration (1.5 weeks)
4. Testing & Polish (0.5 week)

## 🎯 Success Metrics

- Users can create groups in < 30 seconds
- Adding an expense takes < 1 minute
- Balance calculation is instant (< 1 second)
- 99%+ API uptime
- All API responses < 500ms

## 📝 Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| Email OTP (no password) | Simpler UX, no password management |
| JWT without refresh | Reduced complexity (30-day expiry acceptable) |
| No push notifications | Simplicity, emails sufficient for MVP |
| Firestore (not SQL) | Fast development, managed service |
| React Query (not Redux) | Simpler state management for server data |
| Express (not NestJS) | Lightweight, team familiarity |

## 🔮 Future Enhancements

See [FUTURE_ENHANCEMENTS.md](FUTURE_ENHANCEMENTS.md) for full roadmap.

**High Priority**:
- Push notifications (Firebase Cloud Messaging)
- Multi-currency support
- Dark mode
- Expense categories
- Profile pictures

## 🤝 Contributing

This project follows best practices:
- TypeScript strict mode
- ESLint + Prettier for code style
- Conventional commits
- Feature branch workflow
- Code review before merge

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

This is a portfolio/interview project showcasing:
- Full-stack mobile development
- System architecture & design
- Clean code practices
- Modern tech stack proficiency
- Product thinking

## 📞 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ using modern best practices**
