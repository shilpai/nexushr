import React from 'react';
import { Users, UserCheck, CalendarOff, DollarSign } from 'lucide-react';

export default function StatsOverview({ employees }) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'On Leave').length;
  const totalPayroll = employees.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
  const avgSalary = totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;

  // Find top department
  const deptCounts = {};
  employees.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });
  let topDept = 'N/A';
  let topCount = 0;
  Object.entries(deptCounts).forEach(([dept, count]) => {
    if (count > topCount) {
      topCount = count;
      topDept = dept;
    }
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-header">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Users size={22} />
          </div>
          <span className="stat-badge stat-badge-positive">+12% MoM</span>
        </div>
        <div className="stat-body">
          <span className="stat-label">Total Workforce</span>
          <span className="stat-value">{totalEmployees}</span>
          <span className="stat-footnote">Across 7 global teams</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <UserCheck size={22} />
          </div>
          <span className="stat-badge stat-badge-positive">
            {totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0}% Active
          </span>
        </div>
        <div className="stat-body">
          <span className="stat-label">Active & Online</span>
          <span className="stat-value">{activeEmployees}</span>
          <span className="stat-footnote">Currently working on tasks</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <CalendarOff size={22} />
          </div>
          <span className="stat-badge stat-badge-warning">{onLeaveEmployees} Away</span>
        </div>
        <div className="stat-body">
          <span className="stat-label">On Leave</span>
          <span className="stat-value">{onLeaveEmployees}</span>
          <span className="stat-footnote">Scheduled PTO & Vacation</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <DollarSign size={22} />
          </div>
          <span className="stat-badge stat-badge-info">Avg {formatCurrency(avgSalary)}</span>
        </div>
        <div className="stat-body">
          <span className="stat-label">Annual Payroll Run</span>
          <span className="stat-value">{formatCurrency(totalPayroll)}</span>
          <span className="stat-footnote">Lead dept: {topDept} ({topCount})</span>
        </div>
      </div>
    </div>
  );
}
