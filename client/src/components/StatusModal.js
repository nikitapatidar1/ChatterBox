import React from 'react';
import './StatusModal.css';

const StatusModal = ({ onClose }) => {
  const statusOptions = [
    { text: 'Online', value: 'online' },
    { text: 'Busy', value: 'busy' },
    { text: 'Away', value: 'away' },
    { text: 'Offline', value: 'offline' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="status-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Set Status</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-content">
          {statusOptions.map(option => (
            <div key={option.value} className="status-option">
              <input 
                type="radio" 
                id={option.value} 
                name="status" 
                value={option.value}
              />
              <label htmlFor={option.value}>{option.text}</label>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;