// // src/components/Chat/WhatsAppStyleChat.js
// import React, {
//   useState,
//   useMemo,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";

// import { useAuth } from "../../contexts/AuthContext";
// import { useChat } from "../../contexts/ChatContext";
// import { useContacts } from "../../contexts/ContactsContext";
// import { useSocket } from "../../contexts/SocketContext";

// import InputArea from "./InputArea";
// import Message from "./Message";
// import "./WhatsAppStyleChat.css";

// const WhatsAppStyleChat = () => {
//   const { contacts, addContact } = useContacts();

//   const {
//     socket,
//     onlineUsers = [],
//     getMessages: socketGetMessages,
//     sendMessage: socketSendMessage,
//   } = useSocket();

//   const { user, logout } = useAuth();

//   // ---------- Local UI State ----------
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showUserDropdown, setShowUserDropdown] = useState(false);
//   const [showAddContactModal, setShowAddContactModal] = useState(false);
//   const [contactName, setContactName] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [inputMessage, setInputMessage] = useState("");
//   const [typingPhones, setTypingPhones] = useState([]);
//   const messagesEndRef = useRef(null);

//   const { messages, setMessages, selectedChat, setSelectedChat, sendMessage } =
//     useChat();

//   // ✅ Local messages state
//   // const [messages, setMessages] = useState([]);

//   const myPhone = user?.phone || null;
//   const [chatCache, setChatCache] = useState({});
//   // const { messages, setMessages, selectedChat } = useChat();

//   const isOnline = useCallback(
//     (phone) => (phone ? onlineUsers.includes(phone) : false),
//     [onlineUsers]
//   );

//   // ---------- Socket: message updates ----------
//   useEffect(() => {
//     if (!socket) return;

//     // ----------------- Helper: Upsert by tempMessageId -----------------
//     const upsertByTempId = (incoming) => {
//       if (!incoming?.tempMessageId) return false;

//       let matched = false;
//       setMessages((prev) =>
//         prev.map((m) => {
//           if (m.tempMessageId === incoming.tempMessageId) {
//             matched = true;
//             return {
//               ...m,
//               _id: incoming._id || incoming.actualMessageId || m._id,
//               status: incoming.status || m.status || "sent",
//               text: incoming.text ?? incoming.content ?? m.text,
//             };
//           }
//           return m;
//         })
//       );

//       return matched;
//     };

//     const handleNewMessage = (msg) => {
//       const normalized = {
//         ...msg,
//         chat: msg.chat?._id || msg.chat,
//         text: msg.text ?? msg.content ?? "",
//       };

//       setMessages((prev) => {
//         let updated = [...prev];

//         // 🔹 Agar tempMessageId match kare to update kar
//         if (normalized.tempMessageId) {
//           const idx = prev.findIndex(
//             (m) => m.tempMessageId === normalized.tempMessageId
//           );
//           if (idx !== -1) {
//             updated[idx] = { ...prev[idx], ...normalized };
//           } else {
//             updated = [...prev, normalized];
//           }
//         } else if (!prev.some((m) => m._id === normalized._id)) {
//           updated = [...prev, normalized];
//         }

//         // ✅ Saath me cache update kar
//         if (selectedChat?._id) {
//           setChatCache((prevCache) => ({
//             ...prevCache,
//             [selectedChat._id]: updated,
//           }));
//         }

//         return updated;
//       });
//     };

//     const onSent = ({ tempMessageId, actualMessageId, status }) => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.tempMessageId === tempMessageId
//             ? {
//                 ...m,
//                 _id: actualMessageId || m._id,
//                 status: status || "sent",
//               }
//             : m
//         )
//       );
//     };

//     const onDelivered = ({ actualMessageId, tempMessageId }) => {
//       setMessages((prev) =>
//         prev.map((m) => {
//           const match =
//             m._id === actualMessageId ||
//             (tempMessageId && m.tempMessageId === tempMessageId);
//           return match ? { ...m, status: "delivered" } : m;
//         })
//       );
//     };

//     const onRead = ({ actualMessageId, tempMessageId }) => {
//       setMessages((prev) =>
//         prev.map((m) => {
//           const match =
//             m._id === actualMessageId ||
//             (tempMessageId && m.tempMessageId === tempMessageId);
//           return match ? { ...m, status: "read" } : m;
//         })
//       );
//     };

//     socket.on("newMessage", handleNewMessage);
//     socket.on("message-sent", onSent);

//     socket.on("message-delivered", onDelivered);
//     socket.on("message:read", onRead);

//     return () => {
//       socket.off("newMessage", handleNewMessage);

//       socket.off("message:sent", onSent);

//       socket.off("message:delivered", onDelivered);

//       socket.off("message:read", onRead);
//     };
//   }, [socket]);

//   // ---------- Derived chat messages ----------
//   const chatMessages = useMemo(() => {
//     if (!user) return [];

//     if (selectedChat?._id) {
//       return (messages || []).filter(
//         (m) => m.chat === selectedChat._id || m.chatId === selectedChat._id
//       );
//     }
//     if (!selectedContact) return [];
//     const contactPhone = selectedContact.phone;
//     return (messages || []).filter((m) => {
//       const sender = m.senderPhone || m.sender || m.senderId;
//       const recv = m.receiverPhone || m.receiver || m.receiverId;
//       return (
//         (sender === myPhone && recv === contactPhone) ||
//         (sender === contactPhone && recv === myPhone)
//       );
//     });
//   }, [messages, selectedContact, myPhone, selectedChat?._id, user]);

//   // ---------- UI Toggles ----------
//   const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);
//   const toggleUserDropdown = useCallback(
//     () => setShowUserDropdown((s) => !s),
//     []
//   );
//   const handleLogout = useCallback(() => {
//     logout?.();
//     setShowUserDropdown(false);
//   }, [logout]);

//   // ---------- Send ----------
//   const handleSendMessage = () => {
//     const text = (inputMessage || "").trim();
//     if (!text) return;

//     const chatId = selectedChat?._id;
//     const receiverPhone = selectedContact?.phone;

//     const tempId = `temp-${Date.now()}`;
//     const tempMsg = {
//       _id: tempId,
//       tempMessageId: tempId,
//       chat: chatId,
//       text,
//       receiverPhone,
//       senderPhone: myPhone,
//       status: "sending",
//       createdAt: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, tempMsg]);

//     socketSendMessage(chatId, text, receiverPhone, tempId);

//     setInputMessage("");
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleTyping = useCallback(() => {
//     if (!socket || !selectedContact) return;
//     socket.emit("typing", { receiverPhone: selectedContact.phone });
//   }, [socket, selectedContact]);

//   // ---------- Add Contact ----------
//   const handleAddContact = useCallback(async () => {
//     const name = contactName.trim();
//     const phone = contactNumber.trim();
//     if (!name || !phone) return;

//     await addContact?.({ name, phone });
//     setContactName("");
//     setContactNumber("");
//     setShowAddContactModal(false);
//   }, [addContact, contactName, contactNumber]);

//   // ---------- Socket: user online & typing ----------
//   useEffect(() => {
//     if (!socket || !myPhone) return;
//     socket.emit("user-online", myPhone);
//   }, [socket, myPhone]);

//   useEffect(() => {
//     if (!socket) return;
//     const onTyping = ({ from }) => {
//       if (!from) return;
//       setTypingPhones((prev) => (prev.includes(from) ? prev : [...prev, from]));
//       setTimeout(() => {
//         setTypingPhones((prev) => prev.filter((p) => p !== from));
//       }, 2000);
//     };

//     socket.on("typing", onTyping);
//     return () => socket.off("typing", onTyping);
//   }, [socket]);

//   const renderMessageStatus = useCallback(
//     (m) => {
//       const sender = m.senderPhone || m.sender || m.senderId;
//       if (sender !== myPhone) return null;

//       const icon = (node) => <span className="message-status">{node}</span>;
//       switch (m.status) {
//         case "sending":
//         case "pending":
//           return icon(<i className="fas fa-clock" style={{ color: "#999" }} />);
//         case "sent":
//           return icon(<i className="fas fa-check" style={{ color: "#999" }} />);
//         case "delivered":
//           return icon(
//             <>
//               <i className="fas fa-check" />
//               <i className="fas fa-check" />
//             </>
//           );
//         case "read":
//           return icon(
//             <>
//               <i className="fas fa-check" style={{ color: "#4fc3f7" }} />
//               <i className="fas fa-check" style={{ color: "#4fc3f7" }} />
//             </>
//           );
//         case "error":
//           return icon(
//             <i
//               className="fas fa-exclamation-circle"
//               style={{ color: "#e74c3c" }}
//             />
//           );
//         default:
//           return icon(
//             <i className="fas fa-question-circle" style={{ color: "red" }} />
//           );
//       }
//     },
//     [myPhone]
//   );

//   const isSelectedTyping =
//     !!selectedContact && typingPhones.includes(selectedContact.phone);

//   // ---------- JSX (unchanged) ----------
//   // ---------- JSX ----------
//   return (
//     <div className={`whatsapp-container ${darkMode ? "dark-mode" : ""}`}>
//       {/* ===== Sidebar ===== */}
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <div className="user-info">
//             <div className="avatar">
//               {user?.avatar ? (
//                 <img src={user.avatar} alt={user?.name || "Me"} />
//               ) : (
//                 <span>{(user?.name || "U").charAt(0).toUpperCase()}</span>
//               )}
//             </div>
//             <h2>ChatterBox</h2>
//           </div>

//           <div className="sidebar-icons">
//             <button className="theme-toggle-btn" onClick={toggleDarkMode}>
//               {darkMode ? (
//                 <i className="fas fa-sun" />
//               ) : (
//                 <i className="fas fa-moon" />
//               )}
//             </button>

//             <i
//               className="fas fa-user-plus"
//               title="Add Contact"
//               onClick={() => setShowAddContactModal(true)}
//               role="button"
//               tabIndex={0}
//             />

//             <div className="user-dropdown">
//               <i
//                 className="fas fa-ellipsis-v dropdown-toggle"
//                 onClick={toggleUserDropdown}
//                 role="button"
//                 tabIndex={0}
//                 aria-label="Open menu"
//               />
//               {showUserDropdown && (
//                 <div className="dropdown-menu">
//                   <div
//                     className="dropdown-item"
//                     onClick={() => setShowUserDropdown(false)}
//                   >
//                     <i className="fas fa-user" /> Profile
//                   </div>
//                   <div
//                     className="dropdown-item"
//                     onClick={() => setShowUserDropdown(false)}
//                   >
//                     <i className="fas fa-cog" /> Settings
//                   </div>
//                   <div className="dropdown-item" onClick={handleLogout}>
//                     <i className="fas fa-sign-out-alt" /> Logout
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="search-container">
//           <div className="search-box">
//             <i className="fas fa-search" />
//             <input type="text" placeholder="Search or start new chat" />
//           </div>
//         </div>

//         <div className="contacts-list">
//           {contacts.map((contact, index) => {
//             const key =
//               contact._id ||
//               contact.id ||
//               contact.phone ||
//               `${contact.phone}-${index}`;

//             const active =
//               selectedContact &&
//               (selectedContact._id === contact._id ||
//                 selectedContact.phone === contact.phone);

//             return (
//               <div
//                 key={key}
//                 className={`contact ${active ? "active" : ""}`}
//                 onClick={() => {
//                   setSelectedContact(contact);
//                   setSelectedChat({
//                     _id: contact.chatId || contact._id,
//                     ...contact,
//                   });
//                 }}
//                 role="button"
//                 tabIndex={0}
//               >
//                 <div className="contact-avatar">
//                   {contact.avatar ? (
//                     <img src={contact.avatar} alt={contact.name} />
//                   ) : (
//                     <span>{(contact.name || "C").charAt(0).toUpperCase()}</span>
//                   )}
//                   {isOnline(contact.phone) && (
//                     <span className="online-indicator" />
//                   )}
//                 </div>

//                 <div className="contact-info">
//                   <div className="contact-name">
//                     {contact.name || contact.phone}
//                   </div>
//                   <div className="contact-message">
//                     {contact.lastMessage || "Start a conversation"}
//                   </div>
//                 </div>

//                 <div className="contact-meta">
//                   <div className="contact-time">
//                     {contact.lastMessageTime || ""}
//                   </div>
//                   {contact.unreadCount > 0 && (
//                     <div className="message-count">{contact.unreadCount}</div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ===== Chat Area ===== */}
//       <div className="chat-area">
//         {selectedContact ? (
//           <>
//             {/* Header */}
//             <div className="chat-header">
//               <div className="chat-info">
//                 <div className="avatar">
//                   {selectedContact.avatar ? (
//                     <img
//                       src={selectedContact.avatar}
//                       alt={selectedContact.name}
//                     />
//                   ) : (
//                     <span>
//                       {(selectedContact.name || "C").charAt(0).toUpperCase()}
//                     </span>
//                   )}
//                   {isOnline(selectedContact.phone) && (
//                     <span className="online-indicator" />
//                   )}
//                 </div>
//                 <div>
//                   <div className="contact-name">
//                     {selectedContact.name || selectedContact.phone}
//                   </div>
//                   <div className="contact-status">
//                     {isOnline(selectedContact.phone) ? "Online" : "Offline"}
//                     {isSelectedTyping && " • typing..."}
//                   </div>
//                 </div>
//               </div>

//               <div className="chat-actions">
//                 <i className="fas fa-search" />
//                 <i className="fas fa-paperclip" />
//                 <i className="fas fa-ellipsis-v" />
//               </div>
//             </div>

//             {/* Debug (optional) */}
//             {false && (
//               <>
//                 {console.log("💬 All Messages:", messages)}
//                 {console.log("📂 Filtered:", chatMessages)}
//               </>
//             )}

//             {/* Messages */}
//             <div className="messages-container">
//               {chatMessages.map((m, index) => {
//                 const key = m._id || m.id || m.tempMessageId || `msg-${index}`;
//                 const sender = m.senderPhone || m.sender || m.senderId;
//                 const isMine = sender === myPhone;
//                 return (
//                   <Message
//                     key={key}
//                     message={m}
//                     isOwnMessage={isMine}
//                     showStatus
//                     renderMessageStatus={renderMessageStatus}
//                   />
//                 );
//               })}
//               {/* ✅ scroll anchor */}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input */}
//             <div className="input-wrapper">
//               <InputArea
//                 value={inputMessage}
//                 onChange={setInputMessage}
//                 onSendMessage={handleSendMessage}
//                 onTyping={handleTyping}
//               />
//             </div>
//           </>
//         ) : (
//           <div className="no-chat-selected">
//             <div className="no-chat-content">
//               <i className="fas fa-comments" />
//               <h3>Select a chat to start messaging</h3>
//               <div
//                 className="add-contact-button-center"
//                 onClick={() => setShowAddContactModal(true)}
//                 role="button"
//                 tabIndex={0}
//               >
//                 <i className="fas fa-user-plus" />
//                 <span>Add Contact</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ===== Add Contact Modal ===== */}
//       {showAddContactModal && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowAddContactModal(false)}
//           role="button"
//           tabIndex={0}
//         >
//           <div
//             className="contact-modal"
//             onClick={(e) => e.stopPropagation()}
//             role="dialog"
//             aria-modal="true"
//           >
//             <div className="modal-header">
//               <h3>Add New Contact</h3>
//               <button
//                 className="close-btn"
//                 onClick={() => setShowAddContactModal(false)}
//                 aria-label="Close"
//               >
//                 &times;
//               </button>
//             </div>

//             <div className="form-group">
//               <label htmlFor="contactName">Name</label>
//               <input
//                 type="text"
//                 id="contactName"
//                 value={contactName}
//                 onChange={(e) => setContactName(e.target.value)}
//                 placeholder="Enter contact name"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="contactNumber">Phone Number</label>
//               <input
//                 type="tel"
//                 id="contactNumber"
//                 value={contactNumber}
//                 onChange={(e) => setContactNumber(e.target.value)}
//                 placeholder="Enter phone number"
//                 required
//               />
//             </div>

//             <button className="submit-btn" onClick={handleAddContact}>
//               Add Contact
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Close any overlays by clicking outside */}
//       {showUserDropdown && (
//         <div
//           className="dropdown-overlay"
//           onClick={() => setShowUserDropdown(false)}
//           role="button"
//           tabIndex={0}
//         />
//       )}
//     </div>
//   );
// };

// export default WhatsAppStyleChat;

// src/components/Chat/WhatsAppStyleChat.js
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import { useContacts } from "../../contexts/ContactsContext";
import { useSocket } from "../../contexts/SocketContext";

import InputArea from "./InputArea";
import Message from "./Message";
import "./WhatsAppStyleChat.css";

const WhatsAppStyleChat = () => {
  const { contacts, addContact } = useContacts();

  const {
    socket,
    onlineUsers = [],
    getMessages: socketGetMessages,
    sendMessage: socketSendMessage,
  } = useSocket();

  const { user, logout } = useAuth();

  // ---------- Local UI State ----------
  const [selectedContact, setSelectedContact] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [typingPhones, setTypingPhones] = useState([]);
  const messagesEndRef = useRef(null);

  const { messages, setMessages, selectedChat, setSelectedChat, sendMessage } =
    useChat();

  // ✅ Local messages state
  // const [messages, setMessages] = useState([]);

  const myPhone = user?.phone || null;
  const [chatCache, setChatCache] = useState({});
  // const { messages, setMessages, selectedChat } = useChat();

  const isOnline = useCallback(
    (phone) => (phone ? onlineUsers.includes(phone) : false),
    [onlineUsers]
  );

  // ---------- Socket: message updates ----------
  useEffect(() => {
    if (!socket) return;

    // ----------------- Helper: Upsert by tempMessageId -----------------
    const upsertByTempId = (incoming) => {
      if (!incoming?.tempMessageId) return false;

      let matched = false;
      setMessages((prev) =>
        prev.map((m) => {
          if (m.tempMessageId === incoming.tempMessageId) {
            matched = true;
            return {
              ...m,
              _id: incoming._id || incoming.actualMessageId || m._id,
              status: incoming.status || m.status || "sent",
              text: incoming.text ?? incoming.content ?? m.text,
            };
          }
          return m;
        })
      );

      return matched;
    };

    const handleNewMessage = (msg) => {
      const normalized = {
        ...msg,
        chat: msg.chat?._id || msg.chat,
        text: msg.text ?? msg.content ?? "",
      };

      setMessages((prev) => {
        let updated = [...prev];

        // 🔹 Agar tempMessageId match kare to update kar
        if (normalized.tempMessageId) {
          const idx = prev.findIndex(
            (m) => m.tempMessageId === normalized.tempMessageId
          );
          if (idx !== -1) {
            updated[idx] = { ...prev[idx], ...normalized };
          } else {
            updated = [...prev, normalized];
          }
        } else if (!prev.some((m) => m._id === normalized._id)) {
          updated = [...prev, normalized];
        }

        // ✅ Saath me cache update kar
        if (selectedChat?._id) {
          setChatCache((prevCache) => ({
            ...prevCache,
            [selectedChat._id]: updated,
          }));
        }

        return updated;
      });
    };

    const onSent = ({ tempMessageId, actualMessageId, status }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.tempMessageId === tempMessageId
            ? {
                ...m,
                _id: actualMessageId || m._id,
                status: status || "sent",
              }
            : m
        )
      );
    };

    const onDelivered = ({ actualMessageId, tempMessageId }) => {
      setMessages((prev) =>
        prev.map((m) => {
          const match =
            m._id === actualMessageId ||
            (tempMessageId && m.tempMessageId === tempMessageId);
          return match ? { ...m, status: "delivered" } : m;
        })
      );
    };

    const onRead = ({ actualMessageId, tempMessageId }) => {
      setMessages((prev) =>
        prev.map((m) => {
          const match =
            m._id === actualMessageId ||
            (tempMessageId && m.tempMessageId === tempMessageId);
          return match ? { ...m, status: "read" } : m;
        })
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("message-sent", onSent);

    socket.on("message-delivered", onDelivered);
    socket.on("message:read", onRead);

    return () => {
      socket.off("newMessage", handleNewMessage);

      socket.off("message:sent", onSent);

      socket.off("message:delivered", onDelivered);

      socket.off("message:read", onRead);
    };
  }, [socket]);

  // ---------- Derived chat messages ----------
  const chatMessages = useMemo(() => {
    if (!user) return [];

    if (selectedChat?._id) {
      return (messages || []).filter(
        (m) => m.chat === selectedChat._id || m.chatId === selectedChat._id
      );
    }
    if (!selectedContact) return [];
    const contactPhone = selectedContact.phone;
    return (messages || []).filter((m) => {
      const sender = m.senderPhone || m.sender || m.senderId;
      const recv = m.receiverPhone || m.receiver || m.receiverId;
      return (
        (sender === myPhone && recv === contactPhone) ||
        (sender === contactPhone && recv === myPhone)
      );
    });
  }, [messages, selectedContact, myPhone, selectedChat?._id, user]);

  // ---------- UI Toggles ----------
  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);
  const toggleUserDropdown = useCallback(
    () => setShowUserDropdown((s) => !s),
    []
  );
  const handleLogout = useCallback(() => {
    logout?.();
    setShowUserDropdown(false);
  }, [logout]);

  // ---------- Send ----------
  const handleSendMessage = () => {
    const text = (inputMessage || "").trim();
    if (!text) return;

    const chatId = selectedChat?._id;
    const receiverPhone = selectedContact?.phone;

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      tempMessageId: tempId,
      chat: chatId,
      text,
      receiverPhone,
      senderPhone: myPhone,
      status: "sending",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    socketSendMessage(chatId, text, receiverPhone, tempId);

    setInputMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = useCallback(() => {
    if (!socket || !selectedContact) return;
    socket.emit("typing", { receiverPhone: selectedContact.phone });
  }, [socket, selectedContact]);

  // ---------- Add Contact ----------
  const handleAddContact = useCallback(async () => {
    const name = contactName.trim();
    const phone = contactNumber.trim();
    if (!name || !phone) return;

    await addContact?.({ name, phone });
    setContactName("");
    setContactNumber("");
    setShowAddContactModal(false);
  }, [addContact, contactName, contactNumber]);

  // ---------- Socket: user online & typing ----------
  useEffect(() => {
    if (!socket || !myPhone) return;
    socket.emit("user-online", myPhone);
  }, [socket, myPhone]);

  useEffect(() => {
    if (!socket) return;
    const onTyping = ({ from }) => {
      if (!from) return;
      setTypingPhones((prev) => (prev.includes(from) ? prev : [...prev, from]));
      setTimeout(() => {
        setTypingPhones((prev) => prev.filter((p) => p !== from));
      }, 2000);
    };

    socket.on("typing", onTyping);
    return () => socket.off("typing", onTyping);
  }, [socket]);

  const renderMessageStatus = useCallback(
    (m) => {
      const sender = m.senderPhone || m.sender || m.senderId;
      if (sender !== myPhone) return null;

      const icon = (node) => <span className="message-status">{node}</span>;
      switch (m.status) {
        case "sending":
        case "pending":
          return icon(<i className="fas fa-clock" style={{ color: "#999" }} />);
        case "sent":
          return icon(<i className="fas fa-check" style={{ color: "#999" }} />);
        case "delivered":
          return icon(
            <>
              <i className="fas fa-check" />
              <i className="fas fa-check" />
            </>
          );
        case "read":
          return icon(
            <>
              <i className="fas fa-check" style={{ color: "#4fc3f7" }} />
              <i className="fas fa-check" style={{ color: "#4fc3f7" }} />
            </>
          );
        case "error":
          return icon(
            <i
              className="fas fa-exclamation-circle"
              style={{ color: "#e74c3c" }}
            />
          );
        default:
          return icon(
            <i className="fas fa-question-circle" style={{ color: "red" }} />
          );
      }
    },
    [myPhone]
  );

  const isSelectedTyping =
    !!selectedContact && typingPhones.includes(selectedContact.phone);

  // ---------- JSX (unchanged) ----------
  // ---------- JSX ----------
  return (
    <div className={`whatsapp-container ${darkMode ? "dark-mode" : ""}`}>
      {/* ===== Sidebar ===== */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || "Me"} />
              ) : (
                <span>{(user?.name || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h2>ChatterBox</h2>
          </div>

          <div className="sidebar-icons">
            <button className="theme-toggle-btn" onClick={toggleDarkMode}>
              {darkMode ? (
                <i className="fas fa-sun" />
              ) : (
                <i className="fas fa-moon" />
              )}
            </button>

            <i
              className="fas fa-user-plus"
              title="Add Contact"
              onClick={() => setShowAddContactModal(true)}
              role="button"
              tabIndex={0}
            />

            <div className="user-dropdown">
              <i
                className="fas fa-ellipsis-v dropdown-toggle"
                onClick={toggleUserDropdown}
                role="button"
                tabIndex={0}
                aria-label="Open menu"
              />
              {showUserDropdown && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <i className="fas fa-user" /> Profile
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <i className="fas fa-cog" /> Settings
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="search-container">
          <div className="search-box">
            <i className="fas fa-search" />
            <input type="text" placeholder="Search or start new chat" />
          </div>
        </div>

        <div className="contacts-list">
          {contacts.map((contact, index) => {
            const key =
              contact._id ||
              contact.id ||
              contact.phone ||
              `${contact.phone}-${index}`;

            const active =
              selectedContact &&
              (selectedContact._id === contact._id ||
                selectedContact.phone === contact.phone);

            return (
              <div
                key={key}
                className={`contact ${active ? "active" : ""}`}
                onClick={() => {
                  setSelectedContact(contact);
                  setSelectedChat({
                    _id: contact.chatId || contact._id,
                    ...contact,
                  });
                }}
                role="button"
                tabIndex={0}
              >
                <div className="contact-avatar">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} />
                  ) : (
                    <span>{(contact.name || "C").charAt(0).toUpperCase()}</span>
                  )}
                  {isOnline(contact.phone) && (
                    <span className="online-indicator" />
                  )}
                </div>

                <div className="contact-info">
                  <div className="contact-name">
                    {contact.name || contact.phone}
                  </div>
                  <div className="contact-message">
                    {contact.lastMessage || "Start a conversation"}
                  </div>
                </div>

                <div className="contact-meta">
                  <div className="contact-time">
                    {contact.lastMessageTime || ""}
                  </div>
                  {contact.unreadCount > 0 && (
                    <div className="message-count">{contact.unreadCount}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Chat Area ===== */}
      <div className="chat-area">
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="chat-header">
              <div className="chat-info">
                <div className="avatar">
                  {selectedContact.avatar ? (
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                    />
                  ) : (
                    <span>
                      {(selectedContact.name || "C").charAt(0).toUpperCase()}
                    </span>
                  )}
                  {isOnline(selectedContact.phone) && (
                    <span className="online-indicator" />
                  )}
                </div>
                <div>
                  <div className="contact-name">
                    {selectedContact.name || selectedContact.phone}
                  </div>
                  <div className="contact-status">
                    {isOnline(selectedContact.phone) ? "Online" : "Offline"}
                    {isSelectedTyping && " • typing..."}
                  </div>
                </div>
              </div>

              <div className="chat-actions">
                <i className="fas fa-search" />
                <i className="fas fa-paperclip" />
                <i className="fas fa-ellipsis-v" />
              </div>
            </div>

            {/* Debug (optional) */}
            {/* {false && (
              <>
                {console.log("💬 All Messages:", messages)}
                {console.log("📂 Filtered:", chatMessages)}
              </>
            )} */}

            {/* Messages */}
            <div className="messages-container">
              {chatMessages.map((m, index) => {
                const key = m._id || m.id || m.tempMessageId || `msg-${index}`;
                const sender = m.senderPhone || m.sender || m.senderId;
                const isMine = sender === myPhone;
                return (
                  <Message
                    key={key}
                    message={m}
                    isOwnMessage={isMine}
                    showStatus
                    renderMessageStatus={renderMessageStatus}
                  />
                );
              })}
              {/* ✅ scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="input-wrapper">
              <InputArea
                value={inputMessage}
                onChange={setInputMessage}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
              />
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <i className="fas fa-comments" />
              <h3>Select a chat to start messaging</h3>
              <div
                className="add-contact-button-center"
                onClick={() => setShowAddContactModal(true)}
                role="button"
                tabIndex={0}
              >
                <i className="fas fa-user-plus" />
                <span>Add Contact</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== Add Contact Modal ===== */}
      {showAddContactModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddContactModal(false)}
          role="button"
          tabIndex={0}
        >
          <div
            className="contact-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h3>Add New Contact</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddContactModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="contactName">Name</label>
              <input
                type="text"
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Enter contact name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Phone Number</label>
              <input
                type="tel"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <button className="submit-btn" onClick={handleAddContact}>
              Add Contact
            </button>
          </div>
        </div>
      )}

      {/* Close any overlays by clicking outside */}
      {showUserDropdown && (
        <div
          className="dropdown-overlay"
          onClick={() => setShowUserDropdown(false)}
          role="button"
          tabIndex={0}
        />
      )}
    </div>
  );
};

export default WhatsAppStyleChat;
