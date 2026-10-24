import { Router } from 'express';
import { EmployeeController } from './employee.controller.js';

const router = Router();

// Stats & utilities (placed before :id route)
router.get('/stats', EmployeeController.getStats);
router.get('/next-code', EmployeeController.getNextCode);
router.post('/bulk-delete', EmployeeController.bulkDelete);

// CRUD routes
router.get('/', EmployeeController.getAll);
router.get('/:id', EmployeeController.getById);
router.post('/', EmployeeController.create);
router.put('/:id', EmployeeController.update);
router.delete('/:id', EmployeeController.delete);

export default router;
