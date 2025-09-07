
// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//   participants: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }],
//   isGroupChat: {
//     type: Boolean,
//     default: false
//   },
//   groupName: {
//     type: String
//   },
//   groupDescription: {
//     type: String
//   },
//   groupAdmin: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   lastMessage: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Message'
//   },
//   unreadCount: {
//     type: Map,
//     of: Number,
//     default: {}
//   }
// }, {
//   timestamps: true
// });

// // Update unread count for a user
// chatSchema.methods.incrementUnreadCount = function(userId) {
//   const currentCount = this.unreadCount.get(userId.toString()) || 0;
//   this.unreadCount.set(userId.toString(), currentCount + 1);
//   return this.save();
// };

// // Reset unread count for a user
// chatSchema.methods.resetUnreadCount = function(userId) {
//   this.unreadCount.set(userId.toString(), 0);
//   return this.save();
// };

// module.exports = mongoose.model('Chat', chatSchema);







const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: String,   // phone numbers
        required: true
      }
    ],
    isGroup: {
      type: Boolean,
      default: false
    },
    name: {
      type: String, // group name if isGroup = true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
