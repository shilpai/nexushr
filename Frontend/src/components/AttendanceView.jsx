import React, { useState } from 'react';
import { CalendarClock, Check, X } from 'lucide-react';

export default function AttendanceView({ employees, onUpdateEmployeeStatus, showToast }) {
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'REQ-101',
      employeeId: 'EMP-1005',
      name: 'Priya Sharma',
      department: 'Marketing',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
      type: 'Annual Vacation',
      dates: 'Nov 02 - Nov 09 (7 Days)',
      reason: 'Family reunion trip to Chicago',
      appliedOn: 'Yesterday'
    },
    {
      id: 'REQ-102',
      employeeId: 'EMP-1010',
      name: 'Mateo Alvarez',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80',
      type: 'Medical Leave',
      dates: 'Tomorrow (1 Day)',
      reason: 'Routine outpatient consultation',
      appliedOn: 'Today'
    }
  ]);

  const handleApprove = (req) => {
    setPendingRequests(prev => prev.filter(r => r.id !== req.id));
    onUpdateEmployeeStatus(req.employeeId, 'On Leave');
    showToast(`Leave request for ${req.name} approved! Status set to 'On Leave'.`, 'success');
  };

  const handleDecline = (req) => {
    setPendingRequests(prev => prev.filter(r => r.id !== req.id));
    showToast(`Leave request for ${req.name} declined.`, 'info');
  };

  return (
    <div className="attendance-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Pending Leave Requests */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
              Pending Time-Off Approvals
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              Review and act on scheduled PTO and leave requests from team members.
            </p>
          </div>
          <span className="stat-badge stat-badge-warning">
            {pendingRequests.length} Pending Actions
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="empty-state" style={{ padding: '36px 20px' }}>
            <CalendarClock size={28} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>All clear! No pending leave requests.</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 0 }}>
              All submitted employee requests have been reviewed and processed.
            </p>
          </div>
        ) : (
          <div className="cards-grid">
            {pendingRequests.map(req => (
              <div key={req.id} className="stat-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img 
                    src={req.avatar} 
                    alt={req.name} 
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: '700' }}>{req.name}</h4>
                    <span className="dept-badge">{req.department}</span>
                  </div>
                </div>

                <div className="emp-card-meta-list">
                  <div className="meta-item">
                    <span className="meta-item-label">Leave Type:</span>
                    <span className="meta-item-value" style={{ color: 'var(--primary)' }}>{req.type}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-item-label">Duration:</span>
                    <span className="meta-item-value">{req.dates}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-item-label">Reason:</span>
                    <span className="meta-item-value" style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                      "{req.reason}"
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    style={{ flex: 1, color: 'var(--danger)' }}
                    onClick={() => handleDecline(req)}
                  >
                    <X size={14} />
                    <span>Decline</span>
                  </button>
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ flex: 1 }}
                    onClick={() => handleApprove(req)}
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave Balance Table */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
            Workforce PTO & Attendance Roster
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Track individual leave utilization, remaining quotas, and current working presence.
          </p>
        </div>

        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Working Status</th>
                <th>Used Days</th>
                <th>Available Balance</th>
                <th>Quota Utilization</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const taken = emp.leavesTaken || 0;
                const total = emp.totalLeaves || 24;
                const pct = Math.min(100, Math.round((taken / total) * 100));

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
                      <span className={`badge ${
                        emp.status === 'Active' ? 'badge-active' :
                        emp.status === 'On Leave' ? 'badge-on-leave' : 'badge-probation'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <strong>{taken}</strong> days
                    </td>
                    <td>
                      <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                        {total - taken} days remaining
                      </span>
                    </td>
                    <td style={{ width: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${pct}%`, 
                              height: '100%', 
                              background: pct > 75 ? 'var(--warning)' : 'var(--primary)',
                              borderRadius: '999px'
                            }} 
                          />
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', minWidth: '32px' }}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
