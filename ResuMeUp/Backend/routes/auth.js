import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User, { findOne, findById } from '../models/Users.js';
import auth from '../middlewares/auth.js';

const router = Router();

// Generate JWT token
const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/auth/register
// @desc    Register new hunter
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Hunter name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if hunter already exists
    let user = await findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'A hunter with this email already exists in the guild'
      });
    }

    // Create new hunter
    user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Hunter registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hunterRank: user.hunterRank,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'The shadows interfered with registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login hunter
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find hunter and include password
    const user = await findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No hunter found with this email'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid shadow energy signature'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Welcome back, hunter',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hunterRank: user.hunterRank,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'The shadows interfered with login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current hunter
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hunterRank: user.hunterRank,
        level: user.level,
        experience: user.experience,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hunter data'
    });
  }
});

export default router;