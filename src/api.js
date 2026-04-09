import {
  signInWithGoogle as firebaseSignInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  saveAssessmentResult as firebaseSaveAssessmentResult,
  getUserAssessments as firebaseGetUserAssessments,
  saveUserProfile
} from './firebase'

export const signInWithGoogle = async () => {
  const user = await firebaseSignInWithGoogle()
  if (!user) {
    throw new Error('Google sign-in failed')
  }

  await saveUserProfile(user.uid, {
    fullName: user.displayName || '',
    email: user.email,
    provider: 'google'
  })

  return {
    id: user.uid,
    fullName: user.displayName || user.email || '',
    email: user.email,
    uid: user.uid
  }
}

export const signupUser = async (fullName, email, password) => {
  const user = await signUpWithEmail(email, password)
  await saveUserProfile(user.uid, {
    fullName,
    email,
    provider: 'email'
  })

  return {
    id: user.uid,
    fullName,
    email,
    uid: user.uid
  }
}

export const loginUser = async (email, password) => {
  const user = await signInWithEmail(email, password)
  return {
    id: user.uid,
    fullName: user.displayName || user.email || '',
    email: user.email,
    uid: user.uid
  }
}

export const logoutUser = async () => {
  await signOutUser()
}

export const saveAssessmentResult = async (userId, assessmentData) => {
  return firebaseSaveAssessmentResult(userId, assessmentData)
}

export const getUserAssessments = async (userId, limitCount = 10) => {
  return firebaseGetUserAssessments(userId, limitCount)
}
