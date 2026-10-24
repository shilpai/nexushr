/**
 * NexusHR Backend API Integration Client
 * Connects frontend to the Live Modular Monolith Backend API on Vercel & TiDB Cloud
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nexushr-sandy.vercel.app/api/v1';

export const ApiClient = {
  // Base URL reference
  baseUrl: API_BASE_URL,

  // Health check
  health: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (err) {
      console.warn('Health check failed:', err);
      return { status: 'offline', error: err.message };
    }
  },

  // Employee endpoints
  employees: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/employees${query ? `?${query}` : ''}`);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const json = await res.json();
      return json.data || [];
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch employee: HTTP ${res.status}`);
      }
      const json = await res.json();
      return json.data;
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to create employee record');
      }
      return json.data;
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to update employee record');
      }
      return json.data;
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to delete employee record');
      }
      return json;
    },

    bulkDelete: async (ids) => {
      const res = await fetch(`${API_BASE_URL}/employees/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to bulk delete employees');
      }
      return json;
    },

    getStats: async () => {
      const res = await fetch(`${API_BASE_URL}/employees/stats`);
      const json = await res.json();
      return json.data;
    }
  },

  // Department endpoints
  departments: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/departments`);
      const json = await res.json();
      return json.data || [];
    }
  },

  // Leave endpoints (HRMS)
  leaves: {
    getRequests: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/leaves/requests${query ? `?${query}` : ''}`);
      const json = await res.json();
      return json.data || [];
    },
    approve: async (id) => {
      const res = await fetch(`${API_BASE_URL}/leaves/requests/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    },
    reject: async (id) => {
      const res = await fetch(`${API_BASE_URL}/leaves/requests/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    }
  },

  // Attendance & Payroll endpoints
  attendance: {
    getRoster: async (date) => {
      const res = await fetch(`${API_BASE_URL}/attendance/roster?date=${date || ''}`);
      const json = await res.json();
      return json.data || [];
    }
  },

  payroll: {
    getSummary: async () => {
      const res = await fetch(`${API_BASE_URL}/payroll/summary`);
      const json = await res.json();
      return json.data;
    },
    getLedger: async () => {
      const res = await fetch(`${API_BASE_URL}/payroll/ledger`);
      const json = await res.json();
      return json.data || [];
    }
  }
};

export default ApiClient;
