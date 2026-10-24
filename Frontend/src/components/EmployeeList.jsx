import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  Table as TableIcon, 
  Eye, 
  Edit3, 
  Trash2, 
  Inbox,
  Download
} from 'lucide-react';
import EmployeeCard from './EmployeeCard';
import { DEPARTMENTS, EMPLOYMENT_TYPES, STATUS_LIST } from '../data/initialEmployees';

export default function EmployeeList({ 
  employees, 
  searchTerm, 
  onViewEmployee, 
  onEditEmployee, 
  onDeleteEmployee, 
  onBulkDelete,
  onAddEmployee,
  initialDepartment = 'All'
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedDept, setSelectedDept] = useState(initialDepartment);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter & Sort Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(query);
        const matchesEmail = emp.email.toLowerCase().includes(query);
        const matchesRole = emp.role.toLowerCase().includes(query);
        const matchesId = emp.id.toLowerCase().includes(query);
        const matchesLocation = emp.location?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesRole && !matchesId && !matchesLocation) {
          return false;
        }
      }

      // Department
      if (selectedDept !== 'All' && emp.department !== selectedDept) {
        return false;
      }

      // Status
      if (selectedStatus !== 'All' && emp.status !== selectedStatus) {
        return false;
      }

      // Employment Type
      if (selectedType !== 'All' && emp.type !== selectedType) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'salary-desc') return (Number(b.salary) || 0) - (Number(a.salary) || 0);
      if (sortBy === 'salary-asc') return (Number(a.salary) || 0) - (Number(b.salary) || 0);
      if (sortBy === 'rating-desc') return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      if (sortBy === 'date-desc') return new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime();
      return 0;
    });
  }, [employees, searchTerm, selectedDept, selectedStatus, selectedType, sortBy]);

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleExportSelected = () => {
    const selectedList = employees.filter(e => selectedIds.includes(e.id));
    if (selectedList.length === 0) return;

    const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Type', 'Status', 'Location', 'Salary', 'JoiningDate'];
    const csvContent = [
      headers.join(','),
      ...selectedList.map(e => [
        `"${e.id}"`,
        `"${e.name}"`,
        `"${e.email}"`,
        `"${e.role}"`,
        `"${e.department}"`,
        `"${e.type}"`,
        `"${e.status}"`,
        `"${e.location || ''}"`,
        e.salary,
        `"${e.joiningDate || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `selected_employees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const clearAllFilters = () => {
    setSelectedDept('All');
    setSelectedStatus('All');
    setSelectedType('All');
    setSortBy('name-asc');
  };

  const isAllSelected = filteredEmployees.length > 0 && selectedIds.length === filteredEmployees.length;

  return (
    <div className="employee-list-section">
      {/* Controls Bar */}
      <div className="controls-bar">
        {/* Department Pills */}
        <div className="department-pills">
          <button 
            className={`dept-pill ${selectedDept === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedDept('All')}
          >
            All Departments ({employees.length})
          </button>
          {DEPARTMENTS.map(dept => {
            const count = employees.filter(e => e.department === dept).length;
            return (
              <button
                key={dept}
                className={`dept-pill ${selectedDept === dept ? 'active' : ''}`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>

        {/* Row with Dropdowns & View Mode */}
        <div className="controls-row-main">
          <div className="controls-left">
            <select 
              className="filter-select" 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              id="filter-status"
            >
              <option value="All">All Statuses</option>
              {STATUS_LIST.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select 
              className="filter-select" 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              id="filter-type"
            >
              <option value="All">All Work Types</option>
              {EMPLOYMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select 
              className="filter-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              id="filter-sort"
            >
              <option value="name-asc">Sort: Name (A to Z)</option>
              <option value="name-desc">Sort: Name (Z to A)</option>
              <option value="salary-desc">Sort: Salary (Highest)</option>
              <option value="salary-asc">Sort: Salary (Lowest)</option>
              <option value="rating-desc">Sort: Top Rating</option>
              <option value="date-desc">Sort: Recently Joined</option>
            </select>

            {(selectedDept !== 'All' || selectedStatus !== 'All' || selectedType !== 'All') && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={clearAllFilters}
                title="Reset filters"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredEmployees.length}</strong> of {employees.length}
            </span>

            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
                id="view-toggle-table"
              >
                <TableIcon size={16} />
                <span>Table</span>
              </button>
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
                id="view-toggle-grid"
              >
                <LayoutGrid size={16} />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Selection Banner */}
      {selectedIds.length > 0 && (
        <div className="bulk-bar animate-fade-in">
          <div className="bulk-count">
            <span style={{ fontSize: '1rem' }}>✓</span>
            <span>{selectedIds.length} employee{selectedIds.length > 1 ? 's' : ''} selected</span>
          </div>

          <div className="bulk-actions">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleExportSelected}
              id="btn-bulk-export"
            >
              <Download size={14} />
              <span>Export Selected</span>
            </button>
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={() => onBulkDelete(selectedIds, () => setSelectedIds([]))}
              id="btn-bulk-delete"
            >
              <Trash2 size={14} />
              <span>Delete Selected</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedIds([])}
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Main Employee Content */}
      {filteredEmployees.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Inbox size={28} />
          </div>
          <h4>No employees match your search criteria</h4>
          <p>Try refining or clearing your filters, or create a new employee profile to expand your workforce.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={clearAllFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary btn-sm" onClick={onAddEmployee}>
              Add Employee
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                    title="Select all"
                  />
                </th>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Role & Type</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const isSelected = selectedIds.includes(emp.id);
                return (
                  <tr key={emp.id} className={isSelected ? 'selected-row' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleToggleSelect(emp.id)}
                        style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                    </td>
                    <td>
                      <div className="user-cell">
                        <img 
                          src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=6366f1&color=fff`} 
                          alt={emp.name} 
                          className="table-avatar"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=6366f1&color=fff`;
                          }}
                        />
                        <div className="user-cell-meta">
                          <span className="user-cell-name" onClick={() => onViewEmployee(emp)}>
                            {emp.name}
                          </span>
                          <span className="user-cell-email">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="emp-id-tag">{emp.id}</span>
                    </td>
                    <td>
                      <span className="dept-badge">{emp.department}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{emp.role}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{emp.type}</div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {emp.location || 'Remote'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>{formatCurrency(emp.salary)}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusClass(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => onViewEmployee(emp)}
                          title="View Profile"
                          id={`table-view-${emp.id}`}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => onEditEmployee(emp)}
                          title="Edit Employee"
                          id={`table-edit-${emp.id}`}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => onDeleteEmployee(emp)}
                          title="Delete Employee"
                          style={{ color: 'var(--danger)' }}
                          id={`table-delete-${emp.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredEmployees.map((emp) => (
            <EmployeeCard 
              key={emp.id}
              employee={emp}
              isSelected={selectedIds.includes(emp.id)}
              onToggleSelect={handleToggleSelect}
              onView={onViewEmployee}
              onEdit={onEditEmployee}
              onDelete={onDeleteEmployee}
            />
          ))}
        </div>
      )}
    </div>
  );
}
