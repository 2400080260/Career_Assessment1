import mysql from 'mysql2/promise'

const host = process.env.DB_HOST || 'localhost'
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || ''
const database = process.env.DB_NAME || 'career_assessment'
const port = Number(process.env.DB_PORT || 3306)

const createDatabaseIfNeeded = async () => {
  const pool = mysql.createPool({
    host,
    user,
    password,
    port,
    waitForConnections: true,
    connectionLimit: 1
  })

  await pool.query(
    `CREATE DATABASE IF NOT EXISTS \\`${database}\\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  )
  await pool.end()
}

await createDatabaseIfNeeded()

export const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
