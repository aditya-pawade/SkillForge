// MySQL Database configuration
const mysql = require('mysql2/promise');

let connection = null;

const connectDB = async () => {
  try {
    if (connection) {
      return connection;
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'skillforge',
      port: parseInt(process.env.DB_PORT) || 3306
    });

    console.log('✅ MySQL Connected to database:', process.env.DB_NAME || 'skillforge');
    return connection;
  } catch (error) {
    console.error('❌ Error connecting to MySQL:', error.message);
    process.exit(1);
  }
};

const getDB = async () => {
  if (!connection) {
    connection = await connectDB();
  }
  return connection;
};

module.exports = { connectDB, getDB };