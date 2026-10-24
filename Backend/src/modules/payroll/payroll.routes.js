import { Router } from 'express';
import { PayrollController } from './payroll.controller.js';

const router = Router();

router.get('/summary', PayrollController.getSummary);
router.get('/ledger', PayrollController.getLedger);

export default router;
