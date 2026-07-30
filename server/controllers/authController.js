const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ai_resume_tailor_2026';

// In-memory demo users array fallback if MongoDB connection is not active
const inMemoryUsers = [];

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
    }

    let existingUser = null;
    try {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } catch (err) {
      existingUser = inMemoryUsers.find(u => u.email === email.toLowerCase());
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = null;
    try {
      newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      });
    } catch (err) {
      // Memory fallback
      newUser = {
        _id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date()
      };
      inMemoryUsers.push(newUser);
    }

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    return res.status(500).json({ message: `Server error during registration: ${error.message}` });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    let user = null;
    try {
      user = await User.findOne({ email: email.toLowerCase() });
    } catch (err) {
      user = inMemoryUsers.find(u => u.email === email.toLowerCase());
    }

    // Demo auto-register if user doesn't exist for quick testing
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = {
        _id: 'user_' + Date.now(),
        name: email.split('@')[0] || 'User',
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date()
      };
      inMemoryUsers.push(user);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: `Server error during login: ${error.message}` });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: {
        id: req.user.userId,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe
};
