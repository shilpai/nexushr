import { pool } from '../../config/db.config.js';

export class DepartmentModel {
  static async findAll() {
    const sql = `
      SELECT 
        d.id,
        d.name,
        d.code,
        d.description,
        d.budget,
        d.lead_name as lead,
        COUNT(e.id) as count,
        COALESCE(SUM(e.salary), 0) as totalPayroll,
        COALESCE(AVG(e.salary), 0) as avgSalary
      FROM departments d
      LEFT JOIN employees e ON d.name = e.department_name
      GROUP BY d.id
      ORDER BY d.name ASC
    `;
    const [rows] = await pool.query(sql);
    return rows.map(r => ({
      ...r,
      count: Number(r.count) || 0,
      totalPayroll: Number(r.totalPayroll) || 0,
      avgSalary: Math.round(Number(r.avgSalary) || 0),
      budget: Number(r.budget) || 0
    }));
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT d.*, COUNT(e.id) as count 
       FROM departments d 
       LEFT JOIN employees e ON d.name = e.department_name
       WHERE d.id = ? OR d.name = ?
       GROUP BY d.id`,
      [id, id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create({ name, code, description, budget, lead_name }) {
    const [res] = await pool.query(
      `INSERT INTO departments (name, code, description, budget, lead_name) VALUES (?, ?, ?, ?, ?)`,
      [name, code || null, description || null, budget || 0.00, lead_name || null]
    );
    return this.findById(res.insertId);
  }

  static async update(id, { name, code, description, budget, lead_name }) {
    await pool.query(
      `UPDATE departments SET
        name = COALESCE(?, name),
        code = COALESCE(?, code),
        description = COALESCE(?, description),
        budget = COALESCE(?, budget),
        lead_name = COALESCE(?, lead_name)
       WHERE id = ?`,
      [name, code, description, budget, lead_name, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [res] = await pool.query(`DELETE FROM departments WHERE id = ?`, [id]);
    return res.affectedRows > 0;
  }
}
