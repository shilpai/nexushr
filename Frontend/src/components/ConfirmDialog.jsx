import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Delete', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content animate-scale-in" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '440px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'var(--danger-bg)', 
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{title}</h3>
          </div>
          <button className="btn-icon" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {message}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onCancel} id="btn-cancel-confirm">
            {cancelText}
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={onConfirm} id="btn-accept-confirm">
            <Trash2 size={14} />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
