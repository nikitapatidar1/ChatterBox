// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   messageType: {
//     type: String,
//     enum: ['text', 'image', 'file'],
//     default: 'text',
//   },
//   imageUrl: {
//     type: String,
//   },
//   status: {
//     type: String,
//     enum: ['sent', 'delivered', 'seen'],
//     default: 'sent',
//   },
// }, {
//   timestamps: true,
// });

// module.exports = mongoose.model('Message', messageSchema);



const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  senderPhone: {
    type: String,
    required: true
  },
  receiverPhone: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent"
  },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
