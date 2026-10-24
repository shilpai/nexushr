import { EmployeeModel } from './employee.model.js';
import { validateEmployeePayload } from './employee.validation.js';

export class EmployeeService {
  static async getAllEmployees(query) {
    return EmployeeModel.findAll(query);
  }

  static async getEmployeeById(id) {
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      throw new Error(`Employee with identifier '${id}' was not found.`);
    }
    return employee;
  }

  static async createEmployee(payload) {
    const validation = validateEmployeePayload(payload);
    if (!validation.isValid) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.errors = validation.errors;
      throw err;
    }

    // Auto-generate employee code if missing
    let empCode = payload.id || payload.emp_code;
    if (!empCode || !empCode.startsWith('EMP-')) {
      empCode = await EmployeeModel.getNextEmpCode();
    }

    const newRecordData = {
      ...payload,
      emp_code: empCode
    };

    return EmployeeModel.create(newRecordData);
  }

  static async updateEmployee(id, payload) {
    const validation = validateEmployeePayload(payload, true);
    if (!validation.isValid) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.errors = validation.errors;
      throw err;
    }

    const updated = await EmployeeModel.update(id, payload);
    if (!updated) {
      const err = new Error(`Employee with ID '${id}' not found for update.`);
      err.statusCode = 404;
      throw err;
    }

    return updated;
  }

  static async deleteEmployee(id) {
    const deleted = await EmployeeModel.delete(id);
    if (!deleted) {
      const err = new Error(`Employee with ID '${id}' not found for deletion.`);
      err.statusCode = 404;
      throw err;
    }
    return true;
  }

  static async bulkDeleteEmployees(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const err = new Error('Please provide an array of employee IDs to delete.');
      err.statusCode = 400;
      throw err;
    }
    return EmployeeModel.bulkDelete(ids);
  }

  static async getWorkforceStats() {
    return EmployeeModel.getWorkforceStats();
  }

  static async getNextEmployeeCode() {
    const nextCode = await EmployeeModel.getNextEmpCode();
    return { nextCode };
  }
}
