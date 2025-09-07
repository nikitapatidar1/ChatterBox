import React, { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../Common/SearchBar';
import './ChatList.css';

const ChatList = () => {
  const { users, currentChat, selectChat } = useChat();
  const { user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setFilteredUsers(users || []);
  }, [users]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredUsers(users || []);
      return;
    }
    
    const filtered = (users || []).filter(chatUser => 
      chatUser.name?.toLowerCase().includes(query.toLowerCase()) ||
      chatUser.email?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) { // Less than 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) { // Less than 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Add a loading state or check if user data is available
  if (!user) {
    return (
      <div className="chat-list">
        <div className="chat-list-header">
          <div className="user-profile">
            <div className="user-avatar placeholder"></div>
            <span className="user-name">Loading...</span>
          </div>
        </div>
        <div className="users-list">
          <div className="user-item placeholder">
            <div className="user-avatar placeholder"></div>
            <div className="user-info">
              <div className="user-main">
                <h4>Loading user...</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <div className="user-profile">
          <img 
            src={user.avatar || 'https://via.placeholder.com/40x40/3b5998/ffffff?text=U'} 
            alt={user.name || 'User'} 
            className="user-avatar" 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/40x40/3b5998/ffffff?text=U';
            }}
          />
          <span className="user-name">{user.name || 'User'}</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <i className="fas fa-status"></i>
          </button>
          <button className="icon-btn">
            <i className="fas fa-comment-dots"></i>
          </button>
          <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>
            <i className="fas fa-ellipsis-v"></i>
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <div className="menu-item">New group</div>
              <div className="menu-item">New broadcast</div>
              <div className="menu-item">Linked devices</div>
              <div className="menu-item">Starred messages</div>
              <div className="menu-item">Settings</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="chat-list-actions">
        <button className="action-btn active">Chats</button>
        <button className="action-btn">Status</button>
        <button className="action-btn">Calls</button>
      </div>
      
      <SearchBar onSearch={handleSearch} placeholder="Search or start new chat" />
      
      <div className="users-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(chatUser => (
            <div 
              key={chatUser._id || Math.random()} 
              className={`user-item ${currentChat && currentChat._id === chatUser._id ? 'active' : ''}`}
              onClick={() => selectChat(chatUser)}
            >
              <img 
                src={chatUser.avatar || 'https://via.placeholder.com/54x54/3b5998/ffffff?text=U'} 
                alt={chatUser.name || 'User'} 
                className="user-avatar" 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/54x54/3b5998/ffffff?text=U';
                }}
              />
              <div className="user-info">
                <div className="user-main">
                  <h4>{chatUser.name || 'Unknown User'}</h4>
                  <span className="time">{formatTime(chatUser.lastMessageTime)}</span>
                </div>
                <div className="user-secondary">
                  <p className="last-message">{chatUser.lastMessage || "Start a conversation"}</p>
                  {chatUser.unreadCount > 0 && (
                    <span className="unread-badge">{chatUser.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-users-message">
            <p>No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;