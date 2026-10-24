import React from 'react';
import { Search, Plus, Download, RotateCcw, X } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  searchTerm, 
  setSearchTerm, 
  onAddEmployee, 
  onExportCSV,
  onResetData 
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Workforce Dashboard';
      case 'employees': return 'Employee Directory';
      case 'departments': return 'Department Overview';
      case 'attendance': return 'Attendance & Leave Tracker';
      case 'payroll': return 'Payroll & Compensation';
      case 'analytics': return 'Workforce Analytics';
      default: return 'Overview';
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{getTabTitle()}</h1>
      </div>

      <div className="search-box">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          placeholder="Search by name, role, email, ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="global-search-input"
        />
        {searchTerm && (
          <button 
            className="search-clear-btn" 
            onClick={() => setSearchTerm('')}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="navbar-actions">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onResetData}
          title="Reset to default demo dataset"
          id="btn-reset-demo"
        >
          <RotateCcw size={14} />
          <span>Reset Demo</span>
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onExportCSV}
          title="Export employees list to CSV"
          id="btn-export-csv"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>

        <button 
          className="btn btn-primary btn-sm"
          onClick={onAddEmployee}
          id="btn-add-employee"
        >
          <Plus size={16} />
          <span>Add Employee</span>
        </button>

        <div className="admin-badge">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
            alt="Admin" 
            className="admin-avatar" 
          />
          <div className="admin-info">
            <span className="admin-name">Admin Portal</span>
            <span className="admin-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
