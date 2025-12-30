// MySQL Database configuration for SkillForge
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skillforge',
  port: process.env.DB_PORT || 3306
};

let connection = null;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    
    console.log(`✅ MySQL Connected: ${dbConfig.host}:${dbConfig.port}`);
    
    // Test the connection
    await connection.execute('SELECT 1');
    console.log('🔗 Database connection verified');
    
    return connection;
  } catch (error) {
    console.error('❌ Error connecting to MySQL:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Please check your database credentials in .env file');
    }
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database does not exist. Please run: node setup-database.js');
    }
    process.exit(1);
  }
};

// Get current connection
const getConnection = () => {
  if (!connection) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return connection;
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (connection) {
    await connection.end();
    console.log('🔗 MySQL connection closed through app termination');
  }
  process.exit(0);
});

module.exports = { connectDB, getConnection };