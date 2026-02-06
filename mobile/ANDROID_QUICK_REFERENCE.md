# Android Studio Quick Reference

Quick reference for common Android Studio tasks when developing the Split It mobile app.

## Opening the Project

```bash
# From project root
cd mobile/android

# Then open this folder in Android Studio
```

Or from Android Studio: **File → Open → Select `mobile/android` folder**

## Running the App

### Prerequisites
1. Start Metro bundler first:
   ```bash
   cd mobile
   npm start
   ```

2. Then run from Android Studio:
   - Click the green **Run** button (▶️)
   - Or press `Shift + F10` (Windows/Linux) or `Ctrl + R` (macOS)

### Select Device
- **Physical Device**: Enable USB debugging and connect via USB
- **Emulator**: Tools → Device Manager → Create/Start device

## Common Tasks

### Clean Build
```bash
cd mobile/android
./gradlew clean
```

### Build Debug APK
```bash
cd mobile/android
./gradlew assembleDebug
```
APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build Release APK
```bash
cd mobile/android
./gradlew assembleRelease
```

### Install on Device
```bash
cd mobile/android
./gradlew installDebug
```

### View Logs
In Android Studio: **View → Tool Windows → Logcat**

Or via command line:
```bash
adb logcat
```

## Gradle Commands

```bash
cd mobile/android

# List all tasks
./gradlew tasks

# Build the app
./gradlew build

# Run tests
./gradlew test

# Check dependencies
./gradlew dependencies
```

## Metro Bundler Commands

```bash
cd mobile

# Start Metro
npm start

# Clear cache and start
npm start -- --reset-cache

# Start with specific port
npm start -- --port 8082
```

## Troubleshooting Commands

### Clear All Caches
```bash
cd mobile

# Clear Metro cache
npm start -- --reset-cache

# Clear Gradle cache
cd android
./gradlew clean

# Clear build folder
rm -rf android/app/build
```

### Reinstall Dependencies
```bash
cd mobile
rm -rf node_modules
npm install
```

### Regenerate Android Project
```bash
cd mobile
npx expo prebuild --platform android --clean
```

## Debugging

### Enable Debug Mode
1. In emulator/device, shake the device or press `Cmd/Ctrl + M`
2. Select **Debug**
3. Chrome DevTools will open

### React Native Debugger
1. Install: `brew install --cask react-native-debugger` (macOS)
2. Run: Open React Native Debugger app
3. In device: Shake → Debug

### Logcat Filters
In Android Studio Logcat, use these filters:

- **React Native**: `tag:ReactNative`
- **JavaScript**: `tag:ReactNativeJS`
- **Errors only**: `level:error`
- **App specific**: `package:com.anonymous.mobile`

## ADB Commands

```bash
# List connected devices
adb devices

# Install APK
adb install path/to/app.apk

# Uninstall app
adb uninstall com.anonymous.mobile

# View logs
adb logcat

# Clear app data
adb shell pm clear com.anonymous.mobile

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

## Key Shortcuts (Android Studio)

### Running & Debugging
- `Shift + F10` (Win/Linux) / `Ctrl + R` (Mac) - Run
- `Shift + F9` (Win/Linux) / `Ctrl + D` (Mac) - Debug
- `Ctrl + F2` - Stop

### Code Navigation
- `Ctrl/Cmd + Click` - Go to definition
- `Ctrl/Cmd + B` - Go to declaration
- `Alt + F7` - Find usages
- `Ctrl/Cmd + F12` - File structure

### Code Editing
- `Ctrl/Cmd + Space` - Code completion
- `Alt + Enter` - Quick fix
- `Ctrl/Cmd + Alt + L` - Reformat code

### Build & Sync
- `Ctrl/Cmd + F9` - Make project
- **Sync Project with Gradle Files** button in toolbar

## Configuration Files

### Key Files to Know
- `android/build.gradle` - Project-level build configuration
- `android/app/build.gradle` - App-level build configuration (dependencies, versions)
- `android/gradle.properties` - Gradle properties
- `android/settings.gradle` - Project modules
- `android/app/src/main/AndroidManifest.xml` - App manifest (permissions, activities)
- `android/local.properties` - SDK location (not committed to git)

### Important Gradle Properties

In `android/app/build.gradle`:
```gradle
android {
    compileSdk = 34              // Android SDK version to compile against
    
    defaultConfig {
        applicationId "com.anonymous.mobile"  // Unique package name
        minSdk = 24               // Minimum Android version supported
        targetSdk = 34            // Target Android version
        versionCode = 1           // Internal version number
        versionName "1.0.0"       // User-visible version
    }
}
```

## Package Name

Default: `com.anonymous.mobile`

To change:
1. Update in `android/app/build.gradle` (`applicationId`)
2. Update in `app.json` (`expo.android.package`)
3. Run `npx expo prebuild --platform android --clean`

## API Configuration

The app connects to the backend API. Configure in:

**File**: `mobile/src/utils/config.ts`

```typescript
export const config = {
  apiBaseUrl: 'http://10.0.2.2:3000/api/v1',  // Android Emulator
  // apiBaseUrl: 'http://YOUR_IP:3000/api/v1',  // Physical device
} as const;
```

**Important**: Android emulator uses `10.0.2.2` to access host machine's `localhost`

## Environment Setup

### Check Java Version
```bash
java -version
# Should be Java 17 or 21
```

### Check Android SDK
```bash
# Set ANDROID_HOME first
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# or
export ANDROID_HOME=$HOME/Android/Sdk          # Linux

# Check SDK tools
$ANDROID_HOME/tools/bin/sdkmanager --list
```

### Verify Setup
```bash
# Check Node
node --version

# Check npm
npm --version

# Check if android SDK is accessible
adb --version

# Check gradle
cd mobile/android
./gradlew --version
```

## Common Issues

### Metro bundler not connecting
- Ensure Metro is running (`npm start`)
- Check the port (default 8081)
- Restart Metro with cache clear: `npm start -- --reset-cache`

### Gradle sync fails
- Click **File → Invalidate Caches → Invalidate and Restart**
- Run `./gradlew clean`
- Delete `android/.gradle` folder

### App not installing
- Check device connection: `adb devices`
- Uninstall old version: `adb uninstall com.anonymous.mobile`
- Clean and rebuild: `./gradlew clean assembleDebug`

### Build errors
- Check Logcat for detailed error messages
- Verify all dependencies are installed
- Try regenerating project: `npx expo prebuild --platform android --clean`

## Build Variants

Android Studio shows different build variants:

- **debug** - Development build with debugging enabled
- **release** - Production build, optimized and signed

To switch: **Build → Select Build Variant**

## Resources

- Project README: `mobile/README.md`
- Detailed setup: `mobile/ANDROID_STUDIO_SETUP.md`
- React Native docs: https://reactnative.dev/
- Expo docs: https://docs.expo.dev/
- Android docs: https://developer.android.com/

---

**Quick Command Reference**:
```bash
# Start development
cd mobile && npm start                    # Terminal 1
npm run android                           # Terminal 2

# Clean everything
cd mobile/android && ./gradlew clean
cd .. && npm start -- --reset-cache

# Build APK
cd mobile/android && ./gradlew assembleDebug
```
