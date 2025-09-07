// //routes/contacts.js में निम्न route add करें
// const express = require('express');
// const router = express.Router();
// const Contact = require('../models/Contact');

// // Get contacts for a user
// router.get('/:userId', async (req, res) => {
//   try {
//     const contacts = await Contact.find({ userId: req.params.userId });
//     res.json(contacts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Add a new contact
// router.post('/', async (req, res) => {
//   try {
//     const { name, phone, email, userId } = req.body;
    
//     // Check if contact already exists for this user
//     const existingContact = await Contact.findOne({ 
//       userId, 
//       $or: [{ phone }, { email }] 
//     });
    
//     if (existingContact) {
//       return res.status(400).json({ message: 'Contact already exists' });
//     }
    
//     const newContact = new Contact({
//       name,
//       phone,
//       email,
//       userId
//     });
    
//     const savedContact = await newContact.save();
//     res.status(201).json(savedContact);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// module.exports = router;









// server/routes/contacts.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

// GET
router.get("/", auth, async (req, res) => {
  const contacts = await Contact.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(contacts);
});

// POST
router.post("/", auth, async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const newContact = new Contact({ user: req.user.id, name, email, phone });
  const saved = await newContact.save();
  return res.status(201).json(saved);
});





// 📌 Delete a contact
router.delete("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
