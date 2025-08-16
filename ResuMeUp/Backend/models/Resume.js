import { Schema, model } from 'mongoose';

const experienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  isCurrentJob: { type: Boolean, default: false },
  description: { type: String },
  achievements: [String]
});

const educationSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  gpa: { type: String },
  description: { type: String }
});

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  technologies: [String],
  startDate: { type: String },
  endDate: { type: String },
  url: { type: String },
  githubUrl: { type: String }
});

const resumeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  template: {
    type: String,
    required: true,
    enum: ['shadow-hunter', 'iron-warrior', 'assassin-blade', 'shadow-monarch'],
    default: 'shadow-hunter'
  },
  
  // Personal Information
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    website: { type: String },
    linkedin: { type: String },
    github: { type: String },
    summary: { type: String }
  },

  // Experience
  experience: [experienceSchema],
  
  // Education
  education: [educationSchema],
  
  // Projects
  projects: [projectSchema],
  
  // Skills
  skills: {
    technical: [String],
    languages: [String],
    frameworks: [String],
    tools: [String],
    soft: [String]
  },
  
  // Additional sections
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String },
    date: { type: String },
    url: { type: String }
  }],
  
  achievements: [String],
  languages: [{
    name: { type: String, required: true },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] }
  }],
  
  // Analytics
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  
  isPublic: { type: Boolean, default: false },
  lastModified: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Update lastModified on save
resumeSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Increase view count
resumeSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Increase download count
resumeSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

export default model('Resume', resumeSchema);
