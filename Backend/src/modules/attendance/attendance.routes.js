import { Router } from 'express';
import { AttendanceController } from './attendance.controller.js';

const router = Router();

router.get('/roster', AttendanceController.getDailyRoster);
router.post('/log', AttendanceController.logAttendance);

export default router;
