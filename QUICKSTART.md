# 🚀 Quick Start Guide

This guide will help you get started with implementing the Split It app based on the design documentation.

## 📋 Prerequisites Checklist

Before you begin implementation, ensure you have:

- [ ] **Node.js v20+** installed (`node --version`)
- [ ] **npm or yarn** package manager
- [ ] **Git** for version control
- [ ] **Firebase account** (free tier is sufficient)
- [ ] **Code editor** (VS Code recommended)
- [ ] **Android Studio** or **Xcode** for mobile testing
- [ ] **Expo CLI** (`npm install -g expo-cli`)
- [ ] **SMTP credentials** for email (Mailtrap for dev, SendGrid for prod)

## 📚 Step 1: Understand the Documentation

**Time**: 2-4 hours

Follow this reading order:

1. **[README.md](README.md)** (10 min) - Get project overview
2. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** (20 min) - Understand scope and deliverables
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** (30 min) - Learn system architecture
4. **[ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md)** (15 min) - Visualize the system
5. **[FIREBASE_SCHEMA.md](FIREBASE_SCHEMA.md)** (30 min) - Understand data model
6. **[API_CONTRACT.md](API_CONTRACT.md)** (45 min) - Learn API endpoints
7. **[TASK_BREAKDOWN.md](TASK_BREAKDOWN.md)** (45 min) - See implementation plan

**Pro tip**: Use [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) to navigate

## 🔧 Step 2: Setup Development Environment

### 2.1 Create Project Structure

```bash
# Create main project directory
mkdir split-it-app
cd split-it-app

# Initialize git
git init
git branch -M main

# Copy documentation files
# (Place all .md files in the root or docs/ folder)
```

### 2.2 Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project "split-it-app"
3. Enable Firestore Database
4. Create Firestore indexes:
   - See [FIREBASE_SCHEMA.md](FIREBASE_SCHEMA.md) for index definitions
5. Set security rules:
   ```javascript
   // Deny all client access (backend-only)
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
6. Go to Project Settings → Service Accounts
7. Click "Generate new private key"
8. Save as `backend/serviceAccountKey.json` (don't commit!)

### 2.3 Setup SMTP Email

**For Development** (Mailtrap - free):
1. Sign up at [mailtrap.io](https://mailtrap.io/)
2. Get SMTP credentials from inbox settings
3. Note: Emails won't actually send, just captured for testing

**For Production** (choose one):
- **SendGrid**: 100 emails/day free
- **AWS SES**: $0.10 per 1000 emails
- **Mailgun**: 5000 emails/month free (3 months)

## 🏗️ Step 3: Backend Setup

### 3.1 Initialize Backend Project

```bash
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express@^4.18.2 \
  firebase-admin@^12.0.0 \
  jsonwebtoken@^9.0.2 \
  nodemailer@^6.9.8 \
  zod@^3.22.4 \
  dotenv@^16.4.1 \
  cors@^2.8.5 \
  helmet@^7.1.0 \
  express-rate-limit@^7.1.5 \
  winston@^3.11.0

# Install dev dependencies
npm install -D typescript@^5.3.3 \
  @types/express@^4.17.21 \
  @types/jsonwebtoken@^9.0.5 \
  @types/nodemailer@^6.4.14 \
  @types/cors@^2.8.17 \
  @types/node@^20.11.5 \
  ts-node@^10.9.2 \
  nodemon@^3.0.3 \
  eslint@^8.56.0 \
  @typescript-eslint/eslint-plugin@^6.19.0 \
  @typescript-eslint/parser@^6.19.0 \
  prettier@^3.2.4
```

### 3.2 Create Backend Configuration Files

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**package.json** scripts:
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

**.env.example**:
```
NODE_ENV=development
PORT=3000

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
EMAIL_FROM=noreply@splitit.app
```

### 3.3 Create Folder Structure

```bash
mkdir -p src/{config,controllers,middleware,repositories,routes,schemas,services,templates,types,utils}
mkdir tests/{unit,integration}

# See TASK_BREAKDOWN.md Task 1.5 for complete structure
```

### 3.4 Implement Backend

Follow [TASK_BREAKDOWN.md](TASK_BREAKDOWN.md) Phases 2-8:
- Phase 2: Backend Core Setup (8 hours)
- Phase 3: Auth & OTP (18 hours)
- Phase 4: Groups (13 hours)
- Phase 5: Expenses (12 hours)
- Phase 6: Balances (7 hours)
- Phase 7: Settlements (8 hours)
- Phase 8: Emails (6 hours)

**Total Backend Time**: ~72 hours

## 📱 Step 4: Mobile App Setup

### 4.1 Initialize Mobile Project

```bash
cd ..  # Back to root
npx create-expo-app mobile --template expo-template-blank-typescript

cd mobile

# Install dependencies
npm install @react-navigation/native@^6.1.9 \
  @react-navigation/bottom-tabs@^6.5.11 \
  @react-navigation/native-stack@^6.9.17 \
  @tanstack/react-query@^5.17.19 \
  axios@^1.6.5 \
  zod@^3.22.4 \
  react-hook-form@^7.49.3 \
  @hookform/resolvers@^3.3.4 \
  expo-secure-store@~12.8.1 \
  react-native-safe-area-context@4.8.2 \
  react-native-screens@~3.29.0
```

### 4.2 Create Mobile Configuration

**app.json** (update):
```json
{
  "expo": {
    "name": "Split It",
    "slug": "split-it",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4F46E5"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4F46E5"
      },
      "package": "com.yourcompany.splitit"
    }
  }
}
```

### 4.3 Create Folder Structure

```bash
mkdir -p src/{api,components/{common,groups,expenses,balances},hooks,navigation,screens/{auth,groups,expenses,balances,profile},store,types,utils,theme,schemas}
mkdir assets

# See TASK_BREAKDOWN.md Task 1.5 for complete structure
```

### 4.4 Implement Mobile App

Follow [TASK_BREAKDOWN.md](TASK_BREAKDOWN.md) Phases 9-10:
- Phase 9: Mobile UI (40 hours)
- Phase 10: API Integration (21 hours)

**Total Mobile Time**: ~61 hours

## 🧪 Step 5: Testing

### 5.1 Backend Testing

```bash
cd backend

# Install test dependencies
npm install -D jest@^29.7.0 \
  @types/jest@^29.5.11 \
  ts-jest@^29.1.1 \
  supertest@^6.3.3 \
  @types/supertest@^6.0.2

# Configure Jest
npx ts-jest config:init

# Run tests
npm test
```

Follow [TASK_BREAKDOWN.md](TASK_BREAKDOWN.md) Phase 11 for test implementation.

### 5.2 Mobile Testing

```bash
cd mobile

# Install test dependencies
npm install -D jest@^29.7.0 \
  @testing-library/react-native@^12.4.2 \
  @testing-library/jest-native@^5.4.3

# Run tests
npm test
```

## 🚀 Step 6: Deployment

### 6.1 Backend Deployment (Railway)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app/)
3. Create new project
4. Connect GitHub repository
5. Set environment variables from `.env`
6. Deploy!

**Alternative**: Render, Fly.io (see [TASK_BREAKDOWN.md](TASK_BREAKDOWN.md) Task 12.2)

### 6.2 Mobile Build (EAS)

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK for testing
eas build --platform android --profile preview

# Download APK and install on device
```

## 📊 Implementation Timeline

| Phase | Description | Time | Status |
|-------|-------------|------|--------|
| Setup | Environment setup | 4 hours | [ ] |
| Backend | Phases 2-8 | 72 hours | [ ] |
| Mobile | Phases 9-10 | 61 hours | [ ] |
| Testing | Phase 11 | 26 hours | [ ] |
| Deployment | Phase 12 | 11 hours | [ ] |
| **Total** | | **174 hours** | [ ] |

**Solo Developer**: 4-5 weeks full-time  
**Team (2)**: 3-4 weeks with parallel work

## 🎯 Minimum Viable Product Checklist

Before launching MVP, ensure:

- [ ] **Authentication**
  - [ ] Send OTP to email
  - [ ] Verify OTP and issue JWT
  - [ ] Secure token storage

- [ ] **Groups**
  - [ ] Create group
  - [ ] Add members by email
  - [ ] View group details

- [ ] **Expenses**
  - [ ] Add expense
  - [ ] Split equally among members
  - [ ] View expense list
  - [ ] Edit/delete expense

- [ ] **Balances**
  - [ ] Calculate balances correctly
  - [ ] Display who owes whom
  - [ ] Real-time updates

- [ ] **Settlements**
  - [ ] Record payment
  - [ ] Confirm payment
  - [ ] View settlement history

- [ ] **Email Notifications**
  - [ ] OTP email
  - [ ] Expense added notification
  - [ ] Settlement confirmation request

- [ ] **Testing**
  - [ ] Backend API tests passing
  - [ ] Mobile component tests passing
  - [ ] End-to-end flows working

- [ ] **Production Ready**
  - [ ] Backend deployed and accessible
  - [ ] APK built and tested
  - [ ] Error handling working
  - [ ] Performance acceptable

## 🆘 Troubleshooting

### Common Issues

**Backend won't start**:
- Check `.env` file exists with all variables
- Verify Firebase credentials are correct
- Check port 3000 is not in use

**Mobile app won't build**:
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo version compatibility

**Firebase permission denied**:
- Verify security rules are set correctly
- Check service account key is valid
- Ensure backend is using Admin SDK

**Email not sending**:
- Verify SMTP credentials
- Check email service is not rate limiting
- Look at backend logs for errors

## 📞 Getting Help

- **Documentation**: Check [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- **Architecture Questions**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Questions**: See [API_CONTRACT.md](API_CONTRACT.md)
- **Task Details**: See [TASK_BREAKDOWN.md](TASK_BREAKDOWN.md)
- **Issues**: Open GitHub issue with details

## ✅ Next Steps

1. **Today**: Complete setup (Steps 1-2)
2. **Week 1**: Backend core + auth (Phases 2-3)
3. **Week 2**: Backend features (Phases 4-7)
4. **Week 3**: Mobile UI (Phase 9)
5. **Week 4**: Integration + testing (Phases 10-11)
6. **Week 5**: Deployment + polish (Phase 12)

**Remember**: Start with backend, then mobile, then integrate!

## 🎉 Success!

Once your MVP is running:
1. Test all user flows
2. Fix any bugs
3. Gather feedback
4. Plan next features from [FUTURE_ENHANCEMENTS.md](FUTURE_ENHANCEMENTS.md)

**Good luck with implementation! 🚀**

---

**Need more details?** Every step is documented in [TASK_BREAKDOWN.md](TASK_BREAKDOWN.md)
