import { useState } from 'react'
import '../styles/Login.css'
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../firebase'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetFields = () => {
    setUsername('')
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      const user = await signInWithGoogle()
      onLogin({
        username: user.displayName || user.email,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      })
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.')
      console.error('Google sign-in error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Please enter email and password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const user = await signInWithEmail(username, password)
      onLogin({
        username: user.displayName || user.email,
        email: user.email,
        uid: user.uid
      })
    } catch (error) {
      setError('Invalid email or password. Please try again.')
      console.error('Email sign-in error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill all required fields')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    setLoading(true)
    setError('')
    try {
      const user = await signUpWithEmail(email, password)
      onLogin({
        username: fullName,
        email: user.email,
        uid: user.uid
      })
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else {
        setError('Failed to create account. Please try again.')
      }
      console.error('Email signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="brand-wrap-left">
            <div className="brand-title">Career Assessment</div>
            <p className="brand-subtitle">Discover your perfect career path</p>
          </div>

          <div className="login-header">
            <button
              className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); resetFields() }}
              type="button"
              disabled={loading}
            >
              Sign In
            </button>
            <button
              className={`mode-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); resetFields() }}
              type="button"
              disabled={loading}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          {/* Google Sign In Button */}
          <div className="social-auth-section">
            <button
              type="button"
              className="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="divider">
              <span>or</span>
            </div>
          </div>

          {mode === 'login' && (
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="input-row">
                <span className="icon">📧</span>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email address"
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-row">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  disabled={loading}
                />
              </div>

              <div className="login-actions">
                <a className="forgot-link" href="#">Forgot your password?</a>
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form className="login-form" onSubmit={handleSignupSubmit}>
              <div className="input-row">
                <span className="icon">👤</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-row">
                <span className="icon">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-row">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-row">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-button primary" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <div className="small-row center-note">
                By signing up, you agree to our <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
              </div>
            </form>
          )}
        </div>

        <div className="login-side" aria-hidden>
          <div className="side-graphic">
            <svg width="360" height="260" viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="0" y="0" width="360" height="260" rx="12" fill="url(#g)" />
              <g transform="translate(40,40)">
                <rect x="20" y="30" width="220" height="120" rx="8" fill="#fff" opacity="0.9" />
                <rect x="30" y="40" width="200" height="80" rx="4" fill="#E6F8F3" />
                <rect x="36" y="130" width="188" height="14" rx="6" fill="#dfeff1" />
                <rect x="46" y="50" width="24" height="10" rx="2" fill="#9fd7c9" />
                <rect x="76" y="50" width="24" height="10" rx="2" fill="#9fd7c9" />
                <rect x="116" y="50" width="24" height="10" rx="2" fill="#9fd7c9" />
                <circle cx="60" cy="70" r="8" fill="#67d3c1" opacity="0.8" />
                <circle cx="90" cy="70" r="6" fill="#0db39a" opacity="0.6" />
                <circle cx="120" cy="70" r="5" fill="#2b8f82" opacity="0.7" />
              </g>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#DFF6F1"/>
                  <stop offset="1" stop-color="#67D3C1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="ticker" aria-hidden>
        <div className="ticker-track">
          <span className="ticker-text">Career Assessment Platform — Discover Your Path — Professional Development</span>
        </div>
      </div>
    </div>
  )
}
