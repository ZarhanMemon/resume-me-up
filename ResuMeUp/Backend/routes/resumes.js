import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Resume, { find, countDocuments, findOne, findOneAndUpdate, findOneAndDelete } from '../models/Resume.js';
import User from '../models/Users.js';
import auth from '../middlewares/auth.js';

const router = Router();

// @route   GET /api/resumes
// @desc    Get all resumes for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = { user: req.user.id };
    
    // Filter by status
    if (status && ['draft', 'active', 'archived'].includes(status)) {
      query.status = status;
    }
    
    // Search in title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const resumes = await find(query)
      .sort({ lastModified: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');
    
    const total = await countDocuments(query);
    
    res.json({
      success: true,
      data: resumes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve arsenal'
    });
  }
});

// @route   GET /api/resumes/:id
// @desc    Get single resume
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found in your arsenal'
      });
    }
    
    // Increment view count
    await resume.incrementViews();
    
    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume'
    });
  }
});

// @route   POST /api/resumes
// @desc    Create new resume
// @access  Private
router.post('/', [
  auth,
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('template')
    .isIn(['shadow-hunter', 'iron-warrior', 'assassin-blade', 'shadow-monarch'])
    .withMessage('Invalid template selected'),
  body('personalInfo.fullName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Full name is required'),
  body('personalInfo.email')
    .isEmail()
    .withMessage('Valid email is required')
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

    const resumeData = {
      ...req.body,
      user: req.user.id
    };

    const resume = new Resume(resumeData);
    await resume.save();
    
    // Level up the user
    req.user.levelUp();
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Resume forged successfully! You gained experience.',
      data: resume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to forge resume'
    });
  }
});

// @route   PUT /api/resumes/:id
// @desc    Update resume
// @access  Private
router.put('/:id', [
  auth,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
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

    const resume = await findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, lastModified: new Date() },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found in your arsenal'
      });
    }

    res.json({
      success: true,
      message: 'Resume enhanced successfully',
      data: resume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enhance resume'
    });
  }
});

// @route   DELETE /api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found in your arsenal'
      });
    }

    res.json({
      success: true,
      message: 'Resume dissolved into shadows'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume'
    });
  }
});

// @route   POST /api/resumes/:id/duplicate
// @desc    Duplicate resume
// @access  Private
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalResume = await findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found in your arsenal'
      });
    }

    const duplicatedResume = new Resume({
      ...originalResume.toObject(),
      _id: undefined,
      title: `${originalResume.title} (Copy)`,
      status: 'draft',
      views: 0,
      downloads: 0,
      createdAt: undefined,
      updatedAt: undefined
    });

    await duplicatedResume.save();

    res.status(201).json({
      success: true,
      message: 'Resume cloned successfully',
      data: duplicatedResume
    });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clone resume'
    });
  }
});

// @route   POST /api/resumes/:id/download
// @desc    Track resume download
// @access  Private
router.post('/:id/download', auth, async (req, res) => {
  try {
    const resume = await findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    await resume.incrementDownloads();

    res.json({
      success: true,
      message: 'Download tracked'
    });
  } catch (error) {
    console.error('Track download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track download'
    });
  }
});

export default router;