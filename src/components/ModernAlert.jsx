import React from 'react';
import './ModernAlert.css';

const ModernAlert = ({ isOpen, onClose, onConfirm, title, message, type = 'confirm' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <i className="fa-solid fa-circle-check"></i>;
      case 'error': return <i className="fa-solid fa-circle-xmark"></i>;
      case 'warning': return <i className="fa-solid fa-triangle-exclamation"></i>;
      default: return <i className="fa-solid fa-circle-question"></i>;
    }
  };

  return (
    <div className="modern-alert-overlay">
      <div className="modern-alert-modal">
        <div className={`alert-icon-container ${type}`}>
          {getIcon()}
        </div>
        <h3 className="alert-title">{title}</h3>
        <p className="alert-message">{message}</p>
        <div className="alert-buttons">
          {type === 'confirm' ? (
            <>
              <button className="btn-cancel" onClick={onClose}>Cancel</button>
              <button className="btn-confirm" onClick={onConfirm}>Confirm</button>
            </>
          ) : (
            <button className="btn-ok" onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernAlert;