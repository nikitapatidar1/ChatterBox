


// const mongoose = require("mongoose");

// const ContactSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Contact", ContactSchema);




// server/models/Contact.js
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // optional
    },
    phone: {
      type: String,
      required: false, // optional
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
