# 🚀 Quick Start Checklist - Android Studio

Use this checklist to quickly get started with Android Studio development.

## Prerequisites Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Android Studio installed (latest version)
- [ ] Android SDK Platform 34 installed
- [ ] Java JDK 17 or 21 installed
- [ ] Environment variable `ANDROID_HOME` set correctly

## First-Time Setup

- [ ] 1. Navigate to mobile directory: `cd mobile`
- [ ] 2. Install dependencies: `npm install`
- [ ] 3. Verify `android` folder exists (if not, run `npx expo prebuild --platform android`)
- [ ] 4. Create `android/local.properties` with your SDK path (see `local.properties.example`)
- [ ] 5. Open Android Studio
- [ ] 6. Open project: Select `mobile/android` folder
- [ ] 7. Wait for Gradle sync to complete (may take 5-10 minutes first time)

## Running the App

### Terminal 1 (Metro Bundler)
```bash
cd mobile
npm start
```
Leave this running!

### Terminal 2 or Android Studio
**Option A - Using Android Studio:**
- [ ] 1. Ensure an emulator is running or device is connected
- [ ] 2. Click the green **Run** button (▶️) in toolbar
- [ ] 3. Wait for build and installation

**Option B - Using Command Line:**
```bash
cd mobile
npm run android
```

## Verify Setup

- [ ] Metro bundler is running (Terminal 1)
- [ ] Android emulator/device is running
- [ ] App installed and launched successfully
- [ ] App shows login screen (or loads properly)
- [ ] Hot reload works (press `r` in Metro terminal to test)

## Backend Setup (Required for Full Functionality)

The mobile app needs the backend API running:

- [ ] 1. Open new terminal
- [ ] 2. Navigate to backend: `cd backend`
- [ ] 3. Install dependencies: `npm install`
- [ ] 4. Configure `.env` file (copy from `.env.example`)
- [ ] 5. Start backend: `npm run dev`
- [ ] 6. Backend should be at `http://localhost:3000`

## API Configuration

For Android Emulator, update `mobile/src/utils/config.ts`:

```typescript
export const config = {
  apiBaseUrl: 'http://10.0.2.2:3000/api/v1',  // Android Emulator
} as const;
```

For Physical Device (on same WiFi):
```typescript
export const config = {
  apiBaseUrl: 'http://YOUR_COMPUTER_IP:3000/api/v1',  // e.g., 192.168.1.100
} as const;
```

## Common Issues & Quick Fixes

### Issue: "SDK location not found"
```bash
# Create android/local.properties
cd mobile/android
echo "sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk" > local.properties  # macOS
# or
echo "sdk.dir=/home/YOUR_USERNAME/Android/Sdk" > local.properties  # Linux
```

### Issue: Gradle sync failed
```bash
cd mobile/android
./gradlew clean
# Then sync again in Android Studio
```

### Issue: "Unable to load script"
```bash
cd mobile
npm start -- --reset-cache
```

### Issue: App crashes or won't start
1. Check Metro bundler is running
2. Check Logcat in Android Studio for errors
3. Clean and rebuild:
   ```bash
   cd mobile/android
   ./gradlew clean
   ./gradlew assembleDebug
   ```

### Issue: Network request failed
- For emulator: Use `10.0.2.2` instead of `localhost`
- For device: Use computer's IP address
- Ensure backend is running
- Check firewall settings

## Development Workflow

### Daily Workflow
1. Start Metro: `cd mobile && npm start`
2. Open Android Studio
3. Run app (click ▶️)
4. Make code changes
5. See changes via Fast Refresh (automatic)
6. For major changes, press `r` in Metro terminal

### Building APK for Testing
```bash
cd mobile/android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

### Debugging
- View logs: Android Studio → Logcat
- Debug menu: Shake device or press `Cmd/Ctrl + M`
- Breakpoints: Set in Android Studio for Kotlin code
- JS debugger: Enable in debug menu → "Debug" → Opens Chrome DevTools

## Documentation Reference

When you need help, check these docs in order:

1. **Quick Reference**: `ANDROID_QUICK_REFERENCE.md` - Common commands
2. **Setup Guide**: `ANDROID_STUDIO_SETUP.md` - Detailed setup & troubleshooting
3. **Summary**: `ANDROID_SETUP_SUMMARY.md` - What was configured
4. **Project README**: `README.md` - Project overview and features

## Keyboard Shortcuts

**Android Studio:**
- `Shift + F10` (Win/Linux) / `Ctrl + R` (Mac) - Run app
- `Ctrl/Cmd + F9` - Build project
- `Ctrl/Cmd + Click` - Go to definition
- `Alt + F7` - Find usages

**Metro Bundler Terminal:**
- `r` - Reload
- `d` - Open developer menu
- `i` - Run on iOS
- `a` - Run on Android
- `w` - Run on web

## Success Criteria

✅ You're ready to develop when:
- Android Studio opens the project without errors
- Gradle sync completes successfully
- Metro bundler runs and shows QR code
- App launches on emulator/device
- Changes to code reflect in app (Fast Refresh works)
- App can connect to backend API (if backend is running)

## Next Steps

Once setup is complete:
- Explore the codebase in `mobile/src/`
- Read `IMPLEMENTATION_SUMMARY.md` for architecture overview
- Check `API_CONTRACT.md` (in project root) for API documentation
- Start developing features!

## Need More Help?

- **Detailed Setup**: Read `ANDROID_STUDIO_SETUP.md`
- **Command Reference**: Check `ANDROID_QUICK_REFERENCE.md`
- **Project Info**: See `README.md`
- **Issues**: Search error messages on Stack Overflow or GitHub

---

**Happy Coding!** 🎉

Remember: Always start Metro bundler first, then run the app!
