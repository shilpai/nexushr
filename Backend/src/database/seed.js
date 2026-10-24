import { pool } from '../config/db.config.js';
import { initializeDatabase } from './initDb.js';

const initialDepartments = [
  { name: 'Engineering', code: 'ENG', description: 'Core software engineering, platform and infrastructure squads', budget: 1200000.00, lead: 'Marcus Vance' },
  { name: 'Design', code: 'DSN', description: 'Product design, design systems, and UX research', budget: 450000.00, lead: 'Sophia Sterling' },
  { name: 'Product', code: 'PRD', description: 'Product management, user feedback, roadmaps and discovery', budget: 550000.00, lead: 'Sophia Sterling' },
  { name: 'Marketing', code: 'MKT', description: 'Growth, brand marketing, content and community', budget: 400000.00, lead: 'Julian Meyer' },
  { name: 'Sales', code: 'SLS', description: 'Enterprise accounts, direct sales and renewals', budget: 700000.00, lead: 'Derrick Cole' },
  { name: 'Human Resources', code: 'HR', description: 'People operations, culture, recruitment and wellness', budget: 350000.00, lead: 'Elena Rostova' },
  { name: 'Finance', code: 'FIN', description: 'Treasury, payroll, financial modeling and investor relations', budget: 500000.00, lead: 'Rachel Adams' }
];

const initialEmployees = [
  {
    emp_code: "EMP-1001",
    name: "Alexandria Rivera",
    email: "alexandria.r@nexushr.io",
    phone: "+1 (555) 234-8901",
    role: "Staff Software Engineer",
    department: "Engineering",
    employment_type: "Full-time",
    status: "Active",
    location: "San Francisco, CA",
    salary: 165000.00,
    joining_date: "2022-03-15",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Marcus Vance",
    rating: 4.90,
    bio: "Architecture lead on core web platforms and micro-frontends with 8+ years experience.",
    emergency_name: "Carlos Rivera",
    emergency_relation: "Spouse",
    emergency_phone: "+1 (555) 902-1144",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "System Design"],
    leavesTaken: 6,
    totalLeaves: 25
  },
  {
    emp_code: "EMP-1002",
    name: "David Chen",
    email: "david.chen@nexushr.io",
    phone: "+1 (555) 492-3810",
    role: "Senior Product Designer",
    department: "Design",
    employment_type: "Remote",
    status: "Active",
    location: "Seattle, WA",
    salary: 138000.00,
    joining_date: "2022-07-01",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Sophia Sterling",
    rating: 4.80,
    bio: "Passionate about creating accessible, pixel-perfect user journeys and atomic design systems.",
    emergency_name: "Grace Chen",
    emergency_relation: "Sister",
    emergency_phone: "+1 (555) 301-4499",
    skills: ["Figma", "Design Systems", "Prototyping", "UX Research", "Framer"],
    leavesTaken: 4,
    totalLeaves: 22
  },
  {
    emp_code: "EMP-1003",
    name: "Elena Rostova",
    email: "elena.r@nexushr.io",
    phone: "+1 (555) 872-9102",
    role: "Head of Talent & Culture",
    department: "Human Resources",
    employment_type: "Hybrid",
    status: "Active",
    location: "New York, NY",
    salary: 152000.00,
    joining_date: "2021-01-10",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Executive Board",
    rating: 5.00,
    bio: "Driving international expansion, company-wide retention initiatives, and organizational growth.",
    emergency_name: "Viktor Rostov",
    emergency_relation: "Brother",
    emergency_phone: "+1 (555) 778-9900",
    skills: ["Talent Acquisition", "Employee Wellness", "DE&I", "Compensation Strategy"],
    leavesTaken: 8,
    totalLeaves: 28
  },
  {
    emp_code: "EMP-1004",
    name: "Marcus Vance",
    email: "marcus.v@nexushr.io",
    phone: "+1 (555) 612-4091",
    role: "VP of Engineering",
    department: "Engineering",
    employment_type: "Full-time",
    status: "Active",
    location: "San Francisco, CA",
    salary: 215000.00,
    joining_date: "2020-04-12",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "CEO",
    rating: 4.90,
    bio: "Oversees 40+ engineers across 4 squads. Ex-Stripe and ex-Datadog engineering leader.",
    emergency_name: "Amelia Vance",
    emergency_relation: "Spouse",
    emergency_phone: "+1 (555) 911-3004",
    skills: ["Cloud Infrastructure", "Kubernetes", "Engineering Leadership", "AWS", "Go"],
    leavesTaken: 12,
    totalLeaves: 30
  },
  {
    emp_code: "EMP-1005",
    name: "Priya Sharma",
    email: "priya.sharma@nexushr.io",
    phone: "+1 (555) 349-1829",
    role: "Senior Growth Marketing Manager",
    department: "Marketing",
    employment_type: "Remote",
    status: "On Leave",
    location: "Austin, TX",
    salary: 128000.00,
    joining_date: "2023-02-20",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Julian Meyer",
    rating: 4.70,
    bio: "Spearheaded 140% YoY organic pipeline expansion across North America and EMEA.",
    emergency_name: "Rohan Sharma",
    emergency_relation: "Father",
    emergency_phone: "+1 (555) 670-1920",
    skills: ["Growth SEO", "Paid Acquisition", "HubSpot", "Data Analytics", "Content Strategy"],
    leavesTaken: 15,
    totalLeaves: 22
  },
  {
    emp_code: "EMP-1006",
    name: "Liam O'Connor",
    email: "liam.oc@nexushr.io",
    phone: "+44 20 7946 0912",
    role: "Lead DevOps Architect",
    department: "Engineering",
    employment_type: "Remote",
    status: "Active",
    location: "London, UK",
    salary: 160000.00,
    joining_date: "2022-11-05",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Marcus Vance",
    rating: 4.80,
    bio: "Built our automated multi-region deployment pipeline reducing incident response by 60%.",
    emergency_name: "Maeve O'Connor",
    emergency_relation: "Mother",
    emergency_phone: "+44 20 7946 0111",
    skills: ["Terraform", "CI/CD", "Docker", "GCP", "Zero-Trust Security"],
    leavesTaken: 5,
    totalLeaves: 25
  },
  {
    emp_code: "EMP-1007",
    name: "Sophia Sterling",
    email: "sophia.s@nexushr.io",
    phone: "+1 (555) 789-3211",
    role: "VP of Product & Experience",
    department: "Product",
    employment_type: "Full-time",
    status: "Active",
    location: "San Francisco, CA",
    salary: 198000.00,
    joining_date: "2020-09-18",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "CEO",
    rating: 4.90,
    bio: "Product visionary directing core UX roadmaps, user retention loops, and enterprise tier launches.",
    emergency_name: "James Sterling",
    emergency_relation: "Spouse",
    emergency_phone: "+1 (555) 441-2099",
    skills: ["Product Strategy", "User Centered Design", "Roadmapping", "A/B Testing"],
    leavesTaken: 7,
    totalLeaves: 26
  },
  {
    emp_code: "EMP-1008",
    name: "Kenji Sato",
    email: "kenji.sato@nexushr.io",
    phone: "+81 3 5555 0143",
    role: "Principal Financial Analyst",
    department: "Finance",
    employment_type: "Hybrid",
    status: "Active",
    location: "Tokyo, JP",
    salary: 142000.00,
    joining_date: "2021-06-14",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Rachel Adams",
    rating: 4.80,
    bio: "Coordinates APAC budget forecast, runway planning, and corporate compliance.",
    emergency_name: "Yuki Sato",
    emergency_relation: "Spouse",
    emergency_phone: "+81 3 5555 0888",
    skills: ["Financial Modeling", "SaaS Metrics", "ERP Planning", "Equity Management"],
    leavesTaken: 3,
    totalLeaves: 20
  },
  {
    emp_code: "EMP-1009",
    name: "Zoe Kravitz-Miller",
    email: "zoe.km@nexushr.io",
    phone: "+1 (555) 432-8765",
    role: "Enterprise Account Executive",
    department: "Sales",
    employment_type: "Remote",
    status: "Active",
    location: "Chicago, IL",
    salary: 135000.00,
    joining_date: "2023-05-01",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Derrick Cole",
    rating: 4.60,
    bio: "Closed 2.4M ARR in key fortune 500 accounts in Q3 2025. President's Club nominee.",
    emergency_name: "Taylor Miller",
    emergency_relation: "Spouse",
    emergency_phone: "+1 (555) 890-4411",
    skills: ["Enterprise B2B", "Negotiation", "Salesforce CRM", "Solution Selling"],
    leavesTaken: 9,
    totalLeaves: 24
  },
  {
    emp_code: "EMP-1010",
    name: "Mateo Alvarez",
    email: "mateo.a@nexushr.io",
    phone: "+34 91 123 4567",
    role: "Junior Frontend Developer",
    department: "Engineering",
    employment_type: "Contract",
    status: "Probation",
    location: "Madrid, ES",
    salary: 72000.00,
    joining_date: "2026-01-15",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Alexandria Rivera",
    rating: 4.30,
    bio: "Excited frontend developer contributing to design system component tokens and documentation.",
    emergency_name: "Isabel Alvarez",
    emergency_relation: "Mother",
    emergency_phone: "+34 91 555 2211",
    skills: ["React", "JavaScript", "CSS3", "Git", "Tailwind"],
    leavesTaken: 1,
    totalLeaves: 15
  },
  {
    emp_code: "EMP-1011",
    name: "Rachel Adams",
    email: "rachel.adams@nexushr.io",
    phone: "+1 (555) 912-3847",
    role: "Chief Financial Officer",
    department: "Finance",
    employment_type: "Full-time",
    status: "Active",
    location: "New York, NY",
    salary: 240000.00,
    joining_date: "2019-11-01",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Board of Directors",
    rating: 5.00,
    bio: "Led Series B and C funding rounds. 15+ years experience in Silicon Valley tech finance.",
    emergency_name: "Gregory Adams",
    emergency_relation: "Spouse",
    emergency_phone: "+1 (555) 234-9002",
    skills: ["Corporate Strategy", "M&A", "Treasury", "Investor Relations", "SOX"],
    leavesTaken: 10,
    totalLeaves: 30
  },
  {
    emp_code: "EMP-1012",
    name: "Tariq Mansoor",
    email: "tariq.m@nexushr.io",
    phone: "+971 4 391 1122",
    role: "QA Automation Engineer",
    department: "Engineering",
    employment_type: "Remote",
    status: "Active",
    location: "Dubai, UAE",
    salary: 110000.00,
    joining_date: "2023-08-10",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80",
    manager_name: "Alexandria Rivera",
    rating: 4.70,
    bio: "Automated end-to-end regression suites ensuring 99.98% release uptime across all web clients.",
    emergency_name: "Farida Mansoor",
    emergency_relation: "Sister",
    emergency_phone: "+971 4 391 9900",
    skills: ["Playwright", "Jest", "Cypress", "Python", "Performance Testing"],
    leavesTaken: 2,
    totalLeaves: 22
  }
];

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Starting database seeding process...');
    await initializeDatabase();

    // 1. Seed Departments
    const deptIdMap = {};
    for (const dept of initialDepartments) {
      const [result] = await pool.query(
        `INSERT INTO departments (name, code, description, budget, lead_name)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE description=VALUES(description), budget=VALUES(budget), lead_name=VALUES(lead_name)`,
        [dept.name, dept.code, dept.description, dept.budget, dept.lead]
      );
      
      const [rows] = await pool.query(`SELECT id FROM departments WHERE name = ?`, [dept.name]);
      if (rows.length > 0) {
        deptIdMap[dept.name] = rows[0].id;
      }
    }
    console.log(`[Seeder] ✅ ${initialDepartments.length} Departments seeded.`);

    // 2. Seed Employees & Related Tables
    for (const emp of initialEmployees) {
      const deptId = deptIdMap[emp.department] || null;

      await pool.query(
        `INSERT INTO employees (
          emp_code, name, email, phone, role, department_id, department_name,
          employment_type, status, location, salary, joining_date, avatar,
          manager_name, rating, bio, emergency_name, emergency_relation, emergency_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name=VALUES(name), email=VALUES(email), role=VALUES(role), salary=VALUES(salary),
          status=VALUES(status), rating=VALUES(rating), avatar=VALUES(avatar), bio=VALUES(bio)`,
        [
          emp.emp_code, emp.name, emp.email, emp.phone, emp.role, deptId, emp.department,
          emp.employment_type, emp.status, emp.location, emp.salary, emp.joining_date,
          emp.avatar, emp.manager_name, emp.rating, emp.bio,
          emp.emergency_name, emp.emergency_relation, emp.emergency_phone
        ]
      );

      // Get inserted employee ID
      const [empRows] = await pool.query(`SELECT id FROM employees WHERE emp_code = ?`, [emp.emp_code]);
      if (empRows.length > 0) {
        const employeeId = empRows[0].id;

        // Skills
        await pool.query(`DELETE FROM employee_skills WHERE employee_id = ?`, [employeeId]);
        for (const skill of emp.skills) {
          await pool.query(
            `INSERT INTO employee_skills (employee_id, skill) VALUES (?, ?)`,
            [employeeId, skill]
          );
        }

        // Leave Balance
        const currentYear = new Date().getFullYear();
        await pool.query(
          `INSERT INTO leave_balances (employee_id, year, total_allowance, used_days, remaining_days)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             total_allowance=VALUES(total_allowance), used_days=VALUES(used_days), remaining_days=VALUES(remaining_days)`,
          [employeeId, currentYear, emp.totalLeaves, emp.leavesTaken, emp.totalLeaves - emp.leavesTaken]
        );
      }
    }
    console.log(`[Seeder] ✅ ${initialEmployees.length} Employees with skills and leave balances seeded.`);

    // 3. Seed Sample Leave Requests
    const [priya] = await pool.query(`SELECT id FROM employees WHERE emp_code = 'EMP-1005'`);
    if (priya.length > 0) {
      await pool.query(
        `INSERT IGNORE INTO leave_requests (request_code, employee_id, leave_type_name, start_date, end_date, total_days, reason, status)
         VALUES (?, ?, ?, '2026-11-02', '2026-11-09', 7, 'Family reunion trip to Chicago', 'Pending')`,
        ['REQ-101', priya[0].id, 'Annual Vacation']
      );
    }

    const [mateo] = await pool.query(`SELECT id FROM employees WHERE emp_code = 'EMP-1010'`);
    if (mateo.length > 0) {
      await pool.query(
        `INSERT IGNORE INTO leave_requests (request_code, employee_id, leave_type_name, start_date, end_date, total_days, reason, status)
         VALUES (?, ?, ?, '2026-10-25', '2026-10-25', 1, 'Routine outpatient consultation', 'Pending')`,
        ['REQ-102', mateo[0].id, 'Sick Leave']
      );
    }
    console.log(`[Seeder] ✅ Sample Leave Requests seeded.`);

    console.log('[Seeder] 🎉 All data seeding completed successfully!');
  } catch (error) {
    console.error(`[Seeder Error] ❌ ${error.message}`);
  }
};

// If run directly
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
