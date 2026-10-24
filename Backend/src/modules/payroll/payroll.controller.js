import { PayrollModel } from './payroll.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class PayrollController {
  static async getSummary(req, res, next) {
    try {
      const summary = await PayrollModel.getSummary();
      return ApiResponse.success(res, summary, 'Payroll summary retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getLedger(req, res, next) {
    try {
      const ledger = await PayrollModel.getLedger();
      return ApiResponse.success(res, ledger, 'Payroll ledger retrieved', 200, {
        totalRecords: ledger.length
      });
    } catch (error) {
      next(error);
    }
  }
}
