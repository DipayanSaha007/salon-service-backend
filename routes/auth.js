const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// // Sign-in route
// router.post('/signin', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         res.status(200).json({ message: 'Sign in successful' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

module.exports = router;
