# Android Studio Setup - Summary

This document summarizes the Android Studio setup completed for the Split It mobile app.

## What Was Done

### 1. Generated Native Android Project
- Ran `npx expo prebuild --platform android` to generate the native Android project
- Created the complete `android/` folder structure with all necessary files
- Generated Gradle build configurations, Android manifests, and resource files

### 2. Created Comprehensive Documentation
Created three documentation files to help developers:

#### a) ANDROID_STUDIO_SETUP.md
Complete step-by-step setup guide including:
- Prerequisites (Node.js, Android Studio, JDK, Android SDK)
- Initial setup instructions
- How to open the project in Android Studio
- Three methods for running the app
- API configuration for Android emulator
- Troubleshooting common issues
- Build instructions for release APKs
- Production build guide with signing

#### b) ANDROID_QUICK_REFERENCE.md
Quick reference guide for:
- Common Android Studio tasks
- Gradle commands
- Metro bundler commands
- ADB commands
- Keyboard shortcuts
- Debugging tips
- Configuration file locations

#### c) local.properties.example
Template for configuring Android SDK location on different operating systems

### 3. Updated Existing Documentation

#### mobile/README.md
- Added "Option B: Using Android Studio" section
- Linked to detailed setup guide
- Provided quick start commands

#### Root README.md
- Updated Quick Start section with Android Studio option
- Added reference to detailed setup documentation

#### mobile/.gitignore
- Modified to NOT ignore the `android/` folder
- Added comment explaining why Android folder is committed

#### mobile/src/utils/config.ts
- Added detailed comments about Android emulator networking
- Explained the use of `10.0.2.2` for accessing localhost from emulator
- Provided examples for different scenarios (emulator, physical device, production)

### 4. Project Structure

The generated Android project includes:

```
mobile/android/
├── app/
│   ├── build.gradle           # App-level build configuration
│   ├── proguard-rules.pro     # ProGuard rules for release builds
│   ├── debug.keystore         # Debug signing key
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml      # App manifest
│       │   ├── java/com/anonymous/mobile/
│       │   │   ├── MainActivity.kt      # Main activity
│       │   │   └── MainApplication.kt   # Application class
│       │   └── res/             # Resources (icons, strings, styles)
│       ├── debug/
│       │   └── AndroidManifest.xml      # Debug manifest
│       └── debugOptimized/
│           └── AndroidManifest.xml      # Debug optimized manifest
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── build.gradle               # Project-level build configuration
├── gradle.properties          # Gradle configuration
├── settings.gradle            # Project settings
├── gradlew                    # Gradle wrapper (Unix)
├── gradlew.bat               # Gradle wrapper (Windows)
└── local.properties.example  # Template for SDK location
```

## Key Configuration Details

### Package Name
- Default: `com.anonymous.mobile`
- Configurable in `android/app/build.gradle` and `app.json`

### Android SDK Requirements
- Compile SDK: 34 (Android 14)
- Minimum SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)

### Gradle Version
- Gradle: 8.x (as specified in wrapper)
- Android Gradle Plugin: 8.x

### React Native Version
- React Native: 0.81.5
- Expo SDK: 54.0.33

### Permissions (AndroidManifest.xml)
- INTERNET - For API calls
- READ_EXTERNAL_STORAGE - For file access
- WRITE_EXTERNAL_STORAGE - For saving files
- SYSTEM_ALERT_WINDOW - For overlays
- VIBRATE - For haptic feedback

## How to Use

### For First-Time Setup
1. Read `ANDROID_STUDIO_SETUP.md` for complete instructions
2. Install prerequisites (Android Studio, SDK, JDK)
3. Configure environment variables
4. Open `mobile/android` in Android Studio
5. Wait for Gradle sync
6. Run the app

### For Daily Development
1. Start Metro: `cd mobile && npm start`
2. Open Android Studio
3. Click Run button or use `npm run android`
4. Refer to `ANDROID_QUICK_REFERENCE.md` for common tasks

### For Building Release
1. Follow signing key setup in `ANDROID_STUDIO_SETUP.md`
2. Build APK: `./gradlew assembleRelease`
3. Or build AAB: `./gradlew bundleRelease`

## Benefits of This Setup

### 1. Full Native Development
- Direct access to native Android code (MainActivity.kt, MainApplication.kt)
- Can add native modules and customize Android-specific behavior
- Full debugging capabilities with Android Studio

### 2. Professional Workflow
- Use Android Studio's powerful tools (Logcat, Layout Inspector, Profiler)
- Breakpoint debugging in Kotlin/Java code
- Easy APK/AAB generation for distribution

### 3. Better Performance Testing
- Test on real devices easily
- Profile app performance with Android Profiler
- Monitor memory, CPU, and network usage

### 4. Production Ready
- Ready for Play Store submission
- Signing configuration included
- ProGuard rules for code obfuscation

## Network Configuration Notes

### Android Emulator
- Use `http://10.0.2.2:3000` to access localhost on host machine
- `10.0.2.2` is a special alias for 127.0.0.1 on the host

### Physical Device
- Device must be on the same network as development machine
- Use host machine's IP address (e.g., `http://192.168.1.100:3000`)
- Enable USB debugging in developer options

### Production
- Update `EXPO_PUBLIC_API_URL` in `eas.json` or environment variables
- Use HTTPS for security
- Configure proper CORS on backend

## Maintenance

### When to Regenerate Android Project
Run `npx expo prebuild --platform android --clean` when:
- Adding new native modules/dependencies
- Updating Expo SDK version
- Changing package name or app configuration
- After major changes to `app.json`

### Keeping Dependencies Updated
```bash
cd mobile
npm update
npx expo install --fix
npx expo prebuild --platform android --clean
```

## Testing the Setup

To verify everything works:

1. **Check Gradle Build**:
   ```bash
   cd mobile/android
   ./gradlew clean build
   ```

2. **Test Debug APK**:
   ```bash
   ./gradlew assembleDebug
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Run with Metro**:
   ```bash
   cd mobile
   npm start
   npm run android
   ```

## Troubleshooting Resources

If issues occur, check in this order:
1. `ANDROID_STUDIO_SETUP.md` - Troubleshooting section
2. `ANDROID_QUICK_REFERENCE.md` - Common commands
3. Android Studio Logcat - Error messages
4. Metro bundler terminal - JavaScript errors

## Next Steps

Now that Android Studio is set up, you can:

1. **Development**: Start building and testing features
2. **Debugging**: Use Android Studio's debugging tools
3. **Profiling**: Analyze app performance
4. **Building**: Create release builds for distribution
5. **Publishing**: Submit to Google Play Store

## Files Changed/Added

### Added Files
- `mobile/ANDROID_STUDIO_SETUP.md` - Complete setup guide
- `mobile/ANDROID_QUICK_REFERENCE.md` - Quick reference
- `mobile/android/` - Entire Android project (53 files)
- `mobile/android/local.properties.example` - SDK config template

### Modified Files
- `mobile/.gitignore` - Allow android folder to be committed
- `mobile/README.md` - Added Android Studio section
- `mobile/src/utils/config.ts` - Added emulator networking comments
- `mobile/app.json` - Updated by expo prebuild
- `mobile/package.json` - Updated by expo prebuild
- `README.md` - Added Android Studio quick start option

## Support

For help:
- **Setup Issues**: See `ANDROID_STUDIO_SETUP.md` troubleshooting section
- **Development Tasks**: See `ANDROID_QUICK_REFERENCE.md`
- **Project Structure**: See `mobile/README.md`
- **API Integration**: See `API_CONTRACT.md` in project root

---

**The mobile app is now fully set up for Android Studio development!** 🎉

You can start Android Studio, open the `mobile/android` folder, and begin developing immediately.
