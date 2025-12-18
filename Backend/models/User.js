import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  organization: {
    type: String,
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  role: {
    type: String,
    enum: ['user', 'analyst', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    defaultPlatform: {
      type: String,
      enum: ['all', 'twitter', 'instagram', 'linkedin', 'facebook'],
      default: 'all'
    },
    dateRange: {
      type: String,
      enum: ['7d', '30d', '90d', '1y'],
      default: '30d'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    }
  },
  connectedPlatforms: [{
    platform: {
      type: String,
      enum: ['twitter', 'instagram', 'linkedin', 'facebook']
    },
    accessToken: String,
    refreshToken: String,
    connectedAt: Date,
    expiresAt: Date
  }],
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster email lookups
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (exclude sensitive data)
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    organization: this.organization,
    role: this.role,
    avatar: this.avatar,
    preferences: this.preferences,
    connectedPlatforms: this.connectedPlatforms?.map(p => ({
      platform: p.platform,
      connectedAt: p.connectedAt
    })),
    createdAt: this.createdAt
  };
};

const User = mongoose.model('User', userSchema);

export default User;


