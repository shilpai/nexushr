import React from 'react';
import { Building2, Users, DollarSign, ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '../data/initialEmployees';

export default function DepartmentView({ employees, onSelectDepartment }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const departmentData = DEPARTMENTS.map(dept => {
    const members = employees.filter(e => e.department === dept);
    const totalPayroll = members.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
    const avgSalary = members.length > 0 ? Math.round(totalPayroll / members.length) : 0;
    
    // Department lead heuristics or first high-salary member
    const lead = [...members].sort((a, b) => (b.salary || 0) - (a.salary || 0))[0];

    return {
      name: dept,
      count: members.length,
      members,
      totalPayroll,
      avgSalary,
      lead: lead ? lead.name : 'Unassigned'
    };
  });

  return (
    <div className="department-view-container animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
          Departmental Structure & Headcount
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
          Overview of operational departments, leads, budget distribution, and team composition.
        </p>
      </div>

      <div className="cards-grid">
        {departmentData.map(dept => (
          <div key={dept.name} className="stat-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  className="stat-icon-wrapper" 
                  style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}
                >
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{dept.name}</h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Lead: <strong style={{ color: 'var(--text-primary)' }}>{dept.lead}</strong>
                  </span>
                </div>
              </div>

              <span className="stat-badge stat-badge-positive">
                {dept.count} Members
              </span>
            </div>

            <div className="emp-card-meta-list" style={{ marginTop: '16px' }}>
              <div className="meta-item">
                <span className="meta-item-label"><DollarSign size={14} /> Total Budget</span>
                <span className="meta-item-value">{formatCurrency(dept.totalPayroll)}/yr</span>
              </div>
              <div className="meta-item">
                <span className="meta-item-label"><Users size={14} /> Avg Compensation</span>
                <span className="meta-item-value">{formatCurrency(dept.avgSalary)}/yr</span>
              </div>
            </div>

            {/* Team Members Avatars */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Active Roster ({dept.members.length})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                {dept.members.slice(0, 6).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=6366f1&color=fff`}
                    alt={m.name}
                    title={`${m.name} - ${m.role}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--border-glass)'
                    }}
                  />
                ))}
                {dept.members.length > 6 && (
                  <span style={{ 
                    fontSize: '0.74rem', 
                    color: 'var(--text-muted)', 
                    background: 'var(--bg-input)', 
                    padding: '4px 8px', 
                    borderRadius: 'var(--radius-full)' 
                  }}>
                    +{dept.members.length - 6} more
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ width: '100%', justifyContent: 'space-between' }}
                onClick={() => onSelectDepartment(dept.name)}
              >
                <span>View {dept.name} Roster</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
