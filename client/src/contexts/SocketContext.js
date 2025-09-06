// // src/contexts/SocketContext.js
// import React, { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
// import { useAuth } from "./AuthContext";

// const SocketContext = createContext();
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [socket, setSocket] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   // ----------------- CONNECT -----------------
//   useEffect(() => {
//     if (!user?.phone) {
//       if (socket) socket.disconnect();
//       setSocket(null);
//       return;
//     }

//     const s = io(process.env.REACT_APP_WS_URL || "http://localhost:5000", {
//       transports: ["websocket", "polling"],
//       path: "/socket.io",
//     });

//     setSocket(s);

//     s.on("connect", () => {
//       console.log("✅ Socket connected:", s.id);
//       s.emit("user-online", user.phone);
//     });

//     s.on("online-users", (users) => {
//       setOnlineUsers(Array.isArray(users) ? users : []);
//     });

//     s.on("disconnect", () => console.log("❌ Socket disconnected"));

//     return () => {
//       s.disconnect();
//       setSocket(null);
//     };
//   }, [user?.phone]);

//   // ----------------- GET MESSAGES -----------------
//   const getMessages = async (chatId) => {
//     if (!chatId || !user?.token) return [];
//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/messages/${chatId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       const data = await res.json();
//       return (data?.messages || []).map((m) => ({
//         ...m,
//         text: m.text ?? m.content ?? "",
//         chat: m.chat?._id || m.chat,
//       }));
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//       return [];
//     }
//   };

//   // ----------------- SEND MESSAGE -----------------
//   const sendMessage = (chatId, text, receiverPhone, tempId = null) => {
//     if (!socket) return;

//     const tempMessageId =
//       tempId || `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//     const payload = {
//       chat: chatId,
//       text,
//       senderPhone: user.phone,
//       receiverPhone,
//       tempMessageId,
//     };

//     // Send message to backend
//     socket.emit("send-message", payload, (ack) => {
//       // Backend can optionally return { ok, actualMessageId, tempMessageId, status }
//       if (ack?.actualMessageId) {
//         socket.emit("message-sent", {
//           tempMessageId: ack.tempMessageId,
//           actualMessageId: ack.actualMessageId,
//           status: "sent",
//         });
//       }
//     });
//   };

//   // Expose socket + helper
//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         onlineUsers,
//         phone: user?.phone,
//         getMessages,
//         sendMessage,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ----------------- CONNECT -----------------
  useEffect(() => {
    if (!user?.phone) {
      if (socket) socket.disconnect();
      setSocket(null);
      return;
    }

    const s = io(process.env.REACT_APP_WS_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
      path: "/socket.io",
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
      s.emit("user-online", user.phone);
    });

    s.on("online-users", (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    });

    s.on("disconnect", () => console.log("❌ Socket disconnected"));

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [user?.phone]);

  // ----------------- GET MESSAGES -----------------
  const getMessages = async (chatId) => {
    if (!chatId || !user?.token) return [];
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/messages/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!res.ok) {
        console.error("❌ Failed to fetch messages:", await res.text());
        return [];
      }
      const data = await res.json(); // data is already an array
      return (data || []).map((m) => ({
        ...m,
        text: m.text ?? m.content ?? "",
        chat: m.chat?._id || m.chat,
      }));
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
      return [];
    }
  };

  // ----------------- SEND MESSAGE -----------------
  const sendMessage = (
    chatId,
    text,
    receiverPhone,
    tempMessageId = Date.now().toString()
  ) => {
    if (!socket) return;

    const payload = {
      chat: chatId,
      text,
      receiverPhone,
      senderPhone: user.phone,
      tempMessageId,
    };

    socket.emit("send-message", payload, (ack) => {
      if (!ack) return;
      try {
        const evt = {
          tempMessageId: ack.tempMessageId || tempMessageId,
          actualMessageId: ack.actualMessageId,
          status: ack.status || (ack.ok ? "sent" : "error"),
        };
        socket.emit("message-sent", evt);
      } catch (e) {
        console.warn("ACK handling failed:", e);
      }
    });
  };

  // Expose socket + helper
  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        phone: user?.phone,
        getMessages,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
