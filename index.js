const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();  // Remove path as Vercel injects the environment variables automatically

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');

// Use CORS middleware
app.use(cors({
    origin: 'https://salon-service-app-v4kb-2teace5il-dipayansaha007s-projects.vercel.app', // Replace with your frontend's URL
    methods: 'GET,POST,PUT,DELETE', // Allow necessary HTTP methods
    credentials: true, // If you're using cookies/session
}));


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MongoDB URI is not defined');
    process.exit(1);  // Exit if MongoDB URI is not defined
}

// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('JWT Secret is not defined');
    process.exit(1);  // Exit if JWT Secret is not defined
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Sign-Up Route
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Sign-In Route
app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username' });
        }

        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Sign In Successful', token });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Edit Profile Route (Check email, then update username and password)
app.post('/edit-profile', async (req, res) => {
    try {
        const { email, newUsername, newPassword } = req.body;

        // Validate input fields
        if (!newUsername || !email || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user by username and email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided email' });
        }

        // Update user's username & password (store as plain text)
        user.username = newUsername;
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating profile. Please try again.', error: error.message || error });
    }
});

// Forgot password route
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'No user found with this email' });
    }

    // Respond with a success message (No reset code generated on backend now)
    res.status(200).json({ message: 'Email found, please generate reset code on the frontend' });
});

// Reset password route
app.post('/reset-password', async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'No user found with this email' });
    }

    // Update the password (Assuming bcrypt is used for hashing passwords)
    user.password = newPassword; // You should hash the password before saving it
    await user.save();

    res.status(200).json({ message: 'Password successfully updated' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

