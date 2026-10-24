import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Edit3, 
  Trash2, 
  Shield, 
  UserCheck, 
  Clock,
  HeartPulse
} from 'lucide-react';

export default function EmployeeDetailModal({ 
  employee, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) {
  if (!isOpen || !employee) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'On Leave': return 'badge-on-leave';
      case 'Probation': return 'badge-probation';
      case 'Terminated': return 'badge-terminated';
      default: return 'badge-active';
    }
  };

  const leavesTaken = employee.leavesTaken || 0;
  const totalLeaves = employee.totalLeaves || 24;
  const leavePercentage = Math.min(100, Math.round((leavesTaken / totalLeaves) * 100));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div className="modal-title-box">
            <h3>Employee Profile</h3>
            <p>Complete record, credentials, and organizational standing</p>
          </div>
          <button className="btn-icon" onClick={onClose} id="btn-close-detail">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Card */}
          <div className="detail-header-card">
            <img 
              src={employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=6366f1&color=fff`} 
              alt={employee.name} 
              className="detail-avatar"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=6366f1&color=fff`;
              }}
            />
            <div className="detail-info">
              <h2>{employee.name}</h2>
              <div className="detail-role">{employee.role}</div>
              <div className="detail-pills">
                <span className="emp-id-tag">{employee.id}</span>
                <span className="dept-badge">{employee.department}</span>
                <span className={`badge ${getStatusClass(employee.status)}`}>
                  {employee.status}
                </span>
                <span className="skill-tag">{employee.type}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="detail-stats-row">
            <div className="detail-stat-box">
              <div className="detail-stat-val">{formatCurrency(employee.salary)}</div>
              <div className="detail-stat-lbl">Annual Salary</div>
            </div>
            <div className="detail-stat-box">
              <div className="detail-stat-val">{employee.rating ? `${employee.rating} ★` : '4.8 ★'}</div>
              <div className="detail-stat-lbl">Performance</div>
            </div>
            <div className="detail-stat-box">
              <div className="detail-stat-val">{totalLeaves - leavesTaken} Days</div>
              <div className="detail-stat-lbl">Leaves Left</div>
            </div>
            <div className="detail-stat-box">
              <div className="detail-stat-val">{employee.joiningDate?.slice(0, 4) || '2022'}</div>
              <div className="detail-stat-lbl">Cohort Year</div>
            </div>
          </div>

          {/* Bio / Summary */}
          {employee.bio && (
            <div className="form-section">
              <div className="form-section-title">
                <Shield size={16} /> Summary & Background
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {employee.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {employee.skills && employee.skills.length > 0 && (
            <div className="form-section">
              <div className="form-section-title">
                <Star size={16} /> Skills & Domain Strengths
              </div>
              <div className="skills-container">
                {employee.skills.map((skill, i) => (
                  <span key={i} className="skill-tag" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Organizational details */}
          <div className="form-section">
            <div className="form-section-title">
              <UserCheck size={16} /> Contact & Org Details
            </div>
            <div className="form-grid-2">
              <div className="meta-item" style={{ padding: '8px 0' }}>
                <span className="meta-item-label"><Mail size={14} /> Email:</span>
                <span className="meta-item-value" style={{ wordBreak: 'break-all' }}>{employee.email}</span>
              </div>
              <div className="meta-item" style={{ padding: '8px 0' }}>
                <span className="meta-item-label"><Phone size={14} /> Phone:</span>
                <span className="meta-item-value">{employee.phone || 'N/A'}</span>
              </div>
              <div className="meta-item" style={{ padding: '8px 0' }}>
                <span className="meta-item-label"><MapPin size={14} /> Location:</span>
                <span className="meta-item-value">{employee.location || 'Remote'}</span>
              </div>
              <div className="meta-item" style={{ padding: '8px 0' }}>
                <span className="meta-item-label"><Calendar size={14} /> Joining Date:</span>
                <span className="meta-item-value">{employee.joiningDate || 'N/A'}</span>
              </div>
              <div className="meta-item" style={{ padding: '8px 0' }}>
                <span className="meta-item-label"><Shield size={14} /> Reports To:</span>
                <span className="meta-item-value">{employee.manager || 'Executive Team'}</span>
              </div>
              <div className="meta-item" style={{ padding: '8px 0' }}>
                <span className="meta-item-label"><Clock size={14} /> Work Model:</span>
                <span className="meta-item-value">{employee.type}</span>
              </div>
            </div>
          </div>

          {/* Leave & PTO Allowance */}
          <div className="form-section">
            <div className="form-section-title">
              <Calendar size={16} /> PTO & Leave Utilization
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Used {leavesTaken} of {totalLeaves} available days
                </span>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>
                  {leavePercentage}% utilized
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${leavePercentage}%`, 
                    height: '100%', 
                    background: leavePercentage > 75 ? 'var(--warning)' : 'var(--primary)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {employee.emergencyContact && employee.emergencyContact.name && (
            <div className="form-section">
              <div className="form-section-title">
                <HeartPulse size={16} /> Emergency Contact
              </div>
              <div className="form-grid-3">
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Name</div>
                  <div style={{ fontWeight: '600', fontSize: '0.86rem' }}>{employee.emergencyContact.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Relationship</div>
                  <div style={{ fontWeight: '600', fontSize: '0.86rem' }}>{employee.emergencyContact.relation || 'Relative'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Contact Phone</div>
                  <div style={{ fontWeight: '600', fontSize: '0.86rem' }}>{employee.emergencyContact.phone || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button 
            type="button" 
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              onClose();
              onDelete(employee);
            }}
          >
            <Trash2 size={14} />
            <span>Delete Profile</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
            >
              <Edit3 size={14} />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
