import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { findById, findOne, findByIdAndUpdate } from '../models/Users.js';
import { aggregate, find } from '../models/Resume.js';
import auth from '../middlewares/auth.js';

const router = Router();

// @route   GET /api/users/profile
// @desc    Get user profile with stats
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await findById(req.user.id).select('-password');
    
    // Get resume stats
    const resumeStats = await aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalResumes: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalDownloads: { $sum: '$downloads' },
          activeResumes: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = resumeStats[0] || {
      totalResumes: 0,
      totalViews: 0,
      totalDownloads: 0,
      activeResumes: 0
    };

    res.json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hunter profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
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

    const { name, email, avatar } = req.body;
    
    // Check if email already exists (if updating email)
    if (email && email !== req.user.email) {
      const existingUser = await findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another hunter'
        });
      }
    }

    const updatedUser = await findByIdAndUpdate(
      req.user.id,
      { 
        ...(name && { name }),
        ...(email && { email }),
        ...(avatar && { avatar })
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Hunter profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hunter profile'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get recent resumes
    const recentResumes = await find({ user: req.user.id })
      .sort({ lastModified: -1 })
      .limit(5)
      .select('title template status lastModified views downloads');

    // Get activity data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activityStats = await aggregate([
      { 
        $match: { 
          user: req.user._id,
          updatedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }
          },
          resumesUpdated: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        recentResumes,
        activityStats,
        hunterLevel: req.user.level,
        hunterRank: req.user.hunterRank,
        experience: req.user.experience
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load command center'
    });
  }
});

export default router;