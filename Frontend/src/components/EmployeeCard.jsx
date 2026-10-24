import React from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Star
} from 'lucide-react';

export default function EmployeeCard({ 
  employee, 
  isSelected, 
  onToggleSelect, 
  onView, 
  onEdit, 
  onDelete 
}) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'On Leave': return 'badge-on-leave';
      case 'Probation': return 'badge-probation';
      case 'Terminated': return 'badge-terminated';
      default: return 'badge-active';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Active': return 'active';
      case 'On Leave': return 'on-leave';
      case 'Probation': return 'probation';
      default: return 'terminated';
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className={`emp-card ${isSelected ? 'selected' : ''}`} id={`card-${employee.id}`}>
      <div className="emp-card-header">
        <div className="emp-card-user">
          <div className="emp-card-avatar-wrapper">
            <img 
              src={employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=6366f1&color=fff`} 
              alt={employee.name} 
              className="emp-card-avatar"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=6366f1&color=fff`;
              }}
            />
            <span className={`status-indicator ${getStatusDot(employee.status)}`} />
          </div>

          <div className="emp-card-info">
            <h3 onClick={() => onView(employee)} title="Click to view details">
              {employee.name}
            </h3>
            <div className="emp-card-role">{employee.role}</div>
            <div className="emp-card-dept">
              <span className="dept-badge">{employee.department}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => onToggleSelect(employee.id)} 
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            title="Select employee"
          />
          <span className={`badge ${getStatusClass(employee.status)}`}>
            {employee.status}
          </span>
        </div>
      </div>

      <div className="emp-card-meta-list">
        <div className="meta-item">
          <span className="meta-item-label">
            <MapPin size={14} /> Location
          </span>
          <span className="meta-item-value">{employee.location || 'Remote'}</span>
        </div>

        <div className="meta-item">
          <span className="meta-item-label">
            <DollarSign size={14} /> Salary
          </span>
          <span className="meta-item-value">{formatCurrency(employee.salary)}/yr</span>
        </div>

        <div className="meta-item">
          <span className="meta-item-label">
            <Calendar size={14} /> Joined
          </span>
          <span className="meta-item-value">{employee.joiningDate || '2023'}</span>
        </div>

        <div className="meta-item">
          <span className="meta-item-label">
            <Star size={14} color="#f59e0b" /> Rating
          </span>
          <span className="meta-item-value">{employee.rating ? `${employee.rating} / 5.0` : '4.5 / 5.0'}</span>
        </div>
      </div>

      {employee.skills && employee.skills.length > 0 && (
        <div className="skills-container">
          {employee.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {employee.skills.length > 3 && (
            <span className="skill-tag" style={{ opacity: 0.7 }}>
              +{employee.skills.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="emp-card-footer">
        <span className="emp-id-tag">{employee.id}</span>
        
        <div className="table-actions">
          <button 
            className="btn-icon" 
            onClick={() => onView(employee)}
            title="View Details"
            id={`btn-view-${employee.id}`}
          >
            <Eye size={16} />
          </button>
          <button 
            className="btn-icon" 
            onClick={() => onEdit(employee)}
            title="Edit Employee"
            id={`btn-edit-${employee.id}`}
          >
            <Edit3 size={16} />
          </button>
          <button 
            className="btn-icon" 
            onClick={() => onDelete(employee)}
            title="Delete Employee"
            style={{ color: 'var(--danger)' }}
            id={`btn-delete-${employee.id}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
