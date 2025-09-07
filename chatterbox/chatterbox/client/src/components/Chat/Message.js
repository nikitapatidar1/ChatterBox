// import React from 'react';
// import './Message.css';

// const Message = ({ message, isOwnMessage, showStatus, renderMessageStatus }) => {
//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   return (
//     <div className={`message ${isOwnMessage ? 'message-sent' : 'message-received'}`}>
//       <div className="message-content">
//         <div className="message-text">{message.text}</div>
//         <div className="message-meta">
//           <span className="message-time">
//             {formatTime(message.timestamp)}
//           </span>
//           {isOwnMessage && showStatus && renderMessageStatus && (
//             renderMessageStatus(message)
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Message;







import React from 'react';
import './Message.css';

const Message = ({ message, isOwnMessage, showStatus, renderMessageStatus }) => {
  const getTime = (m) => m?.createdAt || m?.timestamp || m?.time || null;

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';  // Invalid Date guard
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message ${isOwnMessage ? 'message-sent' : 'message-received'}`}>
      <div className="message-content">
        <div className="message-text">{message.text || message.content || ""}</div>
        <div className="message-meta">
          <span className="message-time">
            {formatTime(getTime(message))}
          </span>

          {isOwnMessage && showStatus && renderMessageStatus && (
            renderMessageStatus(message)
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
