// const express = require("express");
// const router = express.Router();
// const Message = require("../models/Message");
// const protect = require("../middleware/auth");

// // 🔹 Get all messages of a chat
// router.get("/:chatId", async (req, res) => {
//   try {
//     const messages = await Message.find({ chat: req.params.chatId });
//     res.json(messages);
//   } catch (err) {
//     console.error("❌ Error fetching messages:", err);
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// });

// // 🔹 Send message (backup REST API, though socket.io handle karega)
// router.post("/", async (req, res) => {
//   try {
//     console.log("📩 Incoming body:", req.body);

//     const { chat, senderPhone, receiverPhone, text } = req.body;

//     if (!chat || !senderPhone || !receiverPhone || !text) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const newMessage = new Message({
//       chat,
//       senderPhone,
//       receiverPhone,
//       text,
//     });

//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (err) {
//     console.error("❌ Error sending message:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Fetch or Create chat by participant phone
// router.post("/with/:phone", protect, async (req, res) => {
//   try {
//     const myPhone = req.user.phone; // logged in user ka phone
//     const otherPhone = req.params.phone;

//     if (!otherPhone) {
//       return res.status(400).json({ message: "Phone number required" });
//     }

//     // Check if other user exists
//     const otherUser = await User.findOne({ phone: otherPhone });
//     if (!otherUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if chat already exists
//     let chat = await Chat.findOne({
//       participants: { $all: [myPhone, otherPhone] },
//     });

//     // If not, create new chat
//     if (!chat) {
//       chat = await Chat.create({
//         participants: [myPhone, otherPhone],
//       });
//     }

//     res.json({ chat });
//   } catch (err) {
//     console.error("⚠️ Chat create/fetch error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/message");
const protect = require("../middleware/auth");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message"); // ✅ add this

const mongoose = require("mongoose");

// 🔹 Get all messages of a chat
// router.get("/:chat", protect, getMessages);

router.get("/:chatId", async (req, res) => {
  try {
    const chatId = req.params.chatId;
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chatId" });
    }

    const messages = await Message.find({ chat: chatId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// 🔹 Send message (backup REST API, though socket.io handle karega)
router.post("/", protect, sendMessage);

// 🔹 Fetch or Create chat by participant phone
router.post("/with/:phone", protect, async (req, res) => {
  try {
    const myPhone = req.user.phone; // logged in user ka phone
    const otherPhone = req.params.phone;

    if (!otherPhone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // Check if other user exists
    const otherUser = await User.findOne({ phone: otherPhone });
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [myPhone, otherPhone] },
    });

    // ✅ If not, create new chat
    if (!chat) {
      chat = await Chat.create({
        participants: [myPhone, otherPhone],
      });
    }

    res.json({ chat });
  } catch (err) {
    console.error("⚠️ Chat create/fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
