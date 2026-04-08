import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';

const validateFirebaseConfig = (config) => {
  const placeholders = [
    'YOUR_API_KEY',
    'YOUR_AUTH_DOMAIN',
    'YOUR_PROJECT_ID',
    'YOUR_STORAGE_BUCKET',
    'YOUR_MESSAGING_SENDER_ID',
    'YOUR_APP_ID',
    'YOUR_MEASUREMENT_ID'
  ];

  const invalid = Object.values(config).some(value =>
    typeof value === 'string' && placeholders.some(placeholder => value.includes(placeholder))
  );

  if (invalid) {
    throw new Error('Firebase configuration is not set. Please update src/firebase-config.js with values from your Firebase console.');
  }
};

validateFirebaseConfig(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Google Sign In function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};