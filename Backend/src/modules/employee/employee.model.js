import { pool } from '../../config/db.config.js';

export class EmployeeModel {
  /**
   * Find employees with dynamic search, filter, and sort
   */
  static async findAll({ search, department, status, type, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 100 }) {
    let sql = `
      SELECT 
        e.*,
        MAX(COALESCE(lb.total_allowance, 24)) as totalLeaves,
        MAX(COALESCE(lb.used_days, 0)) as leavesTaken,
        GROUP_CONCAT(DISTINCT es.skill) as skills_list
      FROM employees e
      LEFT JOIN leave_balances lb ON e.id = lb.employee_id AND lb.year = YEAR(CURDATE())
      LEFT JOIN employee_skills es ON e.id = es.employee_id
      WHERE 1=1
    `;
    const params = [];

    // Search query
    if (search && search.trim()) {
      sql += ` AND (
        e.name LIKE ? OR 
        e.email LIKE ? OR 
        e.emp_code LIKE ? OR 
        e.role LIKE ? OR 
        e.location LIKE ?
      )`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Department filter
    if (department && department !== 'All') {
      sql += ` AND e.department_name = ?`;
      params.push(department);
    }

    // Status filter
    if (status && status !== 'All') {
      sql += ` AND e.status = ?`;
      params.push(status);
    }

    // Employment type filter
    if (type && type !== 'All') {
      sql += ` AND e.employment_type = ?`;
      params.push(type);
    }

    sql += ` GROUP BY e.id`;

    // Sort mapping
    const validSortFields = {
      name: 'e.name',
      salary: 'e.salary',
      rating: 'e.rating',
      date: 'e.joining_date',
      id: 'e.id'
    };
    const sortField = validSortFields[sortBy] || 'e.name';
    const direction = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${sortField} ${direction}`;

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    // Format output
    return rows.map(r => this.formatEmployeeRecord(r));
  }

  /**
   * Find employee by ID or emp_code
   */
  static async findById(id) {
    const isEmpCode = typeof id === 'string' && id.startsWith('EMP-');
    const condition = isEmpCode ? 'e.emp_code = ?' : 'e.id = ?';

    const sql = `
      SELECT 
        e.*,
        MAX(COALESCE(lb.total_allowance, 24)) as totalLeaves,
        MAX(COALESCE(lb.used_days, 0)) as leavesTaken,
        GROUP_CONCAT(DISTINCT es.skill) as skills_list
      FROM employees e
      LEFT JOIN leave_balances lb ON e.id = lb.employee_id AND lb.year = YEAR(CURDATE())
      LEFT JOIN employee_skills es ON e.id = es.employee_id
      WHERE ${condition}
      GROUP BY e.id
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [id]);
    if (rows.length === 0) return null;
    return this.formatEmployeeRecord(rows[0]);
  }

  /**
   * Create new employee record
   */
  static async create(employeeData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const sql = `
        INSERT INTO employees (
          emp_code, name, email, phone, role, department_name,
          employment_type, status, location, salary, joining_date,
          avatar, manager_name, rating, bio, emergency_name,
          emergency_relation, emergency_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        employeeData.emp_code,
        employeeData.name,
        employeeData.email,
        employeeData.phone || null,
        employeeData.role,
        employeeData.department_name || employeeData.department || 'Engineering',
        employeeData.employment_type || employeeData.type || 'Full-time',
        employeeData.status || 'Active',
        employeeData.location || null,
        employeeData.salary || 0.00,
        employeeData.joining_date || employeeData.joiningDate || new Date(),
        employeeData.avatar || null,
        employeeData.manager_name || employeeData.manager || null,
        employeeData.rating || 4.5,
        employeeData.bio || null,
        employeeData.emergency_name || employeeData.emergencyContact?.name || null,
        employeeData.emergency_relation || employeeData.emergencyContact?.relation || null,
        employeeData.emergency_phone || employeeData.emergencyContact?.phone || null
      ];

      const [res] = await connection.query(sql, params);
      const newId = res.insertId;

      // Insert skills
      if (Array.isArray(employeeData.skills) && employeeData.skills.length > 0) {
        for (const skill of employeeData.skills) {
          if (skill && skill.trim()) {
            await connection.query(
              `INSERT INTO employee_skills (employee_id, skill) VALUES (?, ?)`,
              [newId, skill.trim()]
            );
          }
        }
      }

      // Initialize leave balance
      const currentYear = new Date().getFullYear();
      await connection.query(
        `INSERT INTO leave_balances (employee_id, year, total_allowance, used_days, remaining_days)
         VALUES (?, ?, ?, ?, ?)`,
        [newId, currentYear, employeeData.totalLeaves || 24, employeeData.leavesTaken || 0, (employeeData.totalLeaves || 24) - (employeeData.leavesTaken || 0)]
      );

      await connection.commit();
      return this.findById(newId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update employee record
   */
  static async update(id, updateData) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const sql = `
        UPDATE employees SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          role = COALESCE(?, role),
          department_name = COALESCE(?, department_name),
          employment_type = COALESCE(?, employment_type),
          status = COALESCE(?, status),
          location = COALESCE(?, location),
          salary = COALESCE(?, salary),
          joining_date = COALESCE(?, joining_date),
          avatar = COALESCE(?, avatar),
          manager_name = COALESCE(?, manager_name),
          rating = COALESCE(?, rating),
          bio = COALESCE(?, bio),
          emergency_name = COALESCE(?, emergency_name),
          emergency_relation = COALESCE(?, emergency_relation),
          emergency_phone = COALESCE(?, emergency_phone)
        WHERE id = ?
      `;

      const params = [
        updateData.name,
        updateData.email,
        updateData.phone,
        updateData.role,
        updateData.department_name || updateData.department,
        updateData.employment_type || updateData.type,
        updateData.status,
        updateData.location,
        updateData.salary,
        updateData.joining_date || updateData.joiningDate,
        updateData.avatar,
        updateData.manager_name || updateData.manager,
        updateData.rating,
        updateData.bio,
        updateData.emergency_name || updateData.emergencyContact?.name,
        updateData.emergency_relation || updateData.emergencyContact?.relation,
        updateData.emergency_phone || updateData.emergencyContact?.phone,
        existing.databaseId
      ];

      await connection.query(sql, params);

      // Update skills if provided
      if (Array.isArray(updateData.skills)) {
        await connection.query(`DELETE FROM employee_skills WHERE employee_id = ?`, [existing.databaseId]);
        for (const skill of updateData.skills) {
          if (skill && skill.trim()) {
            await connection.query(
              `INSERT INTO employee_skills (employee_id, skill) VALUES (?, ?)`,
              [existing.databaseId, skill.trim()]
            );
          }
        }
      }

      await connection.commit();
      return this.findById(existing.databaseId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete employee
   */
  static async delete(id) {
    const existing = await this.findById(id);
    if (!existing) return false;

    const [res] = await pool.query(`DELETE FROM employees WHERE id = ?`, [existing.databaseId]);
    return res.affectedRows > 0;
  }

  /**
   * Bulk delete employees
   */
  static async bulkDelete(codesOrIds) {
    if (!codesOrIds || codesOrIds.length === 0) return 0;

    const placeholders = codesOrIds.map(() => '?').join(',');
    const [res] = await pool.query(
      `DELETE FROM employees WHERE emp_code IN (${placeholders}) OR id IN (${placeholders})`,
      [...codesOrIds, ...codesOrIds]
    );

    return res.affectedRows;
  }

  /**
   * Get highest emp_code for next auto-generated code
   */
  static async getNextEmpCode() {
    const [rows] = await pool.query(
      `SELECT emp_code FROM employees WHERE emp_code LIKE 'EMP-%' ORDER BY id DESC LIMIT 1`
    );
    if (rows.length === 0) return 'EMP-1001';
    const lastCode = rows[0].emp_code;
    const num = parseInt(lastCode.replace('EMP-', ''), 10);
    return isNaN(num) ? 'EMP-1001' : `EMP-${num + 1}`;
  }

  /**
   * Get aggregate metrics
   */
  static async getWorkforceStats() {
    const [totalRows] = await pool.query(`
      SELECT 
        COUNT(*) as totalEmployees,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as activeCount,
        SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) as onLeaveCount,
        SUM(CASE WHEN status = 'Probation' THEN 1 ELSE 0 END) as probationCount,
        SUM(salary) as totalPayroll,
        AVG(salary) as avgSalary
      FROM employees
    `);

    const [deptRows] = await pool.query(`
      SELECT department_name as department, COUNT(*) as count, SUM(salary) as totalBudget
      FROM employees
      GROUP BY department_name
      ORDER BY count DESC
    `);

    return {
      overview: totalRows[0],
      departments: deptRows
    };
  }

  /**
   * Helper to format database record into frontend-friendly schema
   */
  static formatEmployeeRecord(r) {
    return {
      databaseId: r.id,
      id: r.emp_code,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      role: r.role,
      department: r.department_name,
      type: r.employment_type,
      status: r.status,
      location: r.location || 'Remote',
      salary: Number(r.salary) || 0,
      joiningDate: r.joining_date ? new Date(r.joining_date).toISOString().slice(0, 10) : null,
      avatar: r.avatar || '',
      manager: r.manager_name || '',
      rating: Number(r.rating) || 4.5,
      bio: r.bio || '',
      skills: r.skills_list ? r.skills_list.split(',') : [],
      emergencyContact: {
        name: r.emergency_name || '',
        relation: r.emergency_relation || '',
        phone: r.emergency_phone || ''
      },
      leavesTaken: Number(r.leavesTaken) || 0,
      totalLeaves: Number(r.totalLeaves) || 24,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    };
  }
}
