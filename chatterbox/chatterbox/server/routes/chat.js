

// const express = require('express');
// const router = express.Router();
// const authenticate = require('../middleware/auth'); // Fixed import
// const chatController = require('../controllers/chat');




// console.log("authenticate type:", typeof authenticate);
// console.log("chatController:", chatController);
// console.log("chatController.getChats:", typeof chatController.getChats);


// // Make sure you're using the correct controller methods
// router.get('/', authenticate, chatController.getChats);
// router.post('/', authenticate, chatController.createChat);
// router.get('/:id', authenticate, chatController.getChat);
// router.delete('/:id', authenticate, chatController.deleteChat);

// module.exports = router;






const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

const protect = require("../middleware/auth"); 


// 🔹 Create new chat
router.post("/", async (req, res) => {
  try {
    const { participants, isGroup, name } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: "At least 2 participants required" });
    }

    const newChat = new Chat({ participants, isGroup, name });
    await newChat.save();

    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get all chats (for debugging)
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});









// ✅ Fetch or Create chat by participant phone
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

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [myPhone, otherPhone] },
    });

    // If not, create new chat
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
