import { LeaveModel } from './leave.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class LeaveController {
  static async getAllRequests(req, res, next) {
    try {
      const requests = await LeaveModel.findAllRequests(req.query);
      return ApiResponse.success(res, requests, 'Leave requests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getRequestById(req, res, next) {
    try {
      const request = await LeaveModel.findRequestById(req.params.id);
      if (!request) {
        return ApiResponse.notFound(res, 'Leave request not found');
      }
      return ApiResponse.success(res, request, 'Leave request details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createRequest(req, res, next) {
    try {
      const { employeeId, employee_id, startDate, start_date, endDate, end_date } = req.body;
      if ((!employeeId && !employee_id) || (!startDate && !start_date) || (!endDate && !end_date)) {
        return ApiResponse.badRequest(res, 'Employee ID, Start Date, and End Date are required.');
      }

      const request = await LeaveModel.createRequest(req.body);
      return ApiResponse.created(res, request, 'Leave request submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async approveRequest(req, res, next) {
    try {
      const reviewer = req.body.reviewedBy || 'Admin';
      const updated = await LeaveModel.updateStatus(req.params.id, 'Approved', reviewer);
      if (!updated) {
        return ApiResponse.notFound(res, 'Leave request not found');
      }
      return ApiResponse.success(res, updated, 'Leave request approved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async rejectRequest(req, res, next) {
    try {
      const reviewer = req.body.reviewedBy || 'Admin';
      const updated = await LeaveModel.updateStatus(req.params.id, 'Rejected', reviewer);
      if (!updated) {
        return ApiResponse.notFound(res, 'Leave request not found');
      }
      return ApiResponse.success(res, updated, 'Leave request rejected');
    } catch (error) {
      next(error);
    }
  }

  static async getBalance(req, res, next) {
    try {
      const balance = await LeaveModel.getBalance(req.params.employeeId);
      if (!balance) {
        return ApiResponse.notFound(res, 'Leave balance not found for this employee');
      }
      return ApiResponse.success(res, balance, 'Leave balance retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getLeaveTypes(req, res, next) {
    try {
      const types = await LeaveModel.getLeaveTypes();
      return ApiResponse.success(res, types, 'Leave types retrieved');
    } catch (error) {
      next(error);
    }
  }
}
