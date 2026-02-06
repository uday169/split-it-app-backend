# Android Studio Setup Guide

This guide will help you set up and run the Split It mobile app in Android Studio.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Android Studio** (Latest version recommended)
   - Download from: https://developer.android.com/studio
   - Version: Arctic Fox or newer

3. **JDK** (Java Development Kit 17 or 21)
   - Android Studio usually includes JDK
   - Or download from: https://adoptium.net/

4. **Android SDK**
   - Install via Android Studio SDK Manager
   - Required SDK version: API Level 34 (Android 14)
   - Also install: API Level 33 (Android 13)

## Initial Setup

### 1. Install Dependencies

First, navigate to the mobile directory and install npm packages:

```bash
cd mobile
npm install
```

### 2. Verify Android Project Structure

The `android` folder should already exist with the following structure:
```
android/
├── app/
├── gradle/
├── build.gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

If the `android` folder doesn't exist, generate it by running:
```bash
npx expo prebuild --platform android --clean
```

### 3. Configure Android SDK

1. Open Android Studio
2. Go to **Settings/Preferences** → **Appearance & Behavior** → **System Settings** → **Android SDK**
3. Ensure the following are installed:
   - Android SDK Platform 34
   - Android SDK Platform 33
   - Android SDK Build-Tools 34.0.0
   - Android Emulator
   - Android SDK Platform-Tools

### 4. Set Environment Variables

Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# OR
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
# OR
export ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk # Windows

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Apply the changes:
```bash
source ~/.bashrc  # or ~/.zshrc
```

## Opening Project in Android Studio

### Option 1: Open Existing Project

1. Launch Android Studio
2. Click **Open** (or **File** → **Open**)
3. Navigate to: `mobile/android` directory
4. Click **OK**
5. Wait for Gradle sync to complete (this may take several minutes)

### Option 2: Import Project

1. Launch Android Studio
2. Click **Import Project (Gradle, Eclipse ADT, etc.)**
3. Select the `mobile/android` directory
4. Follow the import wizard

## Running the App

### Method 1: Using Android Studio

1. **Connect a Device or Start an Emulator**
   - For physical device: Enable Developer Options and USB Debugging
   - For emulator: Go to **Tools** → **Device Manager** → Create/Start a device

2. **Start Metro Bundler** (in terminal):
   ```bash
   cd mobile
   npm start
   ```

3. **Run in Android Studio**:
   - Click the **Run** button (green play icon) in the toolbar
   - Or press `Shift + F10` (Windows/Linux) or `Ctrl + R` (macOS)
   - Select your target device/emulator

### Method 2: Using Command Line

1. Start the Metro bundler:
   ```bash
   cd mobile
   npm start
   ```

2. In a new terminal, run:
   ```bash
   cd mobile
   npm run android
   ```

### Method 3: Build APK

To build a debug APK:

```bash
cd mobile/android
./gradlew assembleDebug
```

The APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Configuration

### Update API Base URL

The app connects to a backend API. Update the API URL in:

**File:** `mobile/src/utils/config.ts`

```typescript
export const config = {
  apiBaseUrl: 'http://10.0.2.2:3000/api/v1',  // For Android Emulator
  // apiBaseUrl: 'http://localhost:3000/api/v1',  // For physical device on same network
  // apiBaseUrl: 'https://your-api-url.com/api/v1',  // For production
} as const;
```

**Important Android Emulator URLs:**
- `http://10.0.2.2:3000` - Points to `localhost:3000` on your development machine
- `http://localhost:3000` - Points to the emulator itself (won't work for external API)

### Package Name

The default package name is `com.anonymous.mobile`. To change it:

1. Update in `android/app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           applicationId "com.yourdomain.splitit"
           // ...
       }
   }
   ```

2. Update in `app.json`:
   ```json
   {
     "expo": {
       "android": {
         "package": "com.yourdomain.splitit"
       }
     }
   }
   ```

3. Regenerate the project:
   ```bash
   npx expo prebuild --platform android --clean
   ```

## Troubleshooting

### Issue: Gradle Sync Failed

**Solution:**
1. Click **File** → **Invalidate Caches** → **Invalidate and Restart**
2. Delete `.gradle` folder in the project root
3. Run: `./gradlew clean`
4. Sync again

### Issue: "SDK location not found"

**Solution:**
Create `local.properties` file in `android/` directory:

```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk  # macOS
# OR
sdk.dir=/home/YOUR_USERNAME/Android/Sdk           # Linux
# OR
sdk.dir=C\:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk  # Windows
```

### Issue: "Unable to load script"

**Solution:**
1. Ensure Metro bundler is running (`npm start`)
2. Clear Metro cache: `npm start -- --reset-cache`
3. Rebuild the app in Android Studio

### Issue: Network Request Failed

**Solution:**
- For emulator: Use `http://10.0.2.2:3000` instead of `localhost:3000`
- For physical device: Use your computer's IP address (e.g., `http://192.168.1.100:3000`)
- Ensure backend is running and accessible

### Issue: Build fails with "Execution failed for task ':app:mergeDebugResources'"

**Solution:**
1. Clean the project: `./gradlew clean`
2. Delete `android/app/build` folder
3. Rebuild

### Issue: App crashes on startup

**Solution:**
1. Check Logcat in Android Studio for error messages
2. Ensure all dependencies are installed: `npm install`
3. Clear app data and reinstall
4. Check that Metro bundler is running

## Development Workflow

### Best Practices

1. **Keep Metro Running**: Always start Metro bundler before running the app
   ```bash
   npm start
   ```

2. **Hot Reload**: Press `r` in Metro terminal to reload, or shake device and select "Reload"

3. **Enable Fast Refresh**: In Metro terminal, press `r` → `Enable Fast Refresh`

4. **Debug Menu**: 
   - Emulator: Press `Cmd/Ctrl + M`
   - Physical device: Shake the device

5. **View Logs**:
   - Android Studio: View → Tool Windows → Logcat
   - Terminal: `adb logcat`

### Clean Build

If you encounter persistent issues, perform a clean build:

```bash
cd mobile

# Clear Metro cache
npm start -- --reset-cache

# Clean Gradle
cd android
./gradlew clean

# Rebuild
./gradlew assembleDebug
```

## Native Modules

This project uses Expo modules. If you add new native modules:

1. Install the package:
   ```bash
   npm install package-name
   ```

2. Rebuild the native project:
   ```bash
   npx expo prebuild --platform android --clean
   ```

3. Sync Gradle in Android Studio

## Building for Production

### Create Release APK

1. Generate a signing key:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Place `my-release-key.keystore` in `android/app/`

3. Create `android/gradle.properties` (if not exists) and add:
   ```properties
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=your_store_password
   MYAPP_RELEASE_KEY_PASSWORD=your_key_password
   ```

4. Build release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

5. APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Build AAB for Google Play

```bash
cd android
./gradlew bundleRelease
```

AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Android Developer Guide](https://developer.android.com/guide)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

## Project-Specific Notes

### Key Technologies

- **Framework**: React Native 0.81.5 with Expo SDK 54
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query)
- **Navigation**: React Navigation v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Secure Storage**: Expo Secure Store (for JWT tokens)

### Project Structure

See the main [README.md](./README.md) for detailed project structure and architecture.

### Backend Integration

Ensure the backend API is running before testing the app:

```bash
cd ../backend
npm install
npm run dev
```

Backend should be accessible at `http://localhost:3000`

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review the [main README](./README.md)
3. Check Metro bundler logs
4. Check Android Studio Logcat
5. Search for similar issues on Stack Overflow or GitHub

## Summary

You're all set! To recap:

1. Install dependencies: `npm install`
2. Verify `android` folder exists
3. Open `mobile/android` in Android Studio
4. Start Metro: `npm start`
5. Run app from Android Studio or `npm run android`

Happy coding! 🚀
