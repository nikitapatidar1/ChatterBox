import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import { useSocket } from "../contexts/SocketContext";
import Message from "./Message";
import InputArea from "./InputArea";
import "./ChatWindow.css";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

const ChatWindow = ({ contact }) => {
  const { user } = useAuth();
  const { messages, sendMessage, addMessage } = useChat();
  const { socket } = useSocket();

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // 📥 Receive messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      // Only display messages relevant to this chat
      if (
        (message.sender === contact._id && message.receiver === user._id) ||
        (message.sender === user._id && message.receiver === contact._id)
      ) {
        addMessage({
          ...message,
          text: message.text || message.content,
          timestamp:
            message.createdAt || message.timestamp || new Date().toISOString(),
        });
      }
    };

    socket.on("receive-message", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [socket, contact, user, addMessage]);

  // ✉️ Send Message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      _id: Date.now().toString(),
      sender: user._id,
      receiver: contact._id,
      text: newMessage,
      status: "pending",
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Add message to UI immediately
    sendMessage(tempMessage);

    // Emit to server
    if (socket) {
      socket.emit("send-message", {
        text: newMessage,
        chatId: contact.chatId || contact._id,
        receiverId: contact._id,
      });
    }

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const renderMessageStatus = (message) => {
    switch (message.status) {
      case "pending":
        return <FaCheck className="text-gray-400 text-xs ml-1" />;
      case "sent":
        return <FaCheck className="text-gray-600 text-xs ml-1" />;
      case "delivered":
        return <FaCheckDouble className="text-gray-600 text-xs ml-1" />;
      case "seen":
        return <FaCheckDouble className="text-blue-500 text-xs ml-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-info">
          <div className="avatar">
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.name} />
            ) : (
              <span>
                {contact.name ? contact.name.charAt(0).toUpperCase() : "C"}
              </span>
            )}
          </div>
          <div>
            <div className="contact-name">{contact.name}</div>
            <div className="contact-status">online</div>
          </div>
        </div>
        <div className="chat-actions">
          <i className="fas fa-search"></i>
          <i className="fas fa-paperclip"></i>
          <i className="fas fa-ellipsis-v"></i>
        </div>
      </div>

      <div
        className="messages-container"
        ref={messagesContainerRef}
        // No auto scroll at all
      >
        {messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            isOwnMessage={message.sender === user._id}
            showStatus={true}
            renderMessageStatus={renderMessageStatus}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <InputArea
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatWindow;
