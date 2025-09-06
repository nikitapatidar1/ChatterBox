// import React, { useRef } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import { useChat } from "../../contexts/ChatContext";
// import "./ImageUpload.css";

// const ImageUpload = () => {
//   const fileInputRef = useRef();
//   const { currentUser } = useAuth();
//   const { currentChat, sendMessage } = useChat();

//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         sendMessage({
//           content: "Image",
//           image: event.target.result,
//           receiver: currentChat._id,
//           sender: currentUser._id,
//           messageType: "image",
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <>
//       <button className="action-btn" onClick={handleClick}>
//         <i className="fas fa-paperclip"></i>
//       </button>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleImageSelect}
//         accept="image/*"
//         style={{ display: "none" }}
//       />
//     </>
//   );
// };

// export default ImageUpload;

import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import "./ImageUpload.css";
import InputArea from "../Chat/InputArea";

const ImageUpload = () => {
  const fileInputRef = useRef();
  const { currentUser } = useAuth();
  const { currentChat, sendMessage } = useChat();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMessage = {
          text: "",
          file: event.target.result,
          id: Date.now(),
          type: "image",
        };
        setMessages((prev) => [...prev, newMessage]);
        sendMessage({
          content: "",
          image: event.target.result,
          receiver: currentChat._id,
          sender: currentUser._id,
          messageType: "image",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleSendMessage = (msg) => {
    if (!msg.trim()) return;
    const newMessage = {
      text: msg,
      id: Date.now(),
      type: "text",
    };
    setMessages((prev) => [...prev, newMessage]);
    sendMessage({
      content: msg,
      receiver: currentChat._id,
      sender: currentUser._id,
      messageType: "text",
    });
    setInputValue(""); // clear input after sending
  };

  {
    messages.map((msg) => (
      <div key={msg.id} className={`chat-message ${msg.type}`}>
        {msg.type === "text" ? (
          msg.text
        ) : (
          <img
            src={msg.file}
            alt="sent"
            className="chat-image"
            onError={(e) => (e.target.src = "/fallback-image.png")} // fallback if can't load
          />
        )}
      </div>
    ));
  }

  return (
    <div className="image-upload-container">
      <InputArea
        value={inputValue}
        onChange={(val) => setInputValue(val)}
        onSendMessage={handleSendMessage}
      />

      <button className="action-btn" onClick={handleClick}>
        <i className="fas fa-paperclip"></i>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUpload;
