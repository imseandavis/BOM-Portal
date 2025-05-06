import { initializeAuth, getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { app } from './firebase/config'

// Initialize Firebase Auth
const auth = initializeAuth(app)

// Google provider
const googleProvider = new GoogleAuthProvider()

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export { auth } 