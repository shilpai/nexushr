import { pool } from '../../config/db.config.js';

export class PayrollModel {
  static async getSummary() {
    const [totalRows] = await pool.query(`
      SELECT 
        COUNT(*) as totalEmployees,
        SUM(salary) as annualTotal,
        ROUND(SUM(salary) / 12, 2) as monthlyTotal,
        ROUND(AVG(salary), 2) as avgSalary,
        SUM(CASE WHEN salary < 100000 THEN 1 ELSE 0 END) as tier1Count,
        SUM(CASE WHEN salary >= 100000 AND salary < 150000 THEN 1 ELSE 0 END) as tier2Count,
        SUM(CASE WHEN salary >= 150000 AND salary < 200000 THEN 1 ELSE 0 END) as tier3Count,
        SUM(CASE WHEN salary >= 200000 THEN 1 ELSE 0 END) as tier4Count
      FROM employees
      WHERE status != 'Terminated'
    `);

    const [deptRows] = await pool.query(`
      SELECT 
        department_name as department,
        COUNT(*) as employeeCount,
        SUM(salary) as totalAnnualPayroll,
        ROUND(SUM(salary) / 12, 2) as monthlyPayroll,
        ROUND(AVG(salary), 2) as avgSalary
      FROM employees
      WHERE status != 'Terminated'
      GROUP BY department_name
      ORDER BY totalAnnualPayroll DESC
    `);

    return {
      overview: totalRows[0],
      departmentDistribution: deptRows
    };
  }

  static async getLedger() {
    const [rows] = await pool.query(`
      SELECT 
        id,
        emp_code,
        name,
        email,
        role,
        department_name as department,
        avatar,
        salary as baseSalary,
        ROUND(salary / 12, 2) as monthlyGross,
        ROUND(salary * 0.10, 2) as estimatedBonus,
        'Direct Deposit' as paymentMethod,
        'Semi-monthly' as schedule
      FROM employees
      WHERE status != 'Terminated'
      ORDER BY salary DESC
    `);
    return rows;
  }
}
