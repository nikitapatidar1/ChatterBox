import React from 'react';
import './StatusModal.css';

const StatusModal = ({ isOpen, onClose, status, message }) => {
  if (!isOpen) return null;

  let statusIcon = '';
  let statusClass = '';

  switch (status) {
    case 'success':
      statusIcon = '✓';
      statusClass = 'status-success';
      break;
    case 'error':
      statusIcon = '✕';
      statusClass = 'status-error';
      break;
    case 'warning':
      statusIcon = '⚠';
      statusClass = 'status-warning';
      break;
    default:
      statusIcon = 'ⓘ';
      statusClass = 'status-info';
  }

  return (
    <div className="modal-overlay">
      <div className={`status-modal ${statusClass}`}>
        <div className="status-icon">{statusIcon}</div>
        <div className="status-message">{message}</div>
        <button className="status-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default StatusModal;