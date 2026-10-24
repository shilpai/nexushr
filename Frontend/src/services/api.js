/**
 * NexusHR Backend API Integration Client
 * Connects frontend to the Modular Monolith Backend API on http://localhost:5000
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const ApiClient = {
  // Employee endpoints
  employees: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/employees?${query}`);
      return res.json();
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`);
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    },
    bulkDelete: async (ids) => {
      const res = await fetch(`${API_BASE_URL}/employees/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      return res.json();
    },
    getStats: async () => {
      const res = await fetch(`${API_BASE_URL}/employees/stats`);
      return res.json();
    }
  },

  // Department endpoints
  departments: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/departments`);
      return res.json();
    }
  },

  // Leave endpoints (HRMS)
  leaves: {
    getRequests: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/leaves/requests?${query}`);
      return res.json();
    },
    approve: async (id) => {
      const res = await fetch(`${API_BASE_URL}/leaves/requests/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      return res.json();
    },
    reject: async (id) => {
      const res = await fetch(`${API_BASE_URL}/leaves/requests/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      return res.json();
    }
  },

  // Attendance & Payroll endpoints
  attendance: {
    getRoster: async (date) => {
      const res = await fetch(`${API_BASE_URL}/attendance/roster?date=${date || ''}`);
      return res.json();
    }
  },
  payroll: {
    getSummary: async () => {
      const res = await fetch(`${API_BASE_URL}/payroll/summary`);
      return res.json();
    },
    getLedger: async () => {
      const res = await fetch(`${API_BASE_URL}/payroll/ledger`);
      return res.json();
    }
  }
};

export default ApiClient;
