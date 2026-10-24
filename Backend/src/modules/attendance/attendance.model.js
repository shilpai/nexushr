import { pool } from '../../config/db.config.js';

export class AttendanceModel {
  static async findByDate(date = new Date().toISOString().slice(0, 10)) {
    const sql = `
      SELECT 
        e.id as employee_id,
        e.emp_code,
        e.name,
        e.role,
        e.department_name as department,
        e.avatar,
        COALESCE(al.status, CASE WHEN e.status = 'On Leave' THEN 'On Leave' ELSE 'Present' END) as attendance_status,
        al.check_in,
        al.check_out,
        al.total_hours,
        al.notes
      FROM employees e
      LEFT JOIN attendance_logs al ON e.id = al.employee_id AND al.date = ?
      WHERE e.status != 'Terminated'
      ORDER BY e.name ASC
    `;
    const [rows] = await pool.query(sql, [date]);
    return rows;
  }

  static async logAttendance({ employeeId, date, status, checkIn, checkOut, notes }) {
    let empId = employeeId;
    if (typeof empId === 'string' && empId.startsWith('EMP-')) {
      const [empRows] = await pool.query(`SELECT id FROM employees WHERE emp_code = ?`, [empId]);
      if (empRows.length > 0) empId = empRows[0].id;
    }

    const logDate = date || new Date().toISOString().slice(0, 10);
    const sql = `
      INSERT INTO attendance_logs (employee_id, date, status, check_in, check_out, notes)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        check_in = VALUES(check_in),
        check_out = VALUES(check_out),
        notes = VALUES(notes)
    `;

    await pool.query(sql, [empId, logDate, status || 'Present', checkIn || null, checkOut || null, notes || null]);
    return { employeeId: empId, date: logDate, status };
  }
}
