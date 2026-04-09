import { useState } from 'react'
import '../styles/Login.css'
import { loginUser, signupUser, signInWithGoogle } from '../api'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      const user = await signInWithGoogle()
      onLogin({
        username: user.fullName || user.email,
        email: user.email,
        uid: user.uid
      })
    } catch (err) {
      setError(`Google sign-in failed: ${err?.message || 'Please try again'}`)
      console.error('Google sign-in error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetFields = () => {
    setEmail('')
    setFullName('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter email and password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const user = await loginUser(email, password)
      onLogin({
        username: user.fullName || user.email,
        email: user.email,
        uid: user.uid
      })
    } catch (error) {
      setError(`Invalid email or password. ${error?.message || ''}`)
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
      const user = await signupUser(fullName, email, password)
      onLogin({
        username: user.fullName,
        email: user.email,
        uid: user.uid
      })
    } catch (error) {
      setError(`Failed to create account. ${error?.message || 'Please try again.'}`)
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
              className="google-signin-button"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? 'Signing in with Google...' : 'Sign in with Google'}
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
