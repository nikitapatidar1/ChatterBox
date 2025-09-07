require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const contactsRoutes = require("./routes/contacts");

const requireAuth = require("./middleware/auth");
const Message = require("./models/Message");
const Chat = require("./models/Chat");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000", // ✅ laptop
      "http://192.168.43.3:3000", // ✅ phone (same Wi-Fi)
    ],
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.43.3:3000"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ APIs
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/messages", messageRoutes);
app.use("/api/contacts", contactsRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Serve React in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// ---------------- SOCKET.IO ----------------
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // 📌 User login hone ke baad apna phone bhejta hai
  socket.on("user-online", (phone) => {
    if (!phone) return;
    if (!onlineUsers.has(phone)) {
      onlineUsers.set(phone, new Set());
    }
    onlineUsers.get(phone).add(socket.id);
    socket.phone = phone;

    console.log("🟢 User online:", phone, "=>", socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // 📌 Send message event (WhatsApp flow)
  socket.on("send-message", async (message) => {
    try {
      console.log("📩 Incoming message:", message);

      const receiverPhone = message.receiverPhone;

      // 1. DB me save karo
      const newMessage = new Message({
        chat: message.chat,
        senderPhone: message.senderPhone,
        receiverPhone,
        text: message.text,
        status: onlineUsers.has(receiverPhone) ? "delivered" : "sent",
      });
      await newMessage.save();

      // 2. Chat ka latestMessage update karo
      await Chat.findByIdAndUpdate(message.chat, { latestMessage: newMessage });

      console.log("✔️ Saved to DB:", newMessage);

      // 3. ACK sender ko (sending → sent)
      socket.emit("message-sent", {
        tempMessageId: message.tempMessageId,
        actualMessageId: newMessage._id,
        message: newMessage,
        status: "sent",
      });

      // 4. Agar receiver online hai to deliver kar do
      // 4. Receiver ko real-time message bhejo
      if (onlineUsers.has(receiverPhone)) {
        onlineUsers.get(receiverPhone).forEach((sockId) => {
          io.to(sockId).emit("newMessage", newMessage); // "receive-message" ki jagah "newMessage"
        });

        // Sender ko bhi delivered status update karo
        socket.emit("message-delivered", {
          tempMessageId: message.tempMessageId,
          actualMessageId: newMessage._id,
          status: "delivered",
        });
      }
    } catch (err) {
      console.error("❌ Error in send-message:", err.message);
    }
  });

  // 📌 Message received → update to delivered
  socket.on("messageReceivedAck", async (messageId) => {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { status: "delivered" },
        { new: true }
      );
      if (updatedMessage) {
        if (onlineUsers.has(updatedMessage.senderPhone)) {
          onlineUsers.get(updatedMessage.senderPhone).forEach((sockId) => {
            io.to(sockId).emit("messageStatusUpdated", updatedMessage);
          });
        }
      }
    } catch (err) {
      console.error("❌ Error updating to delivered:", err.message);
    }
  });

  // 📌 Message read
  socket.on("message-read", async ({ messageId }) => {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { status: "read" },
        { new: true }
      );
      if (updatedMessage) {
        if (onlineUsers.has(updatedMessage.senderPhone)) {
          onlineUsers.get(updatedMessage.senderPhone).forEach((sockId) => {
            io.to(sockId).emit("message-read-update", updatedMessage);
          });
        }
      }
    } catch (err) {
      console.error("❌ Error updating to read:", err.message);
    }
  });

  // 📌 Disconnect
  socket.on("disconnect", () => {
    if (socket.phone && onlineUsers.has(socket.phone)) {
      const sockets = onlineUsers.get(socket.phone);
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(socket.phone);
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log("❌ User disconnected:", socket.id);
  });
});

// ---------------- DB ----------------
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/chatterbox")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
