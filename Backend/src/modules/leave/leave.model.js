import { pool } from '../../config/db.config.js';

export class LeaveModel {
  /**
   * Find all leave requests with employee details
   */
  static async findAllRequests({ status, employeeId } = {}) {
    let sql = `
      SELECT 
        lr.*,
        e.emp_code,
        e.name as employee_name,
        e.email as employee_email,
        e.avatar as employee_avatar,
        e.department_name as department
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ` AND lr.status = ?`;
      params.push(status);
    }

    if (employeeId) {
      sql += ` AND (lr.employee_id = ? OR e.emp_code = ?)`;
      params.push(employeeId, employeeId);
    }

    sql += ` ORDER BY lr.applied_at DESC`;
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  /**
   * Find leave request by ID or request_code
   */
  static async findRequestById(id) {
    const isCode = typeof id === 'string' && id.startsWith('REQ-');
    const condition = isCode ? 'lr.request_code = ?' : 'lr.id = ?';

    const sql = `
      SELECT 
        lr.*,
        e.emp_code,
        e.name as employee_name,
        e.email as employee_email,
        e.avatar as employee_avatar,
        e.department_name as department
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      WHERE ${condition}
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create a new leave request
   */
  static async createRequest(data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Resolve employee ID
      let empId = data.employee_id || data.employeeId;
      if (typeof empId === 'string' && empId.startsWith('EMP-')) {
        const [empRows] = await connection.query(`SELECT id FROM employees WHERE emp_code = ?`, [empId]);
        if (empRows.length === 0) {
          throw new Error(`Employee ${empId} not found`);
        }
        empId = empRows[0].id;
      }

      // Generate request code
      const [lastRows] = await connection.query(
        `SELECT request_code FROM leave_requests WHERE request_code LIKE 'REQ-%' ORDER BY id DESC LIMIT 1`
      );
      let nextCode = 'REQ-101';
      if (lastRows.length > 0) {
        const num = parseInt(lastRows[0].request_code.replace('REQ-', ''), 10);
        if (!isNaN(num)) nextCode = `REQ-${num + 1}`;
      }

      const sql = `
        INSERT INTO leave_requests (
          request_code, employee_id, leave_type_name,
          start_date, end_date, total_days, reason, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
      `;

      const [res] = await connection.query(sql, [
        nextCode,
        empId,
        data.leave_type_name || data.leaveType || 'Annual Vacation',
        data.start_date || data.startDate,
        data.end_date || data.endDate,
        data.total_days || data.totalDays || 1,
        data.reason || null
      ]);

      await connection.commit();
      return this.findRequestById(res.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update request status (Approve or Reject)
   */
  static async updateStatus(id, newStatus, reviewedBy = 'Admin') {
    const request = await this.findRequestById(id);
    if (!request) return null;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE leave_requests SET 
          status = ?, 
          reviewed_by = ?,
          reviewed_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [newStatus, reviewedBy, request.id]
      );

      // If approved, update leave_balance and employee status
      if (newStatus === 'Approved') {
        const currentYear = new Date().getFullYear();
        await connection.query(
          `UPDATE leave_balances SET 
            used_days = used_days + ?,
            remaining_days = GREATEST(0, remaining_days - ?)
           WHERE employee_id = ? AND year = ?`,
          [request.total_days, request.total_days, request.employee_id, currentYear]
        );

        // Update employee current status to 'On Leave'
        await connection.query(
          `UPDATE employees SET status = 'On Leave' WHERE id = ?`,
          [request.employee_id]
        );
      }

      await connection.commit();
      return this.findRequestById(request.id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get employee leave balance
   */
  static async getBalance(employeeId, year = new Date().getFullYear()) {
    let empId = employeeId;
    if (typeof empId === 'string' && empId.startsWith('EMP-')) {
      const [empRows] = await pool.query(`SELECT id FROM employees WHERE emp_code = ?`, [empId]);
      if (empRows.length > 0) empId = empRows[0].id;
    }

    const [rows] = await pool.query(
      `SELECT lb.*, e.name, e.emp_code 
       FROM leave_balances lb
       JOIN employees e ON lb.employee_id = e.id
       WHERE lb.employee_id = ? AND lb.year = ?`,
      [empId, year]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get available leave types
   */
  static async getLeaveTypes() {
    const [rows] = await pool.query(`SELECT * FROM leave_types ORDER BY name ASC`);
    return rows;
  }
}
