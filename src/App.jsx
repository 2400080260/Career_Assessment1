import { useState, useEffect, useRef } from 'react'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Results from './components/Results'
import Login from './components/Login'
import { logoutUser } from './api'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import './App.css'

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [assessmentScores, setAssessmentScores] = useState(null)
  const [user, setUser] = useState(null)
  const idleTimer = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          username: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          uid: firebaseUser.uid
        })
        setCurrentPage('home')
      } else {
        setUser(null)
        setCurrentPage('login')
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const startTimer = () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current)
      }
      idleTimer.current = window.setTimeout(() => {
        if (user) {
          handleLogout(true)
        }
      }, INACTIVITY_TIMEOUT_MS)
    }

    const resetTimer = () => {
      if (user) {
        startTimer()
      }
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, resetTimer))

    if (user) {
      startTimer()
    }

    return () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current)
      }
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [user])

  const handleStartAssessment = () => {
    setCurrentPage('assessment')
  }

  const handleLogin = (userInfo) => {
    setUser(userInfo)
    setCurrentPage('home')
  }

  const handleLogout = async (isIdle = false) => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout failed:', error)
    }
    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }
    setUser(null)
    setAssessmentScores(null)
    setCurrentPage('login')
    if (isIdle) {
      window.alert('You have been logged out due to 5 minutes of inactivity.')
    }
  }

  const handleCompleteAssessment = (scores) => {
    setAssessmentScores(scores)
    setCurrentPage('results')
  }

  const handleRestart = () => {
    setAssessmentScores(null)
    setCurrentPage('home')
  }

  return (
    <div className="app">
      {currentPage !== 'login' && (
        <header className="app-header">
          <div className="header-inner">
            <div>Welcome{user ? `, ${user.username}` : ''}</div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </header>
      )}

      {currentPage === 'login' && <Login onLogin={handleLogin} />}
      {currentPage === 'home' && <Home onStart={handleStartAssessment} />}
      {currentPage === 'assessment' && <Assessment onComplete={handleCompleteAssessment} />}
      {currentPage === 'results' && <Results scores={assessmentScores} onRestart={handleRestart} user={user} />}
    </div>
  )
}

export default App
