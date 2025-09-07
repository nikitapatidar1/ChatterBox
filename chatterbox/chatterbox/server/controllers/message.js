// // controllers/message.js
// const Message = require("../models/Message");
// const Chat = require("../models/Chat");

// // 📌 Get all messages of a chat
// const getMessages = async (req, res) => {
//   try {
//     const { chat } = req.params;  // 👈 frontend se param "chat" aa rha hai
//     console.log("📩 Fetching messages for chat:", chat);

//     // ✅ saare messages chat ke andar se fetch karo
//     const messages = await Message.find({ chat }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (error) {
//     console.error("Error fetching messages:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // 📌 Send a new message
// // ----------------- SEND MESSAGE -----------------
// const sendMessage = async (req, res) => {
//   try {
//     const { text, chat, receiverPhone } = req.body;  // 👈 chat hi expect karo

//     if (!text || !chat || !receiverPhone) {
//       return res.status(400).json({ message: "Invalid data" });
//     }

//     // ✅ Save as per schema
//     let message = await Message.create({
//       chat,                        // 👈 chat hi save karo
//       senderPhone: req.user.phone, // logged-in user ka phone
//       receiverPhone,
//       text,                        // 👈 text field hi
//       status: "sent",
//     });

//     // ✅ Update latestMessage in Chat
//     await Chat.findByIdAndUpdate(chat, { latestMessage: message });

//     res.status(201).json(message);
//   } catch (error) {
//     console.error("Error sending message:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { getMessages, sendMessage };

// controllers/message.js
const Message = require("../models/Message");
const Chat = require("../models/Chat");

// const getMessages = async (req, res) => {
//   try {
//     const chatId = req.params.chat;

//     if (!mongoose.Types.ObjectId.isValid(chatId)) {
//       return res.status(400).json({ message: "Invalid chat ID" });
//     }

//     const messages = await Message.find({
//       chat: mongoose.Types.ObjectId(chatId),
//     }).sort({ createdAt: 1 }); // old → new

//     res.json(messages);
//   } catch (err) {
//     console.error("❌ Error fetching messages:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const getMessages = async (req, res) => {
  try {
    const chatId = req.params.chat;
    console.log("📝 Incoming chatId:", chatId);
    console.log("👤 Authenticated user:", req.user); // From protect middleware

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    const messages = await Message.find({
      chat: mongoose.Types.ObjectId(chatId),
    }).sort({ createdAt: 1 });

    console.log("✅ Messages fetched from DB:", messages);

    res.json(messages || []);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMessages };

// 📌 Send a new message (API based, agar socket use na kare to)
const sendMessage = async (req, res) => {
  try {
    const { text, chat, receiverPhone } = req.body;

    if (!text || !chat || !receiverPhone) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // ✅ Save message
    let message = await Message.create({
      chat, // Chat ID
      senderPhone: req.user.phone, // logged-in user ka phone
      receiverPhone,
      text,
      status: "sent", // default → sent
    });

    // ✅ Update latestMessage in Chat collection
    await Chat.findByIdAndUpdate(chat, { latestMessage: message });

    res.status(201).json(message);
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMessages, sendMessage };
