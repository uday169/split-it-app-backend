# Task Breakdown - Phase-wise Implementation Plan

## Overview

This document breaks down the Splitwise-like mobile app project into clear, actionable tasks organized by implementation phases. Each task includes objectives, files/modules involved, dependencies, and expected outputs.

---

## Phase 1: System Architecture & Setup

### Task 1.1: Project Repository Setup

**Objective**: Initialize Git repository with proper structure

**Files/Modules**:
- `.gitignore`
- `README.md`
- `LICENSE`
- `.editorconfig`

**Dependencies**: None

**Output Expectation**:
- Clean repo structure
- Proper gitignore for Node.js and React Native
- README with project overview
- MIT or Apache 2.0 license

**Estimated Time**: 30 minutes

---

### Task 1.2: Backend Project Initialization

**Objective**: Set up Node.js TypeScript backend with Express

**Files/Modules**:
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/src/index.ts`
- `backend/.env.example`
- `backend/.eslintrc.js`
- `backend/.prettierrc`

**Dependencies**: Task 1.1

**Libraries to Install**:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "firebase-admin": "^12.0.0",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.8",
    "zod": "^3.22.4",
    "dotenv": "^16.4.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/nodemailer": "^6.4.14",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.11.5",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.3",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "prettier": "^3.2.4"
  }
}
```

**Output Expectation**:
- TypeScript configured with strict mode
- Express server running on port 3000
- ESLint + Prettier configured
- Hot reload with nodemon
- Environment variables loaded

**Estimated Time**: 2 hours

---

### Task 1.3: Mobile App Project Initialization

**Objective**: Set up React Native Expo app with TypeScript

**Files/Modules**:
- `mobile/package.json`
- `mobile/tsconfig.json`
- `mobile/app.json`
- `mobile/App.tsx`
- `mobile/.eslintrc.js`
- `mobile/.prettierrc`

**Dependencies**: Task 1.1

**Command**:
```bash
npx create-expo-app mobile --template expo-template-blank-typescript
```

**Libraries to Install**:
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.2",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native-stack": "^6.9.17",
    "@tanstack/react-query": "^5.17.19",
    "axios": "^1.6.5",
    "zod": "^3.22.4",
    "react-hook-form": "^7.49.3",
    "@hookform/resolvers": "^3.3.4",
    "expo-secure-store": "~12.8.1",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.7",
    "@types/react": "~18.2.45",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}
```

**Output Expectation**:
- Expo app running on Android/iOS simulator
- TypeScript strict mode enabled
- Navigation structure set up
- ESLint + Prettier configured

**Estimated Time**: 2 hours

---

### Task 1.4: Firebase Project Setup

**Objective**: Create Firebase project and initialize Firestore

**Files/Modules**:
- Firebase Console configuration
- `backend/src/config/firebase.config.ts`
- `backend/serviceAccountKey.json` (gitignored)
- Firestore security rules

**Dependencies**: Task 1.2

**Steps**:
1. Create Firebase project in console
2. Enable Firestore Database
3. Download service account key
4. Set Firestore security rules (deny all client access)
5. Create initial indexes

**Output Expectation**:
- Firebase Admin SDK initialized in backend
- Firestore collections ready
- Security rules deployed
- Service account key stored securely

**Estimated Time**: 1 hour

---

### Task 1.5: Folder Structure Definition

**Objective**: Create clean, scalable folder structure for both projects

**Backend Structure**:
```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/                  # Configuration files
│   │   ├── firebase.config.ts
│   │   ├── email.config.ts
│   │   └── app.config.ts
│   ├── middleware/              # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logging.middleware.ts
│   ├── routes/                  # API routes
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── group.routes.ts
│   │   ├── expense.routes.ts
│   │   └── settlement.routes.ts
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── group.controller.ts
│   │   ├── expense.controller.ts
│   │   └── settlement.controller.ts
│   ├── services/                # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── group.service.ts
│   │   ├── expense.service.ts
│   │   ├── balance.service.ts
│   │   ├── settlement.service.ts
│   │   └── email.service.ts
│   ├── repositories/            # Database access
│   │   ├── user.repository.ts
│   │   ├── group.repository.ts
│   │   ├── groupMember.repository.ts
│   │   ├── expense.repository.ts
│   │   ├── expenseSplit.repository.ts
│   │   ├── settlement.repository.ts
│   │   └── emailOtp.repository.ts
│   ├── types/                   # TypeScript types
│   │   ├── express.d.ts
│   │   ├── user.types.ts
│   │   ├── group.types.ts
│   │   ├── expense.types.ts
│   │   └── common.types.ts
│   ├── utils/                   # Utility functions
│   │   ├── jwt.utils.ts
│   │   ├── otp.utils.ts
│   │   ├── logger.ts
│   │   └── validators.ts
│   ├── schemas/                 # Zod validation schemas
│   │   ├── auth.schemas.ts
│   │   ├── user.schemas.ts
│   │   ├── group.schemas.ts
│   │   ├── expense.schemas.ts
│   │   └── settlement.schemas.ts
│   └── templates/               # Email templates
│       ├── otp.template.ts
│       ├── expenseAdded.template.ts
│       └── settlementReminder.template.ts
├── tests/                       # Test files
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

**Mobile Structure**:
```
mobile/
├── src/
│   ├── api/                     # API client
│   │   ├── client.ts           # Axios instance
│   │   ├── auth.api.ts
│   │   ├── user.api.ts
│   │   ├── group.api.ts
│   │   ├── expense.api.ts
│   │   └── settlement.api.ts
│   ├── hooks/                   # React Query hooks
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useGroups.ts
│   │   ├── useExpenses.ts
│   │   ├── useBalances.ts
│   │   └── useSettlements.ts
│   ├── navigation/              # Navigation structure
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── types.ts
│   ├── screens/                 # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── OtpScreen.tsx
│   │   ├── groups/
│   │   │   ├── GroupsListScreen.tsx
│   │   │   ├── GroupDetailsScreen.tsx
│   │   │   └── CreateGroupScreen.tsx
│   │   ├── expenses/
│   │   │   ├── AddExpenseScreen.tsx
│   │   │   ├── ExpenseDetailsScreen.tsx
│   │   │   └── EditExpenseScreen.tsx
│   │   ├── balances/
│   │   │   ├── BalancesScreen.tsx
│   │   │   └── SettleUpScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── components/              # Reusable components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── groups/
│   │   │   ├── GroupCard.tsx
│   │   │   └── MemberList.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseCard.tsx
│   │   │   └── SplitInput.tsx
│   │   └── balances/
│   │       ├── BalanceCard.tsx
│   │       └── SettlementCard.tsx
│   ├── store/                   # Auth storage
│   │   └── authStore.ts
│   ├── types/                   # TypeScript types
│   │   ├── api.types.ts
│   │   ├── navigation.types.ts
│   │   └── common.types.ts
│   ├── utils/                   # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── theme/                   # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── theme.ts
│   └── schemas/                 # Zod validation schemas
│       ├── auth.schemas.ts
│       ├── group.schemas.ts
│       └── expense.schemas.ts
├── assets/                      # Images, fonts
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

**Dependencies**: Task 1.2, 1.3

**Output Expectation**:
- All folders created with README files
- Index files with exports
- Clean import paths

**Estimated Time**: 1 hour

---

## Phase 2: Backend Core Setup

### Task 2.1: Logging & Error Handling Setup

**Objective**: Configure Winston logger and centralized error handling

**Files/Modules**:
- `backend/src/utils/logger.ts`
- `backend/src/middleware/error.middleware.ts`
- `backend/src/types/common.types.ts`

**Dependencies**: Task 1.5

**Output Expectation**:
- Winston logger with console and file transports
- Different log levels (error, warn, info, debug)
- Centralized error middleware
- Custom error classes (ValidationError, AuthError, etc.)

**Estimated Time**: 2 hours

---

### Task 2.2: Firebase Admin SDK Integration

**Objective**: Initialize and configure Firebase Admin SDK

**Files/Modules**:
- `backend/src/config/firebase.config.ts`
- Environment variables for Firebase config

**Dependencies**: Task 1.4

**Output Expectation**:
- Firebase Admin SDK initialized
- Firestore client exported
- Connection health check function

**Estimated Time**: 1 hour

---

### Task 2.3: Base Repositories Setup

**Objective**: Create base repository pattern for Firestore access

**Files/Modules**:
- `backend/src/repositories/base.repository.ts`
- Type definitions for repository operations

**Dependencies**: Task 2.2

**Output Expectation**:
- Generic CRUD operations
- Type-safe repository methods
- Error handling for database operations

**Estimated Time**: 2 hours

---

### Task 2.4: Validation Middleware Setup

**Objective**: Create Zod-based validation middleware

**Files/Modules**:
- `backend/src/middleware/validation.middleware.ts`
- `backend/src/schemas/` (base setup)

**Dependencies**: Task 2.1

**Output Expectation**:
- Middleware to validate request body, params, query
- Integration with Zod schemas
- Proper error responses for validation failures

**Estimated Time**: 2 hours

---

## Phase 3: Authentication & OTP Flow

### Task 3.1: OTP Generation & Storage

**Objective**: Implement OTP generation and storage logic

**Files/Modules**:
- `backend/src/utils/otp.utils.ts`
- `backend/src/repositories/emailOtp.repository.ts`
- `backend/src/services/auth.service.ts`

**Dependencies**: Task 2.3

**Output Expectation**:
- 6-digit OTP generation
- OTP storage in Firestore with expiry
- Rate limiting logic (3 per 15 mins)

**Estimated Time**: 3 hours

---

### Task 3.2: Email Service Setup

**Objective**: Configure Nodemailer for sending emails

**Files/Modules**:
- `backend/src/config/email.config.ts`
- `backend/src/services/email.service.ts`
- `backend/src/templates/otp.template.ts`

**Dependencies**: Task 1.2

**Output Expectation**:
- Nodemailer configured with SMTP
- Email template for OTP
- Async email sending (fire and forget)
- Error handling for email failures

**Estimated Time**: 3 hours

---

### Task 3.3: JWT Token Management

**Objective**: Implement JWT signing and verification

**Files/Modules**:
- `backend/src/utils/jwt.utils.ts`
- `backend/src/types/express.d.ts` (extend Request type)

**Dependencies**: Task 1.2

**Output Expectation**:
- JWT signing function
- JWT verification function
- Token payload includes userId, email
- 30-day expiry

**Estimated Time**: 2 hours

---

### Task 3.4: Auth Middleware

**Objective**: Create middleware to verify JWT on protected routes

**Files/Modules**:
- `backend/src/middleware/auth.middleware.ts`

**Dependencies**: Task 3.3

**Output Expectation**:
- Extract token from Authorization header
- Verify JWT
- Attach user info to request object
- Return 401 for invalid/missing token

**Estimated Time**: 2 hours

---

### Task 3.5: Auth API Endpoints

**Objective**: Implement login flow endpoints

**Files/Modules**:
- `backend/src/routes/auth.routes.ts`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/schemas/auth.schemas.ts`

**Dependencies**: Task 3.1, 3.2, 3.3

**Endpoints**:
- `POST /auth/send-otp`
- `POST /auth/verify-otp`

**Output Expectation**:
- Send OTP endpoint working
- Verify OTP and issue JWT working
- User creation on first login
- Proper error handling

**Estimated Time**: 4 hours

---

### Task 3.6: User Repository & Service

**Objective**: Implement user CRUD operations

**Files/Modules**:
- `backend/src/repositories/user.repository.ts`
- `backend/src/services/user.service.ts`
- `backend/src/types/user.types.ts`

**Dependencies**: Task 2.3

**Output Expectation**:
- Create user
- Get user by ID
- Get user by email
- Update user profile

**Estimated Time**: 2 hours

---

### Task 3.7: User API Endpoints

**Objective**: Implement user management endpoints

**Files/Modules**:
- `backend/src/routes/user.routes.ts`
- `backend/src/controllers/user.controller.ts`
- `backend/src/schemas/user.schemas.ts`

**Dependencies**: Task 3.6, 3.4

**Endpoints**:
- `GET /users/me`
- `PATCH /users/me`

**Output Expectation**:
- Get profile working
- Update profile working
- Auth middleware protecting routes

**Estimated Time**: 2 hours

---

## Phase 4: Group & Member Management

### Task 4.1: Group Repository

**Objective**: Implement group data access layer

**Files/Modules**:
- `backend/src/repositories/group.repository.ts`
- `backend/src/types/group.types.ts`

**Dependencies**: Task 2.3

**Output Expectation**:
- Create group
- Get group by ID
- List user's groups
- Update group
- Delete group

**Estimated Time**: 2 hours

---

### Task 4.2: GroupMember Repository

**Objective**: Implement group membership data access

**Files/Modules**:
- `backend/src/repositories/groupMember.repository.ts`

**Dependencies**: Task 2.3

**Output Expectation**:
- Add member to group
- Remove member from group
- Get group members
- Check membership

**Estimated Time**: 2 hours

---

### Task 4.3: Group Service Layer

**Objective**: Implement group business logic

**Files/Modules**:
- `backend/src/services/group.service.ts`

**Dependencies**: Task 4.1, 4.2

**Output Expectation**:
- Create group (with creator as admin member)
- Add member by email (create user if not exists)
- Remove member (check balance first)
- Update member count on add/remove

**Estimated Time**: 4 hours

---

### Task 4.4: Group API Endpoints

**Objective**: Implement group management endpoints

**Files/Modules**:
- `backend/src/routes/group.routes.ts`
- `backend/src/controllers/group.controller.ts`
- `backend/src/schemas/group.schemas.ts`

**Dependencies**: Task 4.3, 3.4

**Endpoints**:
- `POST /groups`
- `GET /groups`
- `GET /groups/:groupId`
- `PATCH /groups/:groupId`
- `DELETE /groups/:groupId`
- `POST /groups/:groupId/members`
- `DELETE /groups/:groupId/members/:userId`

**Output Expectation**:
- All endpoints working
- Proper authorization (admin-only for some)
- Validation working

**Estimated Time**: 5 hours

---

## Phase 5: Expense & Split Logic

### Task 5.1: Expense Repository

**Objective**: Implement expense data access layer

**Files/Modules**:
- `backend/src/repositories/expense.repository.ts`
- `backend/src/types/expense.types.ts`

**Dependencies**: Task 2.3

**Output Expectation**:
- Create expense
- Get expense by ID
- List group expenses (paginated)
- Update expense
- Delete expense

**Estimated Time**: 2 hours

---

### Task 5.2: ExpenseSplit Repository

**Objective**: Implement expense split data access

**Files/Modules**:
- `backend/src/repositories/expenseSplit.repository.ts`

**Dependencies**: Task 2.3

**Output Expectation**:
- Create splits (batch)
- Get splits by expense
- Get splits by user and group
- Delete splits

**Estimated Time**: 2 hours

---

### Task 5.3: Expense Service Layer

**Objective**: Implement expense business logic

**Files/Modules**:
- `backend/src/services/expense.service.ts`

**Dependencies**: Task 5.1, 5.2

**Output Expectation**:
- Create expense with splits (batch operation)
- Calculate equal splits automatically
- Validate manual splits sum to total
- Update expense and recalculate splits
- Delete expense and all splits

**Estimated Time**: 4 hours

---

### Task 5.4: Expense API Endpoints

**Objective**: Implement expense management endpoints

**Files/Modules**:
- `backend/src/routes/expense.routes.ts`
- `backend/src/controllers/expense.controller.ts`
- `backend/src/schemas/expense.schemas.ts`

**Dependencies**: Task 5.3, 3.4

**Endpoints**:
- `POST /expenses`
- `GET /groups/:groupId/expenses`
- `GET /expenses/:expenseId`
- `PATCH /expenses/:expenseId`
- `DELETE /expenses/:expenseId`

**Output Expectation**:
- All endpoints working
- Proper authorization
- Validation working
- Pagination for list

**Estimated Time**: 4 hours

---

## Phase 6: Balance Calculation Engine

### Task 6.1: Balance Service Layer

**Objective**: Implement balance calculation algorithm

**Files/Modules**:
- `backend/src/services/balance.service.ts`

**Dependencies**: Task 5.2

**Algorithm**:
1. Fetch all expenses and splits for group
2. For each user pair (A, B):
   - Calculate net = (A paid for B) - (B paid for A)
3. Subtract confirmed settlements
4. Return simplified balances

**Output Expectation**:
- Calculate group balances
- Calculate user balance
- Simplified balance structure (who owes whom)
- Performance: < 1 second for 100 expenses

**Estimated Time**: 5 hours

---

### Task 6.2: Balance API Endpoints

**Objective**: Implement balance viewing endpoints

**Files/Modules**:
- `backend/src/routes/balance.routes.ts` (or in group routes)
- `backend/src/controllers/balance.controller.ts`

**Dependencies**: Task 6.1, 3.4

**Endpoints**:
- `GET /groups/:groupId/balances`
- `GET /groups/:groupId/balances/me`

**Output Expectation**:
- Real-time balance calculation
- Proper authorization
- Formatted response with user details

**Estimated Time**: 2 hours

---

## Phase 7: Settlement Flow

### Task 7.1: Settlement Repository

**Objective**: Implement settlement data access layer

**Files/Modules**:
- `backend/src/repositories/settlement.repository.ts`
- `backend/src/types/settlement.types.ts`

**Dependencies**: Task 2.3

**Output Expectation**:
- Create settlement
- Get settlement by ID
- List group settlements
- Update settlement status
- Get confirmed settlements for balance calc

**Estimated Time**: 2 hours

---

### Task 7.2: Settlement Service Layer

**Objective**: Implement settlement business logic

**Files/Modules**:
- `backend/src/services/settlement.service.ts`

**Dependencies**: Task 7.1, 6.1

**Output Expectation**:
- Create settlement (validate amount against balance)
- Confirm settlement (payee only)
- List settlements with filtering

**Estimated Time**: 3 hours

---

### Task 7.3: Settlement API Endpoints

**Objective**: Implement settlement management endpoints

**Files/Modules**:
- `backend/src/routes/settlement.routes.ts`
- `backend/src/controllers/settlement.controller.ts`
- `backend/src/schemas/settlement.schemas.ts`

**Dependencies**: Task 7.2, 3.4

**Endpoints**:
- `POST /settlements`
- `PATCH /settlements/:settlementId/confirm`
- `GET /groups/:groupId/settlements`

**Output Expectation**:
- All endpoints working
- Proper authorization
- Validation working

**Estimated Time**: 3 hours

---

## Phase 8: Email Notification System

### Task 8.1: Email Templates

**Objective**: Create HTML email templates

**Files/Modules**:
- `backend/src/templates/expenseAdded.template.ts`
- `backend/src/templates/settlementReminder.template.ts`
- `backend/src/templates/memberAdded.template.ts`

**Dependencies**: Task 3.2

**Output Expectation**:
- Responsive HTML templates
- Variable interpolation
- Consistent branding

**Estimated Time**: 3 hours

---

### Task 8.2: Notification Triggers

**Objective**: Integrate email sending in service layer

**Files/Modules**:
- Update `expense.service.ts`
- Update `settlement.service.ts`
- Update `group.service.ts`

**Dependencies**: Task 8.1

**Triggers**:
- Expense added → Email all group members
- Settlement recorded → Email payee
- Settlement confirmed → Email payer
- Member added → Email new member

**Output Expectation**:
- Async email sending (non-blocking)
- Error handling (log failures, don't block request)

**Estimated Time**: 3 hours

---

## Phase 9: Mobile UI Screens

### Task 9.1: Theme & Design System

**Objective**: Set up theme, colors, typography

**Files/Modules**:
- `mobile/src/theme/colors.ts`
- `mobile/src/theme/typography.ts`
- `mobile/src/theme/spacing.ts`
- `mobile/src/theme/theme.ts`

**Dependencies**: Task 1.3

**Color Palette**:
```typescript
{
  primary: '#4F46E5', // Indigo
  secondary: '#10B981', // Green
  error: '#EF4444',
  warning: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB'
}
```

**Output Expectation**:
- Centralized theme object
- Type-safe color and spacing access
- Consistent design system

**Estimated Time**: 2 hours

---

### Task 9.2: Common Components

**Objective**: Build reusable UI components

**Files/Modules**:
- `mobile/src/components/common/Button.tsx`
- `mobile/src/components/common/Input.tsx`
- `mobile/src/components/common/Card.tsx`
- `mobile/src/components/common/Avatar.tsx`
- `mobile/src/components/common/LoadingSpinner.tsx`
- `mobile/src/components/common/ErrorMessage.tsx`

**Dependencies**: Task 9.1

**Output Expectation**:
- Consistent, reusable components
- TypeScript prop types
- Responsive design
- Accessibility support

**Estimated Time**: 6 hours

---

### Task 9.3: Navigation Setup

**Objective**: Configure React Navigation structure

**Files/Modules**:
- `mobile/src/navigation/AppNavigator.tsx`
- `mobile/src/navigation/AuthNavigator.tsx`
- `mobile/src/navigation/MainNavigator.tsx`
- `mobile/src/navigation/types.ts`

**Dependencies**: Task 1.3

**Structure**:
- AuthNavigator: Login → OTP
- MainNavigator: Bottom Tabs + Stacks
  - HomeTab → GroupsList → GroupDetails → AddExpense
  - ActivityTab → Recent expenses
  - ProfileTab → Profile settings

**Output Expectation**:
- Navigation working
- Type-safe navigation params
- Conditional rendering (logged in/out)

**Estimated Time**: 4 hours

---

### Task 9.4: Auth Screens

**Objective**: Build login and OTP screens

**Files/Modules**:
- `mobile/src/screens/auth/LoginScreen.tsx`
- `mobile/src/screens/auth/OtpScreen.tsx`
- `mobile/src/schemas/auth.schemas.ts`

**Dependencies**: Task 9.2, 9.3

**Features**:
- Email input with validation
- Send OTP button
- OTP input (6 digits)
- Verify button
- Loading states
- Error handling

**Output Expectation**:
- Working login flow
- Form validation with Zod
- Smooth UX

**Estimated Time**: 5 hours

---

### Task 9.5: Group Screens

**Objective**: Build group management screens

**Files/Modules**:
- `mobile/src/screens/groups/GroupsListScreen.tsx`
- `mobile/src/screens/groups/GroupDetailsScreen.tsx`
- `mobile/src/screens/groups/CreateGroupScreen.tsx`
- `mobile/src/components/groups/GroupCard.tsx`
- `mobile/src/components/groups/MemberList.tsx`

**Dependencies**: Task 9.2, 9.3

**Features**:
- List of groups
- Create new group
- View group details
- Add/remove members
- Group settings

**Output Expectation**:
- Working group CRUD
- Member management
- Smooth navigation

**Estimated Time**: 6 hours

---

### Task 9.6: Expense Screens

**Objective**: Build expense management screens

**Files/Modules**:
- `mobile/src/screens/expenses/AddExpenseScreen.tsx`
- `mobile/src/screens/expenses/ExpenseDetailsScreen.tsx`
- `mobile/src/screens/expenses/EditExpenseScreen.tsx`
- `mobile/src/components/expenses/ExpenseCard.tsx`
- `mobile/src/components/expenses/SplitInput.tsx`

**Dependencies**: Task 9.2, 9.3

**Features**:
- Add expense form
- Description, amount, date inputs
- Split type selector (equal/manual)
- Member selection for split
- Expense list in group
- Edit/delete expense

**Output Expectation**:
- Working expense CRUD
- Split calculation
- Form validation

**Estimated Time**: 7 hours

---

### Task 9.7: Balance & Settlement Screens

**Objective**: Build balance viewing and settlement screens

**Files/Modules**:
- `mobile/src/screens/balances/BalancesScreen.tsx`
- `mobile/src/screens/balances/SettleUpScreen.tsx`
- `mobile/src/components/balances/BalanceCard.tsx`
- `mobile/src/components/balances/SettlementCard.tsx`

**Dependencies**: Task 9.2, 9.3

**Features**:
- Balance summary for group
- Simplified view (who owes whom)
- Record settlement
- Confirm settlement
- Settlement history

**Output Expectation**:
- Clear balance visualization
- Working settlement flow

**Estimated Time**: 5 hours

---

### Task 9.8: Profile Screen

**Objective**: Build user profile screen

**Files/Modules**:
- `mobile/src/screens/profile/ProfileScreen.tsx`

**Dependencies**: Task 9.2, 9.3

**Features**:
- Display user info
- Edit name
- Logout button
- App version info

**Output Expectation**:
- Working profile management
- Logout functionality

**Estimated Time**: 2 hours

---

## Phase 10: API Integration

### Task 10.1: Axios Client Setup

**Objective**: Configure Axios instance with interceptors

**Files/Modules**:
- `mobile/src/api/client.ts`
- `mobile/src/store/authStore.ts`

**Dependencies**: Task 1.3

**Features**:
- Base URL configuration
- JWT token injection in headers
- Request/response interceptors
- Error handling
- Token refresh logic (future)

**Output Expectation**:
- Centralized API client
- Automatic auth header
- Proper error handling

**Estimated Time**: 3 hours

---

### Task 10.2: API Layer Functions

**Objective**: Create typed API functions

**Files/Modules**:
- `mobile/src/api/auth.api.ts`
- `mobile/src/api/user.api.ts`
- `mobile/src/api/group.api.ts`
- `mobile/src/api/expense.api.ts`
- `mobile/src/api/settlement.api.ts`
- `mobile/src/types/api.types.ts`

**Dependencies**: Task 10.1

**Output Expectation**:
- Type-safe API functions
- Matches backend contracts
- Proper error handling

**Estimated Time**: 4 hours

---

### Task 10.3: React Query Hooks

**Objective**: Create React Query hooks for data fetching

**Files/Modules**:
- `mobile/src/hooks/useAuth.ts`
- `mobile/src/hooks/useUser.ts`
- `mobile/src/hooks/useGroups.ts`
- `mobile/src/hooks/useExpenses.ts`
- `mobile/src/hooks/useBalances.ts`
- `mobile/src/hooks/useSettlements.ts`

**Dependencies**: Task 10.2

**Features**:
- Query hooks for GET requests
- Mutation hooks for POST/PATCH/DELETE
- Cache management
- Optimistic updates
- Error handling
- Loading states

**Output Expectation**:
- Efficient data fetching
- Automatic cache invalidation
- Smooth UX with loading states

**Estimated Time**: 6 hours

---

### Task 10.4: Integration Testing

**Objective**: Connect mobile app to backend and test end-to-end

**Dependencies**: All previous tasks

**Testing Checklist**:
- [ ] Login with OTP
- [ ] Create group
- [ ] Add members
- [ ] Add expense
- [ ] View balances
- [ ] Record settlement
- [ ] Confirm settlement
- [ ] Update profile
- [ ] Logout

**Output Expectation**:
- Full app working end-to-end
- All features integrated
- Bug fixes applied

**Estimated Time**: 8 hours

---

## Phase 11: Testing Strategy

### Task 11.1: Backend Unit Tests

**Objective**: Write unit tests for services

**Files/Modules**:
- `backend/tests/unit/auth.service.test.ts`
- `backend/tests/unit/balance.service.test.ts`
- `backend/tests/unit/expense.service.test.ts`

**Dependencies**: Phase 2-8

**Tools**:
- Jest
- ts-jest

**Output Expectation**:
- 70%+ code coverage
- All business logic tested
- Edge cases covered

**Estimated Time**: 10 hours

---

### Task 11.2: Backend Integration Tests

**Objective**: Write API integration tests

**Files/Modules**:
- `backend/tests/integration/auth.test.ts`
- `backend/tests/integration/group.test.ts`
- `backend/tests/integration/expense.test.ts`

**Dependencies**: Phase 2-8

**Tools**:
- Jest
- Supertest
- Firebase emulator

**Output Expectation**:
- All endpoints tested
- Authentication tested
- Error cases covered

**Estimated Time**: 10 hours

---

### Task 11.3: Mobile Component Tests

**Objective**: Write tests for React components

**Files/Modules**:
- `mobile/src/components/__tests__/Button.test.tsx`
- `mobile/src/screens/__tests__/LoginScreen.test.tsx`

**Dependencies**: Phase 9

**Tools**:
- Jest
- React Testing Library

**Output Expectation**:
- Key components tested
- User interactions tested

**Estimated Time**: 6 hours

---

## Phase 12: Deployment

### Task 12.1: Environment Configuration

**Objective**: Set up production environment variables

**Files/Modules**:
- Production `.env` configuration
- Firebase production project

**Dependencies**: All previous phases

**Variables**:
- `NODE_ENV=production`
- `PORT=3000`
- `JWT_SECRET=<strong-secret>`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Firebase service account

**Output Expectation**:
- Secure environment variables
- Production Firebase project

**Estimated Time**: 2 hours

---

### Task 12.2: Backend Deployment

**Objective**: Deploy backend to hosting platform

**Platform Options**:
- Railway (recommended)
- Render
- Fly.io

**Dependencies**: Task 12.1

**Steps**:
1. Connect Git repository
2. Configure build command: `npm run build`
3. Configure start command: `npm start`
4. Set environment variables
5. Deploy

**Output Expectation**:
- Backend live at production URL
- Health check endpoint accessible
- Logs visible

**Estimated Time**: 3 hours

---

### Task 12.3: Mobile Build for Testing

**Objective**: Create APK build with EAS

**Dependencies**: Task 10.4

**Steps**:
1. Install EAS CLI
2. Run `eas build:configure`
3. Update API base URL to production
4. Run `eas build --platform android --profile preview`

**Output Expectation**:
- APK file for testing
- Installable on Android devices

**Estimated Time**: 2 hours

---

### Task 12.4: Documentation

**Objective**: Write comprehensive documentation

**Files/Modules**:
- `README.md` (updated)
- `API_DOCUMENTATION.md`
- `DEPLOYMENT.md`
- `CONTRIBUTING.md`

**Dependencies**: All phases

**Output Expectation**:
- Setup instructions
- API documentation
- Architecture overview
- Contribution guidelines

**Estimated Time**: 4 hours

---

## Summary

**Total Tasks**: 60+
**Estimated Total Time**: 150-170 hours (~4-5 weeks for solo developer)

**Critical Path**:
1. Setup (Phase 1-2)
2. Auth (Phase 3)
3. Groups (Phase 4)
4. Expenses (Phase 5)
5. Balances (Phase 6)
6. Mobile UI (Phase 9)
7. Integration (Phase 10)

**Parallel Work Opportunities**:
- Mobile UI can start after Phase 3
- Email templates can be done anytime
- Testing can be incremental

**Risk Areas**:
- Balance calculation algorithm complexity
- Email delivery reliability
- Mobile app performance with large datasets

**Mitigation**:
- Thorough testing of balance logic
- Fallback for email failures
- Pagination and caching strategy
