import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore';
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
export const db = getFirestore(app);
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
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      lastLogin: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const saveAssessmentResult = async (userId, assessmentData) => {
  try {
    const assessmentRef = collection(db, 'assessments');
    const newAssessment = {
      userId,
      scores: assessmentData.scores,
      topCareer: assessmentData.topCareer,
      completedAt: new Date(),
      answers: assessmentData.answers || []
    };
    const docRef = await addDoc(assessmentRef, newAssessment);
    return docRef.id;
  } catch (error) {
    console.error('Error saving assessment result:', error);
    throw error;
  }
};

export const getUserAssessments = async (userId, limitCount = 10) => {
  try {
    const assessmentsRef = collection(db, 'assessments');
    const q = query(
      assessmentsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user assessments:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      lastUpdated: new Date()
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