import React from 'react';
import './UserStatus.css';

const UserStatus = ({ isOnline, lastSeen }) => {
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const lastSeenDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="user-status">
      {isOnline ? (
        <span className="online">Online</span>
      ) : (
        <span className="offline">Last seen {formatLastSeen(lastSeen)}</span>
      )}
    </div>
  );
};

export default UserStatus;