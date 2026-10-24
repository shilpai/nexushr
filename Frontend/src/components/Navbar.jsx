import React from 'react';
import { Search, Plus, Download, RotateCcw, X, LogOut } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  searchTerm, 
  setSearchTerm, 
  onAddEmployee, 
  onExportCSV,
  onResetData,
  dbStatus = 'online',
  currentUser,
  onLogout
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
        <div 
          className={`db-status-pill ${dbStatus === 'online' ? 'status-online' : dbStatus === 'connecting' ? 'status-connecting' : 'status-offline'}`}
          title={dbStatus === 'online' ? 'Connected to live TiDB Cloud Serverless MySQL on Vercel' : 'Running in local cache mode'}
        >
          <span className="status-dot"></span>
          <span className="status-text">
            {dbStatus === 'online' ? 'TiDB Cloud Live' : dbStatus === 'connecting' ? 'Connecting DB...' : 'Local Cache'}
          </span>
        </div>
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

        <div 
          className="admin-badge" 
          onClick={onLogout}
          title="Click to Sign Out"
          style={{ cursor: 'pointer' }}
          id="navbar-user-profile"
        >
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"} 
            alt={currentUser?.name || "Admin"} 
            className="admin-avatar" 
          />
          <div className="admin-info">
            <span className="admin-name">{currentUser?.name || 'Admin Portal'}</span>
            <span className="admin-role" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{currentUser?.role || 'Super Admin'}</span>
              <LogOut size={11} style={{ opacity: 0.6 }} />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
