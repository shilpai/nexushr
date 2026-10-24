import { AttendanceModel } from './attendance.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AttendanceController {
  static async getDailyRoster(req, res, next) {
    try {
      const date = req.query.date || new Date().toISOString().slice(0, 10);
      const roster = await AttendanceModel.findByDate(date);
      return ApiResponse.success(res, roster, `Attendance roster for ${date}`);
    } catch (error) {
      next(error);
    }
  }

  static async logAttendance(req, res, next) {
    try {
      const result = await AttendanceModel.logAttendance(req.body);
      return ApiResponse.success(res, result, 'Attendance record updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
