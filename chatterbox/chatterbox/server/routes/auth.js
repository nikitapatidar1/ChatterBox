// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { protect } = require('../middleware/auth');
// const { generateOTP, sendEmail } = require('../utils/sendEmail');
// const { OAuth2Client } = require('google-auth-library');

// const router = express.Router();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// // Register
// router.post('/auth/register', async (req, res) => {
//     console.log('Register request received:', req.body);
//   const { name, email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await user.correctPassword(password, user.password))) {
//       const token = generateToken(user._id);

//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar,
//         token,
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Google OAuth
// router.post('/google', async (req, res) => {
//   const { tokenId } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: tokenId,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { name, email, picture, sub } = ticket.getPayload();

//     let user = await User.findOne({ email });

//     if (user) {
//       if (!user.googleId) {
//         user.googleId = sub;
//         await user.save();
//       }
//     } else {
//       user = await User.create({
//         googleId: sub,
//         email,
//         name,
//         avatar: picture,
//         password: Math.random().toString(36).slice(-8), // random password
//       });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Send OTP
// router.post('/send-otp', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
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

//     res.json({ message: 'OTP sent to your email' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Verify OTP
// router.post('/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.otp !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }

//     // Clear OTP after successful verification
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save();

//     const token = generateToken(user._id);

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get current user
// router.get('/me', protect, async (req, res) => {
//   res.json(req.user);
// });

// module.exports = router;



// const express = require('express');
// const { 
//   register, 
//   login, 
//   googleAuth, 
//   sendOTP, 
//   verifyOTP, 
//   getMe 
// } = require('../controllers/auth');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// // Register
// router.post('/auth/register', register);

// // Login
// router.post('/login', login);

// // Google OAuth
// router.post('/google', googleAuth);

// // Send OTP
// router.post('/send-otp', sendOTP);

// // Verify OTP
// router.post('/verify-otp', verifyOTP);

// // Get current user
// router.get('/me', protect, getMe);

// module.exports = router;




const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, googleAuth, sendOTP, verifyOTP, getMe } = require('../controllers/auth');

// auth routes
router.post('/register', register);
router.post('/login', login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);
router.post('/google', googleAuth);

// otp
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// user info
router.get('/me', getMe);

module.exports = router;
