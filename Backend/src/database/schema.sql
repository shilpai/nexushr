-- ==========================================================
-- NexusHR Enterprise Database Schema (MySQL)
-- Modular Monolith HRMS & Employee Management System
-- ==========================================================

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NULL,
  description TEXT,
  budget DECIMAL(15, 2) DEFAULT 0.00,
  lead_name VARCHAR(150) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  emp_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(50) NULL,
  role VARCHAR(100) NOT NULL,
  department_id INT NULL,
  department_name VARCHAR(100) NOT NULL,
  employment_type ENUM('Full-time', 'Part-time', 'Remote', 'Hybrid', 'Contract') DEFAULT 'Full-time',
  status ENUM('Active', 'On Leave', 'Probation', 'Terminated') DEFAULT 'Active',
  location VARCHAR(150) NULL,
  salary DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  joining_date DATE NULL,
  avatar VARCHAR(500) NULL,
  manager_name VARCHAR(150) NULL,
  rating DECIMAL(3, 2) DEFAULT 4.50,
  bio TEXT NULL,
  emergency_name VARCHAR(150) NULL,
  emergency_relation VARCHAR(50) NULL,
  emergency_phone VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_emp_code (emp_code),
  INDEX idx_emp_email (email),
  INDEX idx_emp_department (department_name),
  INDEX idx_emp_status (status),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Employee Skills Table
CREATE TABLE IF NOT EXISTS employee_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  skill VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_skill (skill),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Leave Types Table
CREATE TABLE IF NOT EXISTS leave_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  max_days INT DEFAULT 15,
  is_paid BOOLEAN DEFAULT TRUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Leave Balances Table
CREATE TABLE IF NOT EXISTS leave_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  year INT NOT NULL,
  total_allowance INT DEFAULT 24,
  used_days INT DEFAULT 0,
  remaining_days INT DEFAULT 24,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_emp_year (employee_id, year),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_code VARCHAR(50) NOT NULL UNIQUE,
  employee_id INT NOT NULL,
  leave_type_id INT NULL,
  leave_type_name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT NOT NULL DEFAULT 1,
  reason TEXT NULL,
  status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
  reviewed_by VARCHAR(150) NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_leave_status (status),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Attendance Logs Table
CREATE TABLE IF NOT EXISTS attendance_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('Present', 'Remote', 'Late', 'Half-day', 'Absent', 'On Leave') DEFAULT 'Present',
  check_in TIME NULL,
  check_out TIME NULL,
  total_hours DECIMAL(4, 2) DEFAULT 8.00,
  notes VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_emp_date (employee_id, date),
  INDEX idx_att_date (date),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Payroll Records Table
CREATE TABLE IF NOT EXISTS payroll_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  payroll_month INT NOT NULL,
  payroll_year INT NOT NULL,
  base_salary DECIMAL(12, 2) NOT NULL,
  bonus DECIMAL(12, 2) DEFAULT 0.00,
  deductions DECIMAL(12, 2) DEFAULT 0.00,
  net_salary DECIMAL(12, 2) NOT NULL,
  status ENUM('Draft', 'Processing', 'Paid') DEFAULT 'Paid',
  payment_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_payroll_period (payroll_year, payroll_month),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
