import { Router } from 'express';
import { LeaveController } from './leave.controller.js';

const router = Router();

router.get('/types', LeaveController.getLeaveTypes);
router.get('/balance/:employeeId', LeaveController.getBalance);
router.get('/requests', LeaveController.getAllRequests);
router.get('/requests/:id', LeaveController.getRequestById);
router.post('/requests', LeaveController.createRequest);
router.patch('/requests/:id/approve', LeaveController.approveRequest);
router.patch('/requests/:id/reject', LeaveController.rejectRequest);

export default router;
