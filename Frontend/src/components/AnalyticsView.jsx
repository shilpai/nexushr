import React from 'react';
import { Users, TrendingUp, Award, Globe } from 'lucide-react';
import { DEPARTMENTS, EMPLOYMENT_TYPES } from '../data/initialEmployees';

export default function AnalyticsView({ employees }) {
  const total = employees.length;

  // Department counts
  const deptCounts = DEPARTMENTS.map(dept => {
    const count = employees.filter(e => e.department === dept).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return { dept, count, pct };
  }).sort((a, b) => b.count - a.count);

  const maxDeptCount = Math.max(...deptCounts.map(d => d.count), 1);

  // Type counts
  const typeCounts = EMPLOYMENT_TYPES.map(type => {
    const count = employees.filter(e => e.type === type).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return { type, count, pct };
  });

  // Performance ratings
  const ratings = {
    exceptional: employees.filter(e => (e.rating || 0) >= 4.9).length,
    high: employees.filter(e => (e.rating || 0) >= 4.6 && (e.rating || 0) < 4.9).length,
    standard: employees.filter(e => (e.rating || 0) >= 4.2 && (e.rating || 0) < 4.6).length,
    developing: employees.filter(e => (e.rating || 0) < 4.2).length,
  };

  // Salary by department
  const deptSalaries = DEPARTMENTS.map(dept => {
    const group = employees.filter(e => e.department === dept);
    const sum = group.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
    const avg = group.length > 0 ? Math.round(sum / group.length) : 0;
    return { dept, avg };
  }).sort((a, b) => b.avg - a.avg);

  const maxAvgSalary = Math.max(...deptSalaries.map(d => d.avg), 1);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="analytics-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
          Workforce Analytics & Demographics
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
          Deep real-time metrics on talent distribution, organizational strength, and compensation curves.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Department Headcount Bar Graph */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Headcount by Department</h3>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{total} Total Staff</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {deptCounts.map(item => (
              <div key={item.dept} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: '500' }}>{item.dept}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.count} ({item.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(item.count / maxDeptCount) * 100}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Model / Employment Type */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Globe size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Work Model Distribution</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {typeCounts.map(item => (
              <div key={item.type} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: '500' }}>{item.type}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.count} ({item.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${item.pct}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '22px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Remote-Friendly Index</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-cyan)', marginTop: '2px' }}>
              {Math.round(((typeCounts.find(t => t.type === 'Remote')?.count || 0) + (typeCounts.find(t => t.type === 'Hybrid')?.count || 0)) / Math.max(1, total) * 100)}% Flexible
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Award size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Performance Evaluation Bands</h3>
          </div>

          <div className="form-grid-2" style={{ gap: '12px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Top Tier (4.9 - 5.0)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                {ratings.exceptional}
              </div>
              <span className="stat-badge stat-badge-positive" style={{ marginTop: '4px' }}>Exceeding</span>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Strong (4.6 - 4.8)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
                {ratings.high}
              </div>
              <span className="stat-badge stat-badge-info" style={{ marginTop: '4px' }}>On Target</span>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Consistent (4.2 - 4.5)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>
                {ratings.standard}
              </div>
              <span className="stat-badge stat-badge-warning" style={{ marginTop: '4px' }}>Proficient</span>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Developing (&lt;4.2)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-muted)', marginTop: '4px' }}>
                {ratings.developing}
              </div>
              <span className="stat-badge" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', marginTop: '4px' }}>Mentorship</span>
            </div>
          </div>
        </div>

        {/* Avg Salary by Department */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <TrendingUp size={18} color="#10b981" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Average Compensation Curve</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deptSalaries.map(item => (
              <div key={item.dept} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: '500' }}>{item.dept}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatCurrency(item.avg)}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(item.avg / maxAvgSalary) * 100}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
