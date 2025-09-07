// const Message = require('../models/Message');

// module.exports = (io) => {
//   io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Join user to their own room
//     socket.on('join', (userId) => {
//       socket.join(userId);
//       console.log(`User ${userId} joined room`);
//     });

//     // Send message
//     socket.on('send-message', async (data) => {
//       try {
//         const { receiverId, message } = data;

//         // Save message to database
//         const newMessage = await Message.create({
//           sender: message.sender,
//           receiver: message.receiver,
//           content: message.content,
//           messageType: message.messageType,
//           imageUrl: message.imageUrl
//         });

//         // Populate sender info
//         await newMessage.populate('sender', 'name avatar');

//         // Send to receiver
//         socket.to(receiverId).emit('receive-message', newMessage);

//         // Send delivery confirmation to sender
//         socket.to(message.sender).emit('message-delivered', newMessage._id);
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     });

//     // Typing indicators
//     socket.on('typing-start', (data) => {
//       socket.to(data.receiverId).emit('typing-start', data.senderId);
//     });

//     socket.on('typing-stop', (data) => {
//       socket.to(data.receiverId).emit('typing-stop', data.senderId);
//     });

//     // Message status updates
//     socket.on('message-delivered', (data) => {
//       socket.to(data.senderId).emit('message-delivered', data.messageId);
//     });

//     socket.on('message-seen', (data) => {
//       socket.to(data.senderId).emit('message-seen', data.messageId);
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// };

const socketIO = require("socket.io");
const Message = require("../models/Message");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("📡 User connected:", socket.id);

    // 🔑 Join user to their own room (based on phone number)
    socket.on("join_user", (userPhone) => {
      socket.join(userPhone);
      console.log(`📱 User with phone ${userPhone} joined room`);
    });

    // 📨 Handle sending messages
    socket.on("send-message", async (messageData) => {
      try {
        console.log("📥 Message received on server:", messageData);

        // Save message in DB with status "sent"
        const newMessage = await Message.create({
          chat: messageData.chat,
          senderPhone: messageData.senderPhone,
          receiverPhone: messageData.receiverPhone,
          text: messageData.text,
          status: "sent",
        });

        // Emit to recipient room (real-time receive)
        io.to(messageData.receiverPhone).emit("receive-message", newMessage);

        // Update status → "delivered"
        await Message.findByIdAndUpdate(newMessage._id, {
          status: "delivered",
        });

        // Emit status back to sender
        io.to(messageData.senderPhone).emit("message-status", {
          messageId: newMessage._id,
          status: "delivered",
        });
      } catch (err) {
        console.error("❌ Error handling send-message:", err);
      }
    });

    // 👀 Mark messages as read
    socket.on("mark-as-read", async ({ chatId, userPhone }) => {
      try {
        // Update DB
        await Message.updateMany(
          { chat: chatId, receiverPhone: userPhone, status: { $ne: "read" } },
          { $set: { status: "read" } }
        );

        // Notify sender(s)
        io.emit("messages-read", { chatId, by: userPhone });
      } catch (err) {
        console.error("❌ Error marking messages as read:", err);
      }
    });

    // ❌ Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
