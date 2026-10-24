import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || null,
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'nexushr_db',
    PORT: Number(process.env.DB_PORT) || 3306,
    SSL: process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1'),
    CONNECTION_LIMIT: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    WAIT_FOR_CONNECTIONS: process.env.DB_WAIT_FOR_CONNECTIONS !== 'false',
    QUEUE_LIMIT: Number(process.env.DB_QUEUE_LIMIT) || 0
  },
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};
