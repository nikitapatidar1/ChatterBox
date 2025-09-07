


import React from 'react';
import ContactItem from './ContactItem';
import './ContactsList.css';

const ContactsList = ({ contacts, selectedContact, onContactSelect }) => {
  return (
    <div className="contacts-list">
      {contacts.map(contact => (
        <ContactItem
          key={contact._id}
          contact={contact}
          isSelected={selectedContact && selectedContact._id === contact._id}
          onSelect={onContactSelect}
        />
      ))}
    </div>
  );
};

export default ContactsList;









