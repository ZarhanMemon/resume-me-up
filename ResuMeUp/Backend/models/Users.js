import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const { hash, compare } = bcrypt;

// Define User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Hunter name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: ''
  },
  hunterRank: {
    type: String,
    enum: ['E-Rank', 'D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank', 'SSS-Rank'],
    default: 'E-Rank'
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  experience: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await compare(candidatePassword, this.password);
};

// Level up method
userSchema.methods.levelUp = function() {
  this.experience += 10;

  if (this.experience >= this.level * 100) {
    this.level += 1;
    this.experience = 0;

    // Update rank based on level
    if (this.level >= 80) this.hunterRank = 'SSS-Rank';
    else if (this.level >= 60) this.hunterRank = 'S-Rank';
    else if (this.level >= 40) this.hunterRank = 'A-Rank';
    else if (this.level >= 25) this.hunterRank = 'B-Rank';
    else if (this.level >= 15) this.hunterRank = 'C-Rank';
    else if (this.level >= 8) this.hunterRank = 'D-Rank';
  }
};

export default model('User', userSchema);
