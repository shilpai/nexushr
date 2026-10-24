import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} color="var(--success)" />;
      case 'error': return <AlertTriangle size={18} color="var(--danger)" />;
      default: return <Info size={18} color="var(--info)" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          {getIcon(toast.type)}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button 
            className="btn-icon" 
            onClick={() => onDismiss(toast.id)}
            style={{ padding: '2px', color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
