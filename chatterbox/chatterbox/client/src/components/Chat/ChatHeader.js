// import React, { useState } from "react";
// import { useContacts } from "../../contexts/ContactsContext";
// import { FaEllipsisV } from "react-icons/fa";

// const ChatHeader = ({ currentContact }) => {
//   const { deleteContact } = useContacts();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleDelete = () => {
//     if (currentContact) {
//       deleteContact(currentContact.id);
//       alert(`${currentContact.name} deleted`);
//     }
//     setMenuOpen(false);
//   };

//   return (
//     <div className="chat-header">
//       <div className="chat-info">
//         <h3>{currentContact?.name || "No Contact"}</h3>
//         <span>{currentContact ? "Online" : "Offline"}</span>
//       </div>

//       <div className="chat-menu">
//         <button onClick={() => setMenuOpen(!menuOpen)} className="menu-btn">
//           <FaEllipsisV />
//         </button>

//         {menuOpen && (
//           <div className="dropdown-menu">
//             <button onClick={handleDelete}>Delete Contact</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;

import React, { useState, useRef, useEffect } from "react";

const ChatHeader = ({ currentContact, onDeleteContact }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete ${currentContact.name}?`)
    ) {
      onDeleteContact(currentContact.id);
    }
    setMenuOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        backgroundColor: "#f5f5f5",
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 0.25rem 0" }}>
          {currentContact?.name || "No Contact"}
        </h3>
        <span style={{ fontSize: "0.85rem", color: "#666" }}>
          {currentContact ? "Online" : "Offline"}
        </span>
      </div>

      <div
        ref={menuRef}
        style={{ position: "relative", display: "inline-block" }}
      >
        <button
          onClick={handleMenuClick}
          style={{
            fontSize: "1.5rem",
            cursor: "pointer",
            border: "none",
            background: "transparent",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
          }}
        >
          ⋮
        </button>

        <button onClick={() => console.log("3-dot clicked")}>⋮</button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              width: "150px",
              zIndex: 1000,
              marginTop: "5px",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseOver={(e) => (e.target.style.background = "#f0f0f0")}
              onMouseOut={(e) => (e.target.style.background = "white")}
            >
              View Profile
            </div>
            <div
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseOver={(e) => (e.target.style.background = "#f0f0f0")}
              onMouseOut={(e) => (e.target.style.background = "white")}
            >
              Mute Notifications
            </div>
            <div
              onClick={handleDelete}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                color: "#e74c3c",
              }}
              onMouseOver={(e) => (e.target.style.background = "#ffe6e6")}
              onMouseOut={(e) => (e.target.style.background = "white")}
            >
              Delete Contact
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Test component to see if it works
const TestApp = () => {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Nikita Patidar" },
    { id: 2, name: "John Doe" },
  ]);
  const [currentContact, setCurrentContact] = useState(contacts[0]);

  const handleDeleteContact = (contactId) => {
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    setContacts(updatedContacts);

    if (currentContact.id === contactId) {
      setCurrentContact(updatedContacts[0] || null);
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "50px auto",
        border: "1px solid #ddd",
        position: "relative",
      }}
    >
      <ChatHeader
        currentContact={currentContact}
        onDeleteContact={handleDeleteContact}
      />

      <div style={{ padding: "20px" }}>
        <h3>Contacts List:</h3>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            style={{
              margin: "10px 0",
              padding: "10px",
              backgroundColor:
                currentContact.id === contact.id ? "#f0f0f0" : "white",
              cursor: "pointer",
            }}
            onClick={() => setCurrentContact(contact)}
          >
            {contact.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestApp;
