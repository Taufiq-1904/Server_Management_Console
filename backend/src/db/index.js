<<<<<<< HEAD
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(255),
        username VARCHAR(255),
        endpoint VARCHAR(255),
        method VARCHAR(10),
        role VARCHAR(50),
        status INTEGER,
        ip_address VARCHAR(50),
        user_agent TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
    `);
    
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
    throw err;
  } finally {
    client.release();
  }
};

const logActivity = async (data) => {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO activity_logs 
       (user_id, username, endpoint, method, role, status, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        data.userId,
        data.username,
        data.endpoint,
        data.method,
        data.role,
        data.status,
        data.ipAddress,
        data.userAgent
      ]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  } finally {
    client.release();
  }
};

const getActivityLogs = async (limit = 100, offset = 0) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM activity_logs 
       ORDER BY timestamp DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initDatabase,
  logActivity,
  getActivityLogs
=======
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(255),
        username VARCHAR(255),
        endpoint VARCHAR(255),
        method VARCHAR(10),
        role VARCHAR(50),
        status INTEGER,
        ip_address VARCHAR(50),
        user_agent TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
    `);
    
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
    throw err;
  } finally {
    client.release();
  }
};

const logActivity = async (data) => {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO activity_logs 
       (user_id, username, endpoint, method, role, status, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        data.userId,
        data.username,
        data.endpoint,
        data.method,
        data.role,
        data.status,
        data.ipAddress,
        data.userAgent
      ]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  } finally {
    client.release();
  }
};

const getActivityLogs = async (limit = 100, offset = 0) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM activity_logs 
       ORDER BY timestamp DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initDatabase,
  logActivity,
  getActivityLogs
>>>>>>> 0297ea5f8ee57a0f9309fdbe4ac3d6f35bbafdbb
};