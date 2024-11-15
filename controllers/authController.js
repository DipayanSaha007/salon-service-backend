const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Simulate a simple in-memory "database"
let users = []; // You would replace this with a real database (e.g., MongoDB, MySQL)

// Sign Up Controller
const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  // Check if the user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create the user and store it in "database"
    const newUser = { username, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Sign In Controller
const signIn = async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  try {
    // Compare password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Sign in successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export controllers
module.exports = {
  signUp,
  signIn
};
