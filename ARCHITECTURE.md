# System Architecture

## High-Level Architecture Diagram (Textual)

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE APP (React Native + Expo)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Auth Screen │  │ Group Screens│  │ Expense Mgmt │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
│                   ┌────────▼─────────┐                          │
│                   │  API Client      │                          │
│                   │  (React Query)   │                          │
│                   └────────┬─────────┘                          │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTPS + JWT
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                    NODE.JS BACKEND (Express + TypeScript)      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐   │
│  │              API LAYER (Routes + Controllers)          │   │
│  └───────────────────────────┬───────────────────────────┘   │
│                              │                                 │
│  ┌───────────────────────────▼───────────────────────────┐   │
│  │           SERVICE LAYER (Business Logic)               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│   │
│  │  │ Auth Svc │ │Group Svc │ │Expense   │ │Settlement││   │
│  │  │          │ │          │ │Svc       │ │Svc       ││   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘│   │
│  └───────────────────────────┬───────────────────────────┘   │
│                              │                                 │
│  ┌───────────────────────────▼───────────────────────────┐   │
│  │              DATA ACCESS LAYER (Repositories)          │   │
│  └───────────────────────────┬───────────────────────────┘   │
│                              │                                 │
│  ┌───────────────────────────▼───────────────────────────┐   │
│  │          MIDDLEWARE (Auth, Validation, Error)          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────┐          ┌────────────────────┐       │
│  │  Email Service     │          │  JWT Service       │       │
│  │  (Nodemailer)      │          │                    │       │
│  └────────────────────┘          └────────────────────┘       │
└────────────────────────┬─────────────────────┬─────────────────┘
                         │                     │
            ┌────────────▼────────┐   ┌────────▼────────┐
            │  Firebase Firestore │   │  SMTP Server    │
            │                     │   │  (Email OTP +   │
            │  - users            │   │   Notifications)│
            │  - groups           │   └─────────────────┘
            │  - groupMembers     │
            │  - expenses         │
            │  - expenseSplits    │
            │  - settlements      │
            │  - emailOtps        │
            └─────────────────────┘
```

## Architecture Principles

### 1. **Backend-Driven Authentication**
- No Firebase client authentication on mobile
- Backend generates and validates OTP
- JWT tokens issued after OTP verification
- Mobile app includes JWT in all API requests

### 2. **Stateless Backend**
- No session storage on server
- All state in Firebase Firestore
- JWT contains minimal user context
- Horizontal scaling ready

### 3. **Layered Architecture**
```
Routes → Controllers → Services → Repositories → Firestore
  ↓          ↓            ↓           ↓
Middleware: Auth, Validation, Error Handling
```

### 4. **Mobile App Architecture**
```
Screens → Hooks (React Query) → API Client → Backend
  ↓
Components (Functional + TypeScript)
  ↓
Navigation (React Navigation v7+)
```

### 5. **Data Flow**

#### Authentication Flow
```
1. User enters email → POST /auth/send-otp
2. Backend generates 6-digit OTP → Saves to emailOtps collection
3. Backend sends email via Nodemailer
4. User enters OTP → POST /auth/verify-otp
5. Backend validates OTP → Issues JWT token
6. Mobile stores JWT → Uses in Authorization header
```

#### Expense Creation Flow
```
1. User fills expense form → Validates with Zod
2. POST /expenses with JWT
3. Backend validates JWT → Extracts userId
4. Service layer:
   - Creates expense document
   - Creates expenseSplits for each participant
   - Recalculates group balances
   - Triggers email notifications
5. Returns expense + updated balances
6. Mobile updates UI via React Query cache invalidation
```

#### Balance Calculation
```
1. When expense added/edited/deleted
2. Service recalculates net balance for all group members
3. Algorithm: For each pair of members:
   - Sum all splits where A paid for B
   - Sum all splits where B paid for A
   - Net = (A paid for B) - (B paid for A)
4. Store simplified balances (who owes whom)
5. Return to client
```

### 6. **Error Handling Strategy**

```
API Error → Middleware catches → Standardized JSON response
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "The OTP you entered is invalid or expired",
    "details": {}
  }
}
```

Mobile handles:
- Network errors (offline mode with cached data)
- Validation errors (display inline)
- Authentication errors (redirect to login)
- Server errors (generic error message)

### 7. **Security Measures**

- **Input Validation**: Zod schemas on backend
- **Rate Limiting**: OTP generation limited to 3 per 15 minutes
- **JWT Expiry**: 30-day expiry, refresh token pattern not implemented (trade-off for simplicity)
- **CORS**: Restricted to mobile app origin (in production)
- **Environment Variables**: All secrets in .env
- **SQL Injection**: N/A (NoSQL with Firebase Admin SDK)
- **XSS**: N/A (API only, no HTML rendering)

### 8. **Scalability Considerations**

- **Firestore Indexes**: Created for common queries
- **Pagination**: Implemented for groups, expenses lists
- **Caching**: React Query on mobile (5-minute stale time)
- **Database Denormalization**: Group member count stored in group doc
- **Background Jobs**: Email sending is async (fire and forget)

### 9. **Testing Strategy**

Backend:
- Unit tests for services (business logic)
- Integration tests for API endpoints
- Test database: Firebase emulator

Mobile:
- Component tests with React Testing Library
- Integration tests for flows
- E2E tests with Detox (future)

### 10. **Deployment Architecture**

```
Backend:
- Hosted on Railway / Render / Fly.io
- Environment: Node.js LTS
- Env variables injected
- Health check endpoint: GET /health

Mobile:
- Expo Go in development
- EAS Build for testing (APK)
- Not published to app stores (as per requirement)
```

## Engineering Decisions & Trade-offs

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| Email OTP only (no password) | Simpler UX, no password management | Depends on email delivery |
| JWT without refresh tokens | Reduced complexity | User re-authenticates every 30 days |
| No push notifications | Simplicity, use emails instead | Less real-time feel |
| Firestore (not PostgreSQL) | Fast development, managed service | Limited query capabilities |
| No payment integration | MVP scope | Manual settlements only |
| Backend-driven auth | Security, control | Extra API call overhead |
| React Query (not Redux) | Modern, simpler state management | Learning curve for teams used to Redux |
| Express (not NestJS) | Lightweight, familiar | Less opinionated structure |

## Component Interactions

### Mobile App Components
```
App
├── Navigation (React Navigation)
│   ├── AuthNavigator (if not logged in)
│   │   ├── LoginScreen
│   │   └── OtpScreen
│   └── MainNavigator (if logged in)
│       ├── BottomTabs
│       │   ├── HomeTab (Groups List)
│       │   ├── ActivityTab (Recent expenses)
│       │   └── ProfileTab
│       └── Stacks
│           ├── GroupStack
│           │   ├── GroupDetailsScreen
│           │   ├── AddExpenseScreen
│           │   ├── BalanceScreen
│           │   └── SettleUpScreen
│           └── ProfileStack
│
├── API Client (axios instance with interceptors)
│   └── JWT injection, error handling
│
├── React Query Hooks
│   ├── useAuth (login, logout)
│   ├── useGroups (list, create, update)
│   ├── useExpenses (add, list, delete)
│   └── useBalances (fetch, settle)
│
└── Shared Components
    ├── Button
    ├── Input
    ├── Card
    ├── Avatar
    └── LoadingSpinner
```

### Backend Components
```
Server (Express)
├── Middleware
│   ├── authMiddleware (JWT verification)
│   ├── validationMiddleware (Zod schemas)
│   ├── errorMiddleware (centralized error handling)
│   └── loggingMiddleware (request/response logs)
│
├── Routes
│   ├── /auth (send-otp, verify-otp, refresh-token)
│   ├── /users (get-profile, update-profile)
│   ├── /groups (create, list, get, update, delete, add-member, remove-member)
│   ├── /expenses (create, list, get, update, delete)
│   └── /settlements (create, list, confirm)
│
├── Controllers (request/response handling)
│   ├── AuthController
│   ├── UserController
│   ├── GroupController
│   ├── ExpenseController
│   └── SettlementController
│
├── Services (business logic)
│   ├── AuthService (OTP generation, JWT signing)
│   ├── UserService
│   ├── GroupService
│   ├── ExpenseService (split calculation)
│   ├── BalanceService (net balance calculation)
│   ├── SettlementService
│   └── EmailService (Nodemailer)
│
├── Repositories (Firestore access)
│   ├── UserRepository
│   ├── GroupRepository
│   ├── GroupMemberRepository
│   ├── ExpenseRepository
│   ├── ExpenseSplitRepository
│   ├── SettlementRepository
│   └── EmailOtpRepository
│
├── Utils
│   ├── jwtUtils (sign, verify)
│   ├── otpUtils (generate 6-digit OTP)
│   ├── emailTemplates (HTML templates)
│   └── logger (Winston)
│
└── Config
    ├── firebase.config (Admin SDK init)
    ├── email.config (Nodemailer setup)
    └── app.config (port, environment)
```

## Monitoring & Observability

- **Logging**: Winston logger with different levels (error, warn, info)
- **Health Check**: `/health` endpoint returns server status + Firebase connection
- **Error Tracking**: Errors logged with stack traces
- **Performance**: Future: Add APM tool like New Relic (out of scope)

## Future Improvements (Not in MVP)

- Refresh token pattern
- Push notifications via Firebase Cloud Messaging
- Profile pictures stored in Firebase Storage
- Multi-currency support
- Recurring expenses
- Categories and tags
- Split by percentage or shares (not just equal split)
- Export to CSV
- Dark mode
- Localization (i18n)
