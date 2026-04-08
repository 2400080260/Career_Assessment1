import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import mysql from 'mysql2/promise'
import { OAuth2Client } from 'google-auth-library'
import { createPool, setupDatabase, createDatabase } from './db-setup.js'
import { getUserByEmail, getUserById, createUser, saveAssessment, getUserAssessments, getUserOrCreateByEmail } from './db-queries.js'

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-strong-secret'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

let pool
let googleClient

if (GOOGLE_CLIENT_ID) {
  googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)
}

app.use(cors())
app.use(express.json())

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' })
  }

  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body
  if (!token || !googleClient) {
    return res.status(400).json({ message: 'Token is required and Google Client ID not configured' })
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const { email, name } = payload

    const normalizedEmail = email.toLowerCase().trim()
    const user = await getUserOrCreateByEmail(pool, normalizedEmail, name)

    const jwtToken = jwt.sign({ id: user.id, fullName: user.fullName, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    })

    return res.json({ id: user.id, fullName: user.fullName, email: user.email, token: jwtToken })
  } catch (error) {
    console.error('Google sign-in error:', error)
    return res.status(401).json({ message: 'Failed to verify Google token' })
  }
})

  const { fullName, email, password } = req.body
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Full name, email, and password are required' })
  }

  try {
    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await getUserByEmail(pool, normalizedEmail)

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const userId = crypto.randomUUID()

    await createUser(pool, userId, fullName, normalizedEmail, passwordHash)

    const token = jwt.sign({ id: userId, fullName, email: normalizedEmail }, JWT_SECRET, {
      expiresIn: '7d'
    })

    return res.status(201).json({ id: userId, fullName, email: normalizedEmail, token })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ message: 'Failed to create account' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const normalizedEmail = email.toLowerCase().trim()
    const user = await getUserByEmail(pool, normalizedEmail)

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, fullName: user.fullName, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    })

    return res.json({ id: user.id, fullName: user.fullName, email: user.email, token })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Login failed' })
  }
})

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await getUserById(pool, req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    return res.status(500).json({ message: 'Failed to fetch user' })
  }
})

app.post('/api/assessments', authenticate, async (req, res) => {
  const { scores, topCareer, answers = [] } = req.body
  if (!scores || !topCareer) {
    return res.status(400).json({ message: 'Scores and topCareer are required' })
  }

  try {
    const assessmentId = crypto.randomUUID()
    await saveAssessment(pool, assessmentId, req.user.id, scores, topCareer, answers)

    return res.status(201).json({
      id: assessmentId,
      userId: req.user.id,
      scores,
      topCareer,
      answers,
      completedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Save assessment error:', error)
    return res.status(500).json({ message: 'Failed to save assessment' })
  }
})

app.get('/api/assessments', authenticate, async (req, res) => {
  const { limit = 10 } = req.query

  try {
    const assessments = await getUserAssessments(pool, req.user.id, Number(limit))
    return res.json(assessments)
  } catch (error) {
    console.error('Get assessments error:', error)
    return res.status(500).json({ message: 'Failed to fetch assessments' })
  }
})

app.use('/api', (req, res) => {
  return res.status(404).json({ message: 'API route not found' })
})

// Initialize database and start server
async function start() {
  try {
    // Create database if it doesn't exist
    await createDatabase()

    // Create pool for the specific database
    pool = createPool()
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'career_assessment',
      port: process.env.DB_PORT || 3306
    })

    await setupDatabase(pool)
    console.log('✅ Connected to MySQL database')

    app.listen(PORT, () => {
      console.log(`✅ Backend server running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

start()
