import { useState } from 'react'
import '../styles/Login.css'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const resetFields = () => {
    setUsername('')
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Please enter username and password')
      return
    }
    setError('')
    onLogin({ username })
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill all required fields')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    // For demo purposes we sign the user in immediately
    onLogin({ username: fullName })
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="brand-wrap-left">
            <div className="brand-title">Career Assessment</div>
          </div>

          <div className="login-header">
            <button
              className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); resetFields() }}
              type="button"
            >
              Login
            </button>
            <button
              className={`mode-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); resetFields() }}
              type="button"
            >
              Sign up
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          {mode === 'login' && (
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="input-row">
                <span className="icon">📧</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email or phone number"
                />
              </div>

              <div className="input-row">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>

              <div className="login-actions">
                <a className="forgot-link" href="#">Forgot your password?</a>
                <button type="submit" className="login-button">Login</button>
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
                />
              </div>

              <div className="input-row">
                <span className="icon">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>

              <div className="input-row">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>

              <div className="input-row">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>

              <button type="submit" className="login-button primary">Create account</button>
              <div className="small-row center-note">By signing up you agree to our terms.</div>
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
          <span className="ticker-text">Career Assignment Path — Career Assignment Path — Career Assignment Path</span>
        </div>
      </div>
    </div>
  )
}
