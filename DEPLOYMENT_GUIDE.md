# Deployment Guide - Split It App

Complete guide for deploying the Split It expense sharing application to production.

## 🚀 Overview

This guide covers:
1. **Backend Deployment** - Deploy Node.js API to Railway/Render
2. **Mobile App Build** - Build Android APK with Expo EAS
3. **Production Configuration** - Environment variables and security
4. **Post-Deployment** - Testing and monitoring

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Git repository pushed to GitHub
- [ ] Firebase project created and configured
- [ ] SMTP credentials for production email
- [ ] Railway/Render account (for backend)
- [ ] Expo account (for mobile build)
- [ ] All code tested and working locally

---

## 🔧 Part 1: Backend Deployment

### Option A: Railway (Recommended)

**Why Railway?**
- Free tier: 500 hours/month (enough for MVP)
- Simple deployment from Git
- Automatic HTTPS
- Easy environment variables
- Good performance

**Steps:**

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Verify email

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `split-it-app-backend` repository
   - Select `main` branch

3. **Configure Build Settings**
   
   Railway should auto-detect Node.js, but verify:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Watch Paths**: `backend/**`

4. **Set Environment Variables**
   
   Go to project settings → Variables, add:
   
   ```env
   NODE_ENV=production
   PORT=3000
   
   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your-production-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-random
   
   # Email (Production SMTP)
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   EMAIL_FROM=noreply@yourdomain.com
   
   # Frontend URL (for CORS)
   FRONTEND_URL=exp://your-expo-app.com
   ```

   **Important Notes:**
   - Use production Firebase project (separate from dev)
   - Generate JWT_SECRET: `openssl rand -base64 32`
   - FIREBASE_PRIVATE_KEY must include `\n` for newlines
   - Get SendGrid API key from [sendgrid.com](https://sendgrid.com) (100 emails/day free)

5. **Deploy**
   - Railway will automatically deploy on push to main
   - Monitor logs for errors
   - First deployment takes 2-5 minutes

6. **Get Production URL**
   - Railway provides a URL like: `https://your-app.railway.app`
   - Copy this URL for mobile app configuration

7. **Test Deployment**
   ```bash
   curl https://your-app.railway.app/health
   # Should return: {"status":"ok"}
   ```

### Option B: Render

**Steps:**

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository
   - Choose `split-it-app-backend`

3. **Configure Service**
   - **Name**: `split-it-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Set Environment Variables**
   - Same as Railway (see above)

5. **Deploy**
   - Click "Create Web Service"
   - Monitor deployment logs

### Option C: Fly.io

**Steps:**

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   flyctl auth login
   ```

3. **Create App**
   ```bash
   cd backend
   flyctl launch
   # Follow prompts, select region
   ```

4. **Set Environment Variables**
   ```bash
   flyctl secrets set \
     NODE_ENV=production \
     JWT_SECRET=your-secret \
     FIREBASE_PROJECT_ID=your-project \
     # ... (add all variables)
   ```

5. **Deploy**
   ```bash
   flyctl deploy
   ```

---

## 📱 Part 2: Mobile App Build

### Setup Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS Build**
   ```bash
   cd mobile
   eas build:configure
   ```

   This creates `eas.json`:
   ```json
   {
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       },
       "production": {
         "android": {
           "buildType": "app-bundle"
         }
       }
     }
   }
   ```

4. **Update API Base URL**
   
   Edit `mobile/src/utils/config.ts`:
   ```typescript
   export const API_BASE_URL = 'https://your-app.railway.app/api';
   ```

   Or use environment variable:
   ```typescript
   export const API_BASE_URL = 
     process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
   ```

5. **Build for Testing (APK)**
   ```bash
   eas build --platform android --profile preview
   ```
   
   - This takes 10-20 minutes
   - You'll get a download link for the APK
   - Share APK with testers

6. **Build for Production (AAB)**
   ```bash
   eas build --platform android --profile production
   ```
   
   - Generates an Android App Bundle (AAB)
   - Required for Google Play Store

7. **Download and Install**
   - Download APK from Expo
   - Enable "Install from Unknown Sources" on Android
   - Install and test the app

### iOS Build (Optional, requires Apple Developer Account)

```bash
eas build --platform ios --profile preview
```

**Requirements:**
- Apple Developer account ($99/year)
- macOS for local testing
- Certificates and provisioning profiles

---

## 🔒 Part 3: Security & Production Configuration

### Backend Security Checklist

- [x] **Environment Variables**
  - All secrets in environment variables
  - No hardcoded credentials
  - Strong JWT secret (32+ characters)

- [x] **HTTPS**
  - Backend served over HTTPS (Railway/Render provide this)
  - Force HTTPS redirect

- [x] **CORS**
  - Configure allowed origins
  - Don't use `*` in production

- [x] **Rate Limiting**
  - OTP: 3 requests per 15 minutes
  - API: 100 requests per 5 minutes
  - Monitor for abuse

- [x] **Logging**
  - Winston configured
  - Error logging to file
  - No sensitive data in logs

- [x] **Firebase Security**
  - Use production Firebase project
  - Firestore rules deny all client access
  - Rotate service account keys periodically

### Mobile Security Checklist

- [x] **API URL**
  - Use production backend URL
  - Verify HTTPS connection

- [x] **Secure Storage**
  - JWT stored in expo-secure-store
  - No tokens in AsyncStorage

- [x] **Code Obfuscation**
  - Enable Hermes for React Native
  - Minify JavaScript in production build

- [x] **Network Security**
  - Certificate pinning (future enhancement)
  - Validate SSL certificates

---

## 📊 Part 4: Monitoring & Maintenance

### Backend Monitoring

1. **Health Check**
   ```bash
   curl https://your-app.railway.app/health
   ```

2. **Railway Dashboard**
   - Monitor CPU/Memory usage
   - View deployment logs
   - Check error rates

3. **Firebase Console**
   - Monitor Firestore reads/writes
   - Check for quota limits
   - Review security rules

4. **Email Provider Dashboard**
   - Monitor email delivery rates
   - Check bounce rates
   - Review spam complaints

### Mobile App Monitoring

1. **Crash Reporting** (Future)
   - Sentry
   - Firebase Crashlytics

2. **Analytics** (Future)
   - Firebase Analytics
   - Amplitude

3. **User Feedback**
   - In-app feedback form
   - Email support
   - GitHub issues

---

## 🧪 Part 5: Post-Deployment Testing

### Backend Testing Checklist

Test all endpoints with production backend:

- [ ] **Authentication**
  ```bash
  # Send OTP
  curl -X POST https://your-app.railway.app/api/auth/send-otp \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  
  # Verify OTP
  curl -X POST https://your-app.railway.app/api/auth/verify-otp \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","otp":"123456"}'
  ```

- [ ] **Groups** (with JWT token)
  ```bash
  curl -X GET https://your-app.railway.app/api/groups \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

- [ ] **Expenses**
- [ ] **Balances**
- [ ] **Settlements**

### Mobile App Testing Checklist

Test with production backend:

- [ ] **Login Flow**
  - Enter email
  - Receive OTP email
  - Verify OTP
  - Navigate to home screen

- [ ] **Groups**
  - Create new group
  - View group details
  - Add member
  - Remove member

- [ ] **Expenses**
  - Add expense
  - Split equally
  - View expense details
  - Edit expense
  - Delete expense

- [ ] **Balances**
  - View balances
  - Verify calculations
  - Record settlement
  - Confirm settlement

- [ ] **Profile**
  - View profile
  - Edit name
  - Logout

---

## 📝 Part 6: Rollback & Troubleshooting

### Rolling Back Deployment

**Railway:**
1. Go to project → Deployments
2. Find last working deployment
3. Click "Redeploy"

**Render:**
1. Go to service → Events
2. Find last successful deploy
3. Click "Rollback"

### Common Issues

#### Backend Won't Start

**Symptom:** Deployment succeeds but app crashes

**Solutions:**
1. Check logs for error messages
2. Verify all environment variables are set
3. Test Firebase credentials
4. Check SMTP credentials
5. Verify Node.js version matches package.json

#### Mobile App Can't Connect

**Symptom:** Network errors in mobile app

**Solutions:**
1. Verify backend URL in config.ts
2. Check backend is running (health check)
3. Verify CORS settings allow mobile app
4. Check phone has internet connection
5. Try on different network (not corporate firewall)

#### OTP Emails Not Sending

**Symptom:** Users don't receive OTP emails

**Solutions:**
1. Check email logs in backend
2. Verify SMTP credentials
3. Check email provider dashboard
4. Test with different email address
5. Check spam folder

---

## 💰 Part 7: Cost Estimation

### Free Tier (Development/MVP)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Railway | 500 hours/month | $0 |
| Firebase Firestore | 1 GB, 50K reads/day | $0 |
| SendGrid | 100 emails/day | $0 |
| Expo EAS | 30 builds/month | $0 |
| **Total** | | **$0/month** |

### Scaling Costs (1,000+ users)

| Service | Usage | Cost |
|---------|-------|------|
| Railway | 730 hours/month | $10/month |
| Firebase | 10 GB, 500K reads/day | $20/month |
| SendGrid | 1000 emails/day | $15/month |
| **Total** | | **$45/month** |

---

## 🎯 Part 8: Success Criteria

### Deployment Complete When:

- [x] Backend deployed and accessible via HTTPS
- [x] Health check returns `{"status":"ok"}`
- [x] All environment variables configured
- [x] Production Firebase project connected
- [x] Email sending works (test OTP)
- [x] Mobile APK built successfully
- [x] Mobile app connects to backend
- [x] End-to-end user flows tested
- [x] No critical errors in logs
- [x] Documentation updated with production URLs

---

## 📚 Part 9: Additional Resources

### Documentation Links

- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Expo EAS Docs](https://docs.expo.dev/eas/)
- [Firebase Docs](https://firebase.google.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com/)

### Support

- **Backend Issues**: Check logs in hosting dashboard
- **Mobile Issues**: Check Expo build logs
- **Email Issues**: Contact email provider support
- **Firebase Issues**: Check Firebase console

---

## ✅ Deployment Checklist

Use this checklist to track deployment progress:

### Pre-Deployment
- [ ] All code committed and pushed
- [ ] Tests passing locally
- [ ] Environment variables documented
- [ ] Production Firebase project created
- [ ] SMTP provider account created

### Backend Deployment
- [ ] Hosting platform account created
- [ ] GitHub repository connected
- [ ] Build commands configured
- [ ] Environment variables set
- [ ] Initial deployment successful
- [ ] Health check endpoint working
- [ ] API endpoints tested with Postman

### Mobile Build
- [ ] EAS CLI installed
- [ ] Expo account created
- [ ] EAS build configured
- [ ] API URL updated to production
- [ ] APK built successfully
- [ ] APK tested on device
- [ ] All user flows working

### Post-Deployment
- [ ] Production monitoring set up
- [ ] Error logging configured
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on deployment process

---

## 🎉 Congratulations!

Your Split It app is now deployed to production! 🚀

**Next Steps:**
1. Share APK with beta testers
2. Gather feedback
3. Fix bugs and iterate
4. Plan next features from FUTURE_ENHANCEMENTS.md
5. Consider submitting to Google Play Store

**Remember:**
- Monitor your free tier limits
- Back up Firebase data regularly
- Keep dependencies updated
- Respond to user feedback quickly

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-06  
**Status**: Production Deployment Guide
