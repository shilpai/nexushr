import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from '../config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  let connection;
  try {
    console.log(`[Database Init] Connecting to MySQL server at ${ENV.DB.HOST}:${ENV.DB.PORT}...`);
    
    // Connect with URI or standard parameters
    const connectionConfig = ENV.DATABASE_URL
      ? {
          uri: ENV.DATABASE_URL,
          multipleStatements: true,
          ssl: { rejectUnauthorized: false }
        }
      : {
          host: ENV.DB.HOST,
          user: ENV.DB.USER,
          password: ENV.DB.PASSWORD,
          port: ENV.DB.PORT,
          multipleStatements: true,
          ...(ENV.DB.SSL ? { ssl: { rejectUnauthorized: false } } : {})
        };

    connection = await mysql.createConnection(connectionConfig);

    console.log(`[Database Init] Connected to MySQL. Ensuring database '${ENV.DB.NAME}' exists...`);
    if (!ENV.DATABASE_URL) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${ENV.DB.NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await connection.query(`USE \`${ENV.DB.NAME}\`;`);
    }

    // Read schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log(`[Database Init] Running table creation migrations from schema.sql...`);
    await connection.query(schemaSql);

    // Ensure default leave types exist
    const defaultLeaveTypes = [
      ['Annual Vacation', 'PTO', 20, true, 'Paid time off for annual vacation'],
      ['Sick Leave', 'SICK', 10, true, 'Medical & health recovery leave'],
      ['Casual Leave', 'CASUAL', 7, true, 'Short term personal leave'],
      ['Maternity/Paternity', 'PARENTAL', 90, true, 'Parental childcare leave'],
      ['Unpaid Leave', 'UNPAID', 30, false, 'Leave without pay']
    ];

    for (const [name, code, maxDays, isPaid, desc] of defaultLeaveTypes) {
      await connection.query(
        `INSERT IGNORE INTO leave_types (name, code, max_days, is_paid, description) VALUES (?, ?, ?, ?, ?)`,
        [name, code, maxDays, isPaid, desc]
      );
    }

    console.log(`[Database Init] ✅ Database and tables initialized successfully!`);
    return true;
  } catch (error) {
    console.error(`[Database Init Error] ❌ ${error.message}`);
    console.error(`Note: Please ensure MySQL service is running and credentials in .env are correct.`);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// If run directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
