import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRoutes from './routes/api.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware.js';
import { ENV } from './config/env.config.js';

const app = express();

// Cross-Origin Resource Sharing
app.use(cors({
  origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// HTTP Request Logger
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to NexusHR Modular Monolith HRMS API',
    documentation: '/api/v1/health',
    modules: {
      employees: '/api/v1/employees',
      departments: '/api/v1/departments',
      leaves: '/api/v1/leaves',
      attendance: '/api/v1/attendance',
      payroll: '/api/v1/payroll'
    }
  });
});

// Mount Master API Router
app.use('/api/v1', apiRoutes);

// 404 Route Handler
app.use(notFoundHandler);

// Central Error Handler
app.use(errorHandler);

export default app;
