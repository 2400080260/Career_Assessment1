export const getUserByEmail = async (pool, email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])
  return rows[0] || null
}

export const getUserOrCreateByEmail = async (pool, email, fullName, passwordHash = null) => {
  let user = await getUserByEmail(pool, email)
  if (!user) {
    const id = require('crypto').randomUUID()
    await pool.execute(
      'INSERT INTO users (id, fullName, email, passwordHash) VALUES (?, ?, ?, ?)',
      [id, fullName, email, passwordHash || '']
    )
    user = { id, fullName, email }
  }
  return user
}

export const getUserById = async (pool, id) => {
  const [rows] = await pool.execute('SELECT id, fullName, email, createdAt FROM users WHERE id = ?', [id])
  return rows[0] || null
}

export const createUser = async (pool, id, fullName, email, passwordHash) => {
  await pool.execute(
    'INSERT INTO users (id, fullName, email, passwordHash) VALUES (?, ?, ?, ?)',
    [id, fullName, email, passwordHash]
  )
}

export const saveAssessment = async (pool, id, userId, scores, topCareer, answers) => {
  await pool.execute(
    'INSERT INTO assessments (id, userId, scores, topCareer, answers) VALUES (?, ?, ?, ?, ?)',
    [id, userId, JSON.stringify(scores), topCareer, JSON.stringify(answers || [])]
  )
}

export const getUserAssessments = async (pool, userId, limit) => {
  const [rows] = await pool.execute(
    `SELECT id, userId, JSON_UNQUOTE(scores) as scores, topCareer, answers, completedAt 
     FROM assessments WHERE userId = ? 
     ORDER BY completedAt DESC LIMIT ?`,
    [userId, limit]
  )
  return rows.map(row => ({
    ...row,
    scores: JSON.parse(row.scores),
    answers: row.answers ? JSON.parse(row.answers) : []
  }))
}
