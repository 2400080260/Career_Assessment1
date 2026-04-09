import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, set, update, get, push, query, orderByChild, equalTo } from 'firebase/database';
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
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Database functions for user data
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    const timestamp = new Date().toISOString();

    if (!snapshot.exists()) {
      await set(userRef, {
        ...userData,
        createdAt: timestamp,
        lastLogin: timestamp
      });
    } else {
      await update(userRef, {
        ...userData,
        lastLogin: timestamp
      });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const userSnap = await get(userRef);
    return userSnap.exists() ? userSnap.val() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const saveAssessmentResult = async (userId, assessmentData) => {
  try {
    const assessmentRef = ref(db, 'assessments');
    const newAssessmentRef = push(assessmentRef);
    const newAssessment = {
      userId,
      scores: assessmentData.scores,
      topCareer: assessmentData.topCareer,
      completedAt: new Date().toISOString(),
      answers: assessmentData.answers || []
    };
    await set(newAssessmentRef, newAssessment);
    return newAssessmentRef.key;
  } catch (error) {
    console.error('Error saving assessment result:', error);
    throw error;
  }
};

export const getUserAssessments = async (userId, limitCount = 10) => {
  try {
    const assessmentsRef = ref(db, 'assessments');
    const assessmentsQuery = query(assessmentsRef, orderByChild('userId'), equalTo(userId));
    const querySnapshot = await get(assessmentsQuery);
    const assessments = [];
    querySnapshot.forEach((child) => {
      assessments.push({
        id: child.key,
        ...child.val()
      });
    });

    return assessments
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error getting user assessments:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, {
      ...updates,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
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