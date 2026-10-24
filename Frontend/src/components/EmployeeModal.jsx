import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  DollarSign, 
  PhoneCall, 
  CheckCircle2
} from 'lucide-react';
import { DEPARTMENTS, EMPLOYMENT_TYPES, STATUS_LIST } from '../data/initialEmployees';

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80"
];

export default function EmployeeModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  existingEmployees 
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const generateNewId = () => {
    if (!existingEmployees || existingEmployees.length === 0) return 'EMP-1001';
    const ids = existingEmployees
      .map(e => parseInt(e.id.replace('EMP-', ''), 10))
      .filter(num => !isNaN(num));
    const maxId = ids.length > 0 ? Math.max(...ids) : 1000;
    return `EMP-${maxId + 1}`;
  };

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Engineering',
    type: 'Full-time',
    status: 'Active',
    location: 'San Francisco, CA',
    salary: 120000,
    joiningDate: new Date().toISOString().slice(0, 10),
    avatar: AVATAR_PRESETS[0],
    manager: 'Marcus Vance',
    rating: 4.8,
    skills: '',
    bio: '',
    emergencyName: '',
    emergencyRelation: 'Spouse',
    emergencyPhone: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || generateNewId(),
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || '',
        department: initialData.department || 'Engineering',
        type: initialData.type || 'Full-time',
        status: initialData.status || 'Active',
        location: initialData.location || '',
        salary: initialData.salary || 100000,
        joiningDate: initialData.joiningDate || new Date().toISOString().slice(0, 10),
        avatar: initialData.avatar || AVATAR_PRESETS[0],
        manager: initialData.manager || '',
        rating: initialData.rating || 4.8,
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || ''),
        bio: initialData.bio || '',
        emergencyName: initialData.emergencyContact?.name || '',
        emergencyRelation: initialData.emergencyContact?.relation || '',
        emergencyPhone: initialData.emergencyContact?.phone || ''
      });
    } else {
      setFormData({
        id: generateNewId(),
        name: '',
        email: '',
        phone: '',
        role: '',
        department: 'Engineering',
        type: 'Full-time',
        status: 'Active',
        location: 'San Francisco, CA',
        salary: 120000,
        joiningDate: new Date().toISOString().slice(0, 10),
        avatar: AVATAR_PRESETS[0],
        manager: 'Executive Board',
        rating: 4.8,
        skills: 'React, TypeScript, Problem Solving',
        bio: '',
        emergencyName: '',
        emergencyRelation: 'Spouse',
        emergencyPhone: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.role.trim()) newErrors.role = 'Role title is required';
    if (!formData.salary || Number(formData.salary) <= 0) {
      newErrors.salary = 'Please enter a valid salary';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedPayload = {
      ...formData,
      salary: Number(formData.salary),
      rating: Number(formData.rating),
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      emergencyContact: {
        name: formData.emergencyName,
        relation: formData.emergencyRelation,
        phone: formData.emergencyPhone
      },
      leavesTaken: initialData?.leavesTaken || 2,
      totalLeaves: initialData?.totalLeaves || 24
    };

    onSave(formattedPayload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <h3>{isEditing ? `Edit Profile — ${formData.name || 'Employee'}` : 'Register New Employee'}</h3>
            <p>{isEditing ? 'Update professional information & compensation' : 'Add member to workforce directory and permissions'}</p>
          </div>
          <button className="btn-icon" onClick={onClose} id="modal-close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="modal-body">
            {/* Section 1: Personal Details */}
            <div className="form-section">
              <div className="form-section-title">
                <User size={16} /> Personal Information
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="form-input"
                    id="input-employee-name"
                  />
                  {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.74rem' }}>{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="s.jenkins@nexushr.io"
                    className="form-input"
                    id="input-employee-email"
                  />
                  {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.74rem' }}>{errors.email}</span>}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                    id="input-employee-phone"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Avatar Photo URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="form-input"
                    id="input-employee-avatar"
                  />
                </div>
              </div>

              {/* Avatar quick select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Quick Avatars:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {AVATAR_PRESETS.map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      alt="Preset" 
                      onClick={() => setFormData(prev => ({ ...prev, avatar: url }))}
                      style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        cursor: 'pointer',
                        border: formData.avatar === url ? '2px solid var(--primary)' : '1px solid var(--border-glass)',
                        opacity: formData.avatar === url ? 1 : 0.6
                      }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Professional Position */}
            <div className="form-section">
              <div className="form-section-title">
                <Briefcase size={16} /> Position & Organization
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Employee ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    disabled
                    className="form-input"
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    id="input-employee-id"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Job Title / Role <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Senior Backend Engineer"
                    className="form-input"
                    id="input-employee-role"
                  />
                  {errors.role && <span style={{ color: 'var(--danger)', fontSize: '0.74rem' }}>{errors.role}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input"
                    id="input-employee-department"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Employment Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-input"
                    id="input-employee-type"
                  >
                    {EMPLOYMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-input"
                    id="input-employee-status"
                  >
                    {STATUS_LIST.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Work Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA or Remote"
                    className="form-input"
                    id="input-employee-location"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Manager / Reports To</label>
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    placeholder="e.g. Marcus Vance"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Joining</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Compensation, Skills & Rating */}
            <div className="form-section">
              <div className="form-section-title">
                <DollarSign size={16} /> Compensation & Skills
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Annual Base Salary (USD) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="120000"
                    className="form-input"
                    id="input-employee-salary"
                  />
                  {errors.salary && <span style={{ color: 'var(--danger)', fontSize: '0.74rem' }}>{errors.salary}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Performance Rating (1.0 to 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Skills & Competencies (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Redux, Node.js, Cloud, Leadership"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Summary / Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Key contributions, background, and responsibilities..."
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Section 4: Emergency Contact */}
            <div className="form-section">
              <div className="form-section-title">
                <PhoneCall size={16} /> Emergency Contact
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input
                    type="text"
                    name="emergencyRelation"
                    value={formData.emergencyRelation}
                    onChange={handleChange}
                    placeholder="Spouse / Parent / Sibling"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 987-6543"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              id="btn-cancel-modal"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              id="btn-submit-employee"
            >
              <CheckCircle2 size={16} />
              <span>{isEditing ? 'Save Changes' : 'Create Employee Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
