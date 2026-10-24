import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Building2, 
  CalendarClock, 
  Banknote, 
  BarChart3, 
  Sun, 
  Moon, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, theme, toggleTheme, employeeCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: employeeCount },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'attendance', label: 'Attendance & Leaves', icon: CalendarClock },
    { id: 'payroll', label: 'Payroll & Comp', icon: Banknote },
    { id: 'analytics', label: 'Workforce Insights', icon: BarChart3 },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon-box">
          <Sparkles size={22} />
        </div>
        <div className="brand-text">
          <h2>NexusHR</h2>
          <span>
            <span className="status-dot-green"></span>
            Enterprise Core v2.4
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Workforce Management</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              id={`nav-item-${item.id}`}
            >
              <div className="nav-item-content">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="workspace-card">
          <div className="workspace-card-title">
            <span>Workspace Sync</span>
            <ShieldCheck size={14} color="#10b981" />
          </div>
          <div className="workspace-card-stat">Encrypted & Live</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>
            Auto-saved locally
          </div>
        </div>

        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
          id="theme-toggle-button"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={16} />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
