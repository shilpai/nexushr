import { EmployeeService } from './employee.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class EmployeeController {
  static async getAll(req, res, next) {
    try {
      const employees = await EmployeeService.getAllEmployees(req.query);
      return ApiResponse.success(res, employees, 'Employees retrieved successfully', 200, {
        count: employees.length
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const employee = await EmployeeService.getEmployeeById(req.params.id);
      return ApiResponse.success(res, employee, 'Employee profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const newEmployee = await EmployeeService.createEmployee(req.body);
      return ApiResponse.created(res, newEmployee, 'Employee profile created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await EmployeeService.updateEmployee(req.params.id, req.body);
      return ApiResponse.success(res, updated, 'Employee profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await EmployeeService.deleteEmployee(req.params.id);
      return ApiResponse.success(res, null, 'Employee profile deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async bulkDelete(req, res, next) {
    try {
      const count = await EmployeeService.bulkDeleteEmployees(req.body.ids);
      return ApiResponse.success(res, { deletedCount: count }, `Successfully deleted ${count} employee records`);
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req, res, next) {
    try {
      const stats = await EmployeeService.getWorkforceStats();
      return ApiResponse.success(res, stats, 'Workforce statistics calculated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getNextCode(req, res, next) {
    try {
      const result = await EmployeeService.getNextEmployeeCode();
      return ApiResponse.success(res, result, 'Next employee code generated');
    } catch (error) {
      next(error);
    }
  }
}
