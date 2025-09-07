// import React, { useState } from 'react';
// import { useContacts } from '../../contexts/ContactsContext';
// import './AddContactModal.css';

// const AddContactModal = ({ isOpen, onClose }) => {
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const { addContact } = useContacts();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addContact({ name, phone, email });
//       setName('');
//       setPhone('');
//       setEmail('');
//       onClose();
//     } catch (error) {
//       console.error('Error adding contact:', error);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Add New Contact</h2>
//           <button className="close-btn" onClick={onClose}>
//             <i className="fas fa-times"></i>
//           </button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Phone</label>
//             <input
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Email (Optional)</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="modal-actions">
//             <button type="button" onClick={onClose}>Cancel</button>
//             <button type="submit">Add Contact</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddContactModal;







// src/components/Chat/AddContactModal.jsx
import React, { useState } from "react";
import { useContacts } from "../../contexts/ContactsContext";
import "./AddContactModal.css";

const AddContactModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { addContact } = useContacts();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saved = await addContact({ name, phone, email });
      console.log("✅ Saved contact:", saved);
      setName(""); setPhone(""); setEmail("");
      onClose();
    } catch (err) {
      console.error("❌ Add contact failed:", err);
      alert(err.message || "Failed to add contact");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Contact</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email (Optional)</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add Contact</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;
