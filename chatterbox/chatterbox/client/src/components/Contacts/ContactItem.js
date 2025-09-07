// import React from 'react';
// import './ContactItem.css';

// const ContactItem = ({ contact, isSelected, onSelect }) => {
//   return (
//     <div 
//       className={`contact ${isSelected ? 'active' : ''}`}
//       onClick={() => onSelect(contact)}
//     >
//       <div className="contact-avatar">
//         {contact.avatar ? (
//           <img src={contact.avatar} alt={contact.name} />
//         ) : (
//           <span>{contact.name ? contact.name.charAt(0).toUpperCase() : 'C'}</span>
//         )}
//       </div>
//       <div className="contact-info">
//         <div className="contact-name">{contact.name}</div>
//         <div className="contact-message">{contact.lastMessage || 'Start a conversation'}</div>
//       </div>
//       <div className="contact-meta">
//         <div className="contact-time">{contact.lastMessageTime || ''}</div>
//         {contact.unreadCount > 0 && (
//           <div className="message-count">{contact.unreadCount}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ContactItem;





import React, { useState } from 'react';
import { useContacts } from '../../contexts/ContactsContext';
import './ContactItem.css';

const ContactItem = ({ contact, isSelected, onSelect }) => {
  const { deleteContact } = useContacts(); // ✅ deleteContact from context
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      className={`contact ${isSelected ? 'active' : ''}`}
      onClick={() => onSelect(contact)}
    >
      <div className="contact-avatar">
        {contact.avatar ? (
          <img src={contact.avatar} alt={contact.name} />
        ) : (
          <span>{contact.name ? contact.name.charAt(0).toUpperCase() : 'C'}</span>
        )}
      </div>

      <div className="contact-info">
        <div className="contact-name">{contact.name}</div>
        <div className="contact-message">
          {contact.lastMessage || 'Start a conversation'}
        </div>
      </div>

      <div className="contact-meta">
        <div className="contact-time">{contact.lastMessageTime || ''}</div>
        {contact.unreadCount > 0 && (
          <div className="message-count">{contact.unreadCount}</div>
        )}

        {/* 3-dot options */}
        <div
          className="contact-options"
          onClick={(e) => {
            e.stopPropagation(); // stop selection
            setShowMenu((prev) => !prev);
          }}
        >
          <i className="fas fa-ellipsis-v"></i>

          {showMenu && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteContact(contact._id);
                  setShowMenu(false);
                }}
              >
                <i className="fas fa-trash"></i> Delete
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
