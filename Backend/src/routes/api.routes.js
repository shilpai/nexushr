import { Router } from 'express';
import employeeRoutes from '../modules/employee/employee.routes.js';
import departmentRoutes from '../modules/department/department.routes.js';
import leaveRoutes from '../modules/leave/leave.routes.js';
import attendanceRoutes from '../modules/attendance/attendance.routes.js';
import payrollRoutes from '../modules/payroll/payroll.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NexusHR Enterprise Modular Monolith API',
    version: '1.0.0'
  });
});

// Mount module routes
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/leaves', leaveRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/payroll', payrollRoutes);

export default router;
