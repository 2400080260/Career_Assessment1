import { useState, useEffect } from 'react'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Results from './components/Results'
import Login from './components/Login'
import { logoutUser } from './api'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [assessmentScores, setAssessmentScores] = useState(null)
  const [user, setUser] = useState(null)

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

  const handleStartAssessment = () => {
    setCurrentPage('assessment')
  }

  const handleLogin = (userInfo) => {
    setUser(userInfo)
    setCurrentPage('home')
  }

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    setAssessmentScores(null)
    setCurrentPage('login')
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
