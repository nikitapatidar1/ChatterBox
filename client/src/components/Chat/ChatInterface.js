import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { useContacts } from '../../contexts/ContactsContext';
import ChatWindow from './ChatWindow';
import './ChatInterface.css';

const ChatInterface = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat();
  const { contacts, loading } = useContacts();
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (messageText) => {
    if (selectedContact) {
      sendMessage({
        text: messageText,
        receiver:  selectedContact.phone,
        timestamp: new Date()
      });
    }
  };

  if (loading) {
    return (
      <div className="whatsapp-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="whatsapp-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="avatar">
              {user && user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <h2>Your Chats</h2>
          </div>
          <div className="sidebar-icons">
            <i className="fas fa-status"></i>
            <i className="fas fa-comment-alt"></i>
            <i className="fas fa-ellipsis-v"></i>
          </div>
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search or start new chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="contacts-list">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div 
                key={contact._id} 
                className={`contact ${selectedContact && selectedContact._id === contact._id ? 'active' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="contact-avatar">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} />
                  ) : (
                    <span>{contact.name ? contact.name.charAt(0).toUpperCase() : 'C'}</span>
                  )}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name || 'Unknown Contact'}</div>
                  <div className="contact-message">{contact.lastMessage || 'Start a conversation'}</div>
                </div>
                <div className="contact-meta">
                  <div className="contact-time">{contact.lastMessageTime || ''}</div>
                  {contact.unreadCount > 0 && (
                    <div className="message-count">{contact.unreadCount}</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-contacts">
              <i className="fas fa-users"></i>
              <p>No contacts found</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="chat-area">
        {selectedContact ? (
          <ChatWindow 
            contact={selectedContact}
            messages={messages.filter(m => 
              m && (
                (m.sender === user.phone && m.receiver === selectedContact.phone) ||
                (m.sender === selectedContact.phone && m.receiver === user.phone)
              )
            )}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <i className="fas fa-comments"></i>
              <h3>Select a chat to start messaging</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;