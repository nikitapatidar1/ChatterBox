// // src/contexts/ChatContext.js
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useSocket } from "./SocketContext";

// const ChatContext = createContext();
// export const useChat = () => useContext(ChatContext);

// export const ChatProvider = ({ children }) => {
//   const { sendMessage, getMessages, socket } = useSocket();
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [chatCache, setChatCache] = useState({});
//   const token = localStorage.getItem("token");

//   // ---------------- Fetch messages for selected chat ----------------
//   useEffect(() => {
//     if (!selectedChat?._id) return;

//     const chatId = selectedChat._id;

//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(
//           `http://192.168.43.3:5000/messages/${chatId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch messages");
//         const msgs = await response.json();

//         // Merge with existing messages (avoid duplicates)
//         const existing = chatCache[chatId] || [];
//         const merged = [
//           ...existing,
//           ...msgs.filter((m) => !existing.find((e) => e._id === m._id)),
//         ];

//         setMessages(merged);
//         setChatCache((prev) => ({ ...prev, [chatId]: merged }));
//       } catch (err) {
//         console.error("❌ Error fetching messages:", err);
//         setMessages([]);
//       }
//     };

//     fetchMessages();
//   }, [selectedChat?._id, token]);

//   // ---------------- Listen for real-time messages ----------------
//   useEffect(() => {
//     if (!selectedChat?._id || !socket) return;

//     const handleNewMessage = (msg) => {
//       if (msg.chat === selectedChat._id) {
//         setMessages((prev) => [...prev, msg]);
//         setChatCache((prev) => ({
//           ...prev,
//           [msg.chat]: [...(prev[msg.chat] || []), msg],
//         }));
//       }
//     };

//     socket.on("newMessage", handleNewMessage);

//     return () => {
//       socket.off("newMessage", handleNewMessage);
//     };
//   }, [selectedChat?._id, socket]);

//   return (
//     <ChatContext.Provider
//       value={{
//         messages,
//         setMessages,
//         selectedChat,
//         setSelectedChat,
//         sendMessage,
//         getMessages,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// src/contexts/ChatContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { sendMessage, getMessages, socket } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatCache, setChatCache] = useState({});
  const token = localStorage.getItem("token");

  // ---------------- Fetch messages for selected chat ----------------
  useEffect(() => {
    if (!selectedChat?._id) return;

    const chatId = selectedChat._id;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://192.168.43.3:5000/messages/${chatId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const msgs = await response.json();

        // Merge with existing messages (avoid duplicates)
        const existing = chatCache[chatId] || [];
        const merged = [
          ...existing,
          ...msgs.filter((m) => !existing.find((e) => e._id === m._id)),
        ];

        setMessages(merged);
        setChatCache((prev) => ({ ...prev, [chatId]: merged }));
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedChat?._id, token]);

  // ---------------- Listen for real-time messages ----------------
  useEffect(() => {
    if (!selectedChat?._id || !socket) return;

    const handleNewMessage = (msg) => {
      if (msg.chat === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
        setChatCache((prev) => ({
          ...prev,
          [msg.chat]: [...(prev[msg.chat] || []), msg],
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedChat?._id, socket]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        selectedChat,
        setSelectedChat,
        sendMessage,
        getMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
