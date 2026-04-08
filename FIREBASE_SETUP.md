# Firebase Authentication Setup Guide

## 🚀 Setting up Google Authentication

To enable Google authentication, you need to set up a Firebase project and configure it in your application.

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "Career Assessment")
4. Enable Google Analytics if desired
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Enable "Google" as a sign-in provider
4. Add your project name and support email
5. Click "Save"

### Step 3: Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### Step 4: Update Firebase Config

Replace the placeholder values in `src/firebase-config.js` with your actual Firebase configuration:

```javascript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### Step 5: Enable Google Sign-in in Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID
5. Add your domain to authorized domains (e.g., `localhost` for development)

### Step 6: Test the Authentication

1. Run `npm run dev`
2. Try signing up with Google
3. The authentication should work seamlessly

## 🔧 Troubleshooting

- **Error: "auth/invalid-api-key"**: Check your Firebase config
- **Error: "auth/operation-not-allowed"**: Make sure Google sign-in is enabled
- **CORS issues**: Add your domain to authorized domains in Google Cloud Console

## 📝 Features Added

- ✅ Google OAuth integration
- ✅ Email/password authentication
- ✅ Professional UI design
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Form validation

The login page now supports both Google authentication and traditional email/password sign-up/sign-in with a much more professional appearance!