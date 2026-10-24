import mysql from 'mysql2/promise';
import { ENV } from './env.config.js';

// Connection pool configuration
const poolConfig = ENV.DATABASE_URL
  ? {
      uri: ENV.DATABASE_URL,
      waitForConnections: ENV.DB.WAIT_FOR_CONNECTIONS,
      connectionLimit: ENV.DB.CONNECTION_LIMIT,
      queueLimit: ENV.DB.QUEUE_LIMIT,
      ssl: { rejectUnauthorized: false },
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    }
  : {
      host: ENV.DB.HOST,
      user: ENV.DB.USER,
      password: ENV.DB.PASSWORD,
      database: ENV.DB.NAME,
      port: ENV.DB.PORT,
      waitForConnections: ENV.DB.WAIT_FOR_CONNECTIONS,
      connectionLimit: ENV.DB.CONNECTION_LIMIT,
      queueLimit: ENV.DB.QUEUE_LIMIT,
      ...(ENV.DB.SSL ? { ssl: { rejectUnauthorized: false } } : {}),
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    };

// Create MySQL connection pool
export const pool = mysql.createPool(poolConfig);

// Helper function to test connection
export const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL database: ${ENV.DB.NAME}`);
    connection.release();
    return true;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MySQL: ${error.message}`);
    return false;
  }
};

export default pool;
