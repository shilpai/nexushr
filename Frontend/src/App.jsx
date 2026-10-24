import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import EmployeeList from './components/EmployeeList';
import EmployeeModal from './components/EmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import DepartmentView from './components/DepartmentView';
import AttendanceView from './components/AttendanceView';
import PayrollView from './components/PayrollView';
import AnalyticsView from './components/AnalyticsView';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';

import { initialEmployees } from './data/initialEmployees';
import './styles/App.css';

const LOCAL_STORAGE_KEY = 'nexushr_employees_v1';
const THEME_STORAGE_KEY = 'nexushr_theme_v1';

export default function App() {
  // Theme management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Employees data
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading employees from localStorage:', e);
    }
    return initialEmployees;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
    } catch (e) {
      console.error('Error saving employees to localStorage:', e);
    }
  }, [employees]);

  // App Navigation & Search
  const [activeTab, setActiveTab] = useState('employees'); // 'dashboard', 'employees', 'departments', 'attendance', 'payroll', 'analytics'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Popups
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // CRUD Operations
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (savedData) => {
    if (editingEmployee) {
      // Update
      setEmployees(prev => prev.map(e => e.id === savedData.id ? savedData : e));
      showToast(`Updated record for ${savedData.name}`, 'success');
      // If we are currently viewing this employee in the detail modal, update it
      if (viewingEmployee && viewingEmployee.id === savedData.id) {
        setViewingEmployee(savedData);
      }
    } else {
      // Add
      setEmployees(prev => [savedData, ...prev]);
      showToast(`Added ${savedData.name} to the workforce directory!`, 'success');
    }
  };

  const handleDeleteEmployee = (employee) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Employee Record',
      message: `Are you sure you want to permanently delete the profile of "${employee.name}" (${employee.id})? This action cannot be reversed.`,
      onConfirm: () => {
        setEmployees(prev => prev.filter(e => e.id !== employee.id));
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        if (viewingEmployee?.id === employee.id) {
          setViewingEmployee(null);
        }
        showToast(`Employee record for ${employee.name} was removed.`, 'info');
      }
    });
  };

  const handleBulkDelete = (ids, clearSelectionCallback) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${ids.length} Employee Records`,
      message: `Are you sure you want to delete ${ids.length} selected employee profiles? This action cannot be undone.`,
      onConfirm: () => {
        setEmployees(prev => prev.filter(e => !ids.includes(e.id)));
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        if (clearSelectionCallback) clearSelectionCallback();
        showToast(`Deleted ${ids.length} employee records.`, 'info');
      }
    });
  };

  const handleUpdateEmployeeStatus = (employeeId, newStatus) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === employeeId) {
        return { ...e, status: newStatus };
      }
      return e;
    }));
  };

  const handleResetData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset to Sample Data',
      message: 'This will reset all employee records back to the default initial enterprise dataset. Any unsaved custom records will be replaced.',
      onConfirm: () => {
        setEmployees(initialEmployees);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialEmployees));
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        showToast('Workforce directory reset to initial demo dataset.', 'success');
      }
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'Employee ID',
      'Full Name',
      'Email',
      'Phone',
      'Job Title',
      'Department',
      'Work Type',
      'Status',
      'Location',
      'Annual Base Salary',
      'Performance Rating',
      'Date of Joining'
    ];

    const rows = employees.map(e => [
      `"${e.id}"`,
      `"${e.name}"`,
      `"${e.email}"`,
      `"${e.phone || ''}"`,
      `"${e.role}"`,
      `"${e.department}"`,
      `"${e.type}"`,
      `"${e.status}"`,
      `"${e.location || ''}"`,
      e.salary || 0,
      e.rating || 0,
      `"${e.joiningDate || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nexushr_workforce_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported complete employee directory to CSV!', 'success');
  };

  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('All');

  const handleSelectDepartment = (deptName) => {
    setSelectedDepartmentFilter(deptName);
    setActiveTab('employees');
  };

  return (
    <div className="app-container">
      {/* Left Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme}
        employeeCount={employees.length}
      />

      {/* Main App Canvas */}
      <div className="main-wrapper">
        <Navbar 
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddEmployee={handleOpenAddModal}
          onExportCSV={handleExportCSV}
          onResetData={handleResetData}
        />

        <main className="page-container">
          {/* Universal Stats Overview */}
          <StatsOverview employees={employees} />

          {/* Active Tab View Rendering */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
                    Quick Directory Overview
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                    Live pulse of active staff, department assignments, and quick actions.
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('employees')}>
                  Open Full Directory →
                </button>
              </div>

              <EmployeeList 
                employees={employees}
                searchTerm={searchTerm}
                onViewEmployee={setViewingEmployee}
                onEditEmployee={handleOpenEditModal}
                onDeleteEmployee={handleDeleteEmployee}
                onBulkDelete={handleBulkDelete}
                onAddEmployee={handleOpenAddModal}
                initialDepartment={selectedDepartmentFilter}
              />
            </div>
          )}

          {activeTab === 'employees' && (
            <EmployeeList 
              key={selectedDepartmentFilter}
              employees={employees}
              searchTerm={searchTerm}
              onViewEmployee={setViewingEmployee}
              onEditEmployee={handleOpenEditModal}
              onDeleteEmployee={handleDeleteEmployee}
              onBulkDelete={handleBulkDelete}
              onAddEmployee={handleOpenAddModal}
              initialDepartment={selectedDepartmentFilter}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentView 
              employees={employees} 
              onSelectDepartment={handleSelectDepartment} 
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView 
              employees={employees} 
              onUpdateEmployeeStatus={handleUpdateEmployeeStatus}
              showToast={showToast}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollView employees={employees} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView employees={employees} />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
        existingEmployees={employees}
      />

      <EmployeeDetailModal 
        isOpen={Boolean(viewingEmployee)}
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteEmployee}
      />

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
      />

      {/* Interactive Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
