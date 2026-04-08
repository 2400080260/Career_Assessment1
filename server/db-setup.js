import mysql from 'mysql2/promise'

export const createPool = () => {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  }
  return mysql.createPool(config)
}

export const createDatabase = async () => {
  const administrationPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  })

  const connection = await administrationPool.getConnection()
  try {
    const dbName = process.env.DB_DATABASE || 'career_assessment'
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
    console.log(`✅ Database '${dbName}' created or already exists`)
  } catch (error) {
    console.error('Error creating database:', error.message)
    throw error
  } finally {
    await connection.release()
    await administrationPool.end()
  }
}

export const setupDatabase = async (pool) => {
  const connection = await pool.getConnection()
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX (email)
      )
    `)

    // Create assessments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS assessments (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        scores JSON NOT NULL,
        topCareer VARCHAR(255) NOT NULL,
        answers JSON,
        completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        INDEX (userId),
        INDEX (completedAt)
      )
    `)

    console.log('✅ Database tables created successfully')
  } catch (error) {
    console.error('Error setting up database:', error.message)
    throw error
  } finally {
    await connection.release()
  }
}
