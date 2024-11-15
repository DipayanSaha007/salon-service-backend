const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './dead.env' });

const app = express();
const PORT = process.env.PORT || 5000;

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

// Update Profile Route
app.post('/update-profile', async (req, res) => {
    const { username, email, newPassword } = req.body;

    if (!username || !email || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ username, email });

        if (!user) {
            return res.status(400).json({ message: 'User with this username and email not found' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
