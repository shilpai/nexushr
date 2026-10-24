import app from './app.js';
import { ENV } from './config/env.config.js';
import { testDatabaseConnection } from './config/db.config.js';
import { initializeDatabase } from './database/initDb.js';

const startServer = async () => {
  const server = app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 NexusHR Modular Monolith API Server Running`);
    console.log(`📡 URL: http://localhost:${ENV.PORT}`);
    console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 API Base: http://localhost:${ENV.PORT}/api/v1`);
    console.log(`=======================================================`);
  });

  // Check database connection and auto-initialize tables
  try {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
      console.log(`[Database] Auto-verifying tables and schema...`);
      await initializeDatabase();
    } else {
      console.warn(`[Database Warning] MySQL connection failed. Check your DB credentials in .env`);
      console.warn(`Tip: If your MySQL server is running, you can also run: npm run db:init`);
    }
  } catch (dbErr) {
    console.warn(`[Database Notice] Could not auto-initialize DB: ${dbErr.message}`);
  }

  // Graceful shutdown
  const handleShutdown = (signal) => {
    console.log(`\n[Process] Received ${signal}. Gracefully closing HTTP server...`);
    server.close(() => {
      console.log(`[Process] HTTP server closed cleanly.`);
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
