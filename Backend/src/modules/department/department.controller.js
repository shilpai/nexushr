import { DepartmentModel } from './department.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class DepartmentController {
  static async getAll(req, res, next) {
    try {
      const departments = await DepartmentModel.findAll();
      return ApiResponse.success(res, departments, 'Departments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const department = await DepartmentModel.findById(req.params.id);
      if (!department) {
        return ApiResponse.notFound(res, 'Department not found');
      }
      return ApiResponse.success(res, department, 'Department details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return ApiResponse.badRequest(res, 'Department name is required');
      }
      const department = await DepartmentModel.create(req.body);
      return ApiResponse.created(res, department, 'Department created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const department = await DepartmentModel.update(req.params.id, req.body);
      if (!department) {
        return ApiResponse.notFound(res, 'Department not found for update');
      }
      return ApiResponse.success(res, department, 'Department updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const deleted = await DepartmentModel.delete(req.params.id);
      if (!deleted) {
        return ApiResponse.notFound(res, 'Department not found for deletion');
      }
      return ApiResponse.success(res, null, 'Department deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
