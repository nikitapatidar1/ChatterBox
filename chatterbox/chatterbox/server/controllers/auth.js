// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const { generateOTP, sendEmail } = require('../utils/sendEmail');
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// // Register controller
// exports.register = async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   try {
//     if (!name || !email || !phone || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // check if user exists (by email or phone)
//     const userExists = await User.findOne({
//       $or: [{ email }, { phone }]
//     });

//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: "User with this email or phone already exists",
//       });
//     }

//     // create user
//     const user = await User.create({
//       name,
//       email,
//       phone,
//       password,
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       success: true,
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       avatar: user.avatar,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Login controller
// exports.login = async (req, res) => {
//   console.log('Full request body:', req.body);
//   const { email, password } = req.body;

//   console.log('Login attempt for:', email);
//   console.log('Password received:', password);

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log('User not found');
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     console.log('User found:', user.email);
//     console.log('Stored password hash:', user.password);

//     // Check if user has a password (not a Google user)
//     if (!user.password) {
//       console.log('User has no password (likely Google user)');
//       return res.status(401).json({
//         success: false,
//         message: 'Please use Google login'
//       });
//     }

//     // Compare passwords
//     const isPasswordCorrect = await user.correctPassword(password);
//     console.log('Password comparison result:', isPasswordCorrect);

//     if (isPasswordCorrect) {
//       const token = generateToken(user._id);
//       console.log('Login successful, token generated');

//      res.json({
//        success: true,
//      user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,   // 👈 phone ab aa jayega
//       avatar: user.avatar,
//   },
//   token,
// });

//     } else {
//       console.log('Invalid password');
//       res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Google authentication controller (for token-based auth)
// exports.googleAuth = async (req, res) => {
//   const { tokenId } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: tokenId,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { name, email, picture } = ticket.getPayload();

//     let user = await User.findOne({ email });

//     if (user) {
//       // Update user's Google ID if not already set
//       if (!user.googleId) {
//         user.googleId = ticket.getPayload().sub;
//         await user.save();
//       }

//       const token = generateToken(user._id);

//       res.json({
//         success: true,
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar || picture,
//         token,
//       });
//     } else {
//       // Create new user with Google authentication
//       const newUser = await User.create({
//         googleId: ticket.getPayload().sub,
//         name,
//         email,
//         avatar: picture,
//         // No password for Google-authenticated users
//       });

//       const token = generateToken(newUser._id);

//       res.status(201).json({
//         success: true,
//         _id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         avatar: newUser.avatar,
//         token,
//       });
//     }
//   } catch (error) {
//     console.error('Google authentication error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Google authentication failed'
//     });
//   }
// };

// // Send OTP controller - UPDATED
// exports.sendOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     // If user doesn't exist, create a new one
//     if (!user) {
//       // Generate a random name for the user
//       const randomName = `User${Math.floor(Math.random() * 10000)}`;

//       user = await User.create({
//         email,
//         name: randomName,
//         password: Math.random().toString(36).slice(-8), // random password
//       });
//     }

//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//     await user.save();

//     await sendEmail({
//       to: email,
//       subject: 'OTP for ChatterBox Login',
//       text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
//     });

//     // UPDATED: Return success property
//     res.json({
//       success: true,
//       message: 'OTP sent to your email'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Verify OTP controller - UPDATED
// exports.verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (user.otp !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired OTP'
//       });
//     }

//     // Clear OTP after successful verification
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save();

//     const token = generateToken(user._id);

//     // UPDATED: Return success property
//     res.json({
//       success: true,
//       token,
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get current user controller
// exports.getMe = async (req, res) => {
//   res.json({
//     success: true,
//     user: req.user
//   });
// };

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateOTP, sendEmail } = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register controller
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if user exists (by email or phone)
    const userExists = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    // create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login controller
exports.login = async (req, res) => {
  console.log("Full request body:", req.body);
  const { email, password } = req.body;

  console.log("Login attempt for:", email);
  console.log("Password received:", password);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("User found:", user.email);
    console.log("Stored password hash:", user.password);

    // Check if user has a password (not a Google user)
    if (!user.password) {
      console.log("User has no password (likely Google user)");
      return res.status(401).json({
        success: false,
        message: "Please use Google login",
      });
    }

    // Compare passwords
    const isPasswordCorrect = await user.correctPassword(password);
    console.log("Password comparison result:", isPasswordCorrect);

    if (isPasswordCorrect) {
      const token = generateToken(user._id);
      console.log("Login successful, token generated");

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone, // 👈 phone ab aa jayega
          avatar: user.avatar,
        },
        token,
      });
    } else {
      console.log("Invalid password");
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Google authentication controller (for token-based auth)
exports.googleAuth = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      // Update user's Google ID if not already set
      if (!user.googleId) {
        user.googleId = ticket.getPayload().sub;
        await user.save();
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || picture,
        token,
      });
    } else {
      // Create new user with Google authentication
      const newUser = await User.create({
        googleId: ticket.getPayload().sub,
        name,
        email,
        avatar: picture,
        // No password for Google-authenticated users
      });

      const token = generateToken(newUser._id);

      res.status(201).json({
        success: true,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        token,
      });
    }
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

// // Send OTP controller - UPDATED
// exports.sendOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     // If user doesn't exist, create a new one
//     if (!user) {
//       // Generate a random name for the user
//       const randomName = `User${Math.floor(Math.random() * 10000)}`;

//       user = await User.create({
//         email,
//         name: randomName,
//         password: Math.random().toString(36).slice(-8), // random password
//       });
//     }

//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//     await user.save();

//     await sendEmail({
//       to: email,
//       subject: 'OTP for ChatterBox Login',
//       text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
//     });

//     // UPDATED: Return success property
//     res.json({
//       success: true,
//       message: 'OTP sent to your email'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Send OTP controller - with debug logs
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  console.log("sendOTP called with email:", email);

  if (!email) {
    console.log("Email not provided in request body");
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    let user = await User.findOne({ email });
    console.log("User found:", user);

    // If user doesn't exist, create a new one
    if (!user) {
      const randomName = `User${Math.floor(Math.random() * 10000)}`;
      console.log("Creating new user with name:", randomName);

      user = await User.create({
        email,
        name: randomName,
        password: Math.random().toString(36).slice(-8), // random password
      });

      console.log("New user created:", user);
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    console.log("User updated with OTP");

    try {
      await sendEmail({
        to: email,
        subject: "OTP for ChatterBox Login",
        text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
      });
      console.log("OTP email sent successfully to:", email);
    } catch (err) {
      console.error("sendEmail failed:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP. Check SMTP." });
    }

    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("sendOTP controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// // Verify OTP controller - Debug-ready
// // Verify OTP controller - Debug-ready
// exports.verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     console.log("=== VERIFY OTP ===");
//     console.log("Email received:", email);
//     console.log("OTP received:", otp);

//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log("❌ User not found for email:", email);
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Log current OTP state from DB
//     console.log("📌 User OTP state from DB:", {
//       email: user.email,
//       otp: user.otp,
//       otpExpiry: user.otpExpiry,
//     });

//     if (!user.otp || !user.otpExpiry) {
//       console.log("⚠️ OTP or expiry not set in DB for this user.");
//       return res.status(400).json({
//         success: false,
//         message: "OTP not generated or already used",
//       });
//     }

//     // Compare OTP
//     if (String(user.otp).trim() !== String(otp).trim()) {
//       console.log(
//         "❌ OTP mismatch. Stored OTP:",
//         user.otp,
//         "Received OTP:",
//         otp
//       );
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     // Check expiry
//     if (user.otpExpiry < Date.now()) {
//       console.log(
//         "⏰ OTP expired. Expiry time:",
//         new Date(user.otpExpiry),
//         "Current time:",
//         new Date()
//       );
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       });
//     }

//     // Clear OTP after verification
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save();

//     // Confirm DB update
//     const updatedUser = await User.findOne({ email });
//     console.log("✅ User after clearing OTP:", {
//       email: updatedUser.email,
//       otp: updatedUser.otp,
//       otpExpiry: updatedUser.otpExpiry,
//     });

//     const token = generateToken(user._id);

//     console.log("🎉 OTP verified successfully for:", email);

//     res.json({
//       success: true,
//       token,
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar,
//     });
//   } catch (error) {
//     console.error("❌ Error in verifyOTP:", error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Verify OTP controller - Final Clean Version
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log("=== VERIFY OTP ===");
    console.log("📩 Email:", email);
    console.log("🔑 OTP received:", otp);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check OTP presence
    if (!user.otp || !user.otpExpiry) {
      console.log("⚠️ OTP or expiry missing for user:", email);
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already used",
      });
    }

    // Match OTP
    if (String(user.otp).trim() !== String(otp).trim()) {
      console.log(`❌ OTP mismatch. Expected: ${user.otp}, Got: ${otp}`);
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check expiry
    if (user.otpExpiry < Date.now()) {
      console.log(
        `⏰ OTP expired. Expiry: ${new Date(
          user.otpExpiry
        )}, Now: ${new Date()}`
      );
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ✅ OTP verified -> Clear fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    console.log("🎉 OTP verified successfully for:", email);

    // ✅ Final Response
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("❌ Error in verifyOTP:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get current user controller
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
