import React from 'react';
import { Download } from 'lucide-react';

export default function PayrollView({ employees }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const totalAnnual = employees.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
  const totalMonthly = Math.round(totalAnnual / 12);
  const avgSalary = employees.length > 0 ? Math.round(totalAnnual / employees.length) : 0;

  // Bracket categorization
  const brackets = {
    tier1: employees.filter(e => (e.salary || 0) < 100000).length,
    tier2: employees.filter(e => (e.salary || 0) >= 100000 && (e.salary || 0) < 150000).length,
    tier3: employees.filter(e => (e.salary || 0) >= 150000 && (e.salary || 0) < 200000).length,
    tier4: employees.filter(e => (e.salary || 0) >= 200000).length,
  };

  const handleExportPayroll = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Role', 'Annual Base', 'Monthly Gross', 'Est Bonus (10%)'];
    const rows = employees.map(e => {
      const annual = Number(e.salary) || 0;
      const monthly = Math.round(annual / 12);
      const bonus = Math.round(annual * 0.1);
      return [
        `"${e.id}"`,
        `"${e.name}"`,
        `"${e.department}"`,
        `"${e.role}"`,
        annual,
        monthly,
        bonus
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payroll_summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="payroll-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner & Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
            Workforce Compensation & Payroll
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Audited salary metrics, bracket distribution, and monthly payroll disbursement runs.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleExportPayroll}>
          <Download size={14} />
          <span>Export Payroll Report</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Monthly Payroll</span>
          <span className="stat-value">{formatCurrency(totalMonthly)}</span>
          <span className="stat-footnote">Disbursed on 1st of every month</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Annualized Run</span>
          <span className="stat-value">{formatCurrency(totalAnnual)}</span>
          <span className="stat-footnote">Calculated across {employees.length} active contracts</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Average Annual Salary</span>
          <span className="stat-value">{formatCurrency(avgSalary)}</span>
          <span className="stat-footnote">Industry benchmark: $128,000</span>
        </div>
      </div>

      {/* Salary Brackets */}
      <div className="stat-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>
          Salary Tiers & Distribution
        </h3>
        <div className="stats-grid" style={{ marginBottom: 0 }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Entry / Associate (&lt;$100k)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
              {brackets.tier1} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>members</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mid-Level ($100k - $150k)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
              {brackets.tier2} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>members</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Senior / Lead ($150k - $200k)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-purple)', marginTop: '4px' }}>
              {brackets.tier3} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>members</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Executive / Director (&gt;$200k)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
              {brackets.tier4} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Compensation Table */}
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Annual Base</th>
              <th>Monthly Gross</th>
              <th>Est. Bonus Target (10%)</th>
              <th>Payment Schedule</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const annual = Number(emp.salary) || 0;
              const monthly = Math.round(annual / 12);
              const bonus = Math.round(annual * 0.1);

              return (
                <tr key={emp.id}>
                  <td>
                    <div className="user-cell">
                      <img 
                        src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=6366f1&color=fff`} 
                        alt={emp.name} 
                        className="table-avatar" 
                      />
                      <div className="user-cell-meta">
                        <span className="user-cell-name">{emp.name}</span>
                        <span className="user-cell-email">{emp.role}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="dept-badge">{emp.department}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(annual)}</strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(monthly)}/mo</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>+{formatCurrency(bonus)}</span>
                  </td>
                  <td>
                    <span className="stat-badge stat-badge-info">Direct Deposit (Semi-monthly)</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
