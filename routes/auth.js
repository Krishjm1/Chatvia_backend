const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, username: user.username });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Authenticate user and login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get all users (for ContactsList)
router.get('/users', protect, async (req, res) => {
  try {
    // Fetch all users except the current user
    const users = await User.find({ _id: { $ne: req.user._id } }).select('username email isOnline');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

