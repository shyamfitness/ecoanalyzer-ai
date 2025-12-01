import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    defaultOrigin: {
      type: String,
      default: 'Unknown'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  analytics: {
    totalAnalyses: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    bestGrade: {
      type: String,
      default: null
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update analytics when new analysis is added
userSchema.methods.updateAnalytics = function(score, grade) {
  this.analytics.totalAnalyses += 1;
  
  // Calculate new average
  const totalScore = this.analytics.averageScore * (this.analytics.totalAnalyses - 1) + score;
  this.analytics.averageScore = totalScore / this.analytics.totalAnalyses;
  
  // Update best grade
  if (!this.analytics.bestGrade || this.getGradeValue(grade) < this.getGradeValue(this.analytics.bestGrade)) {
    this.analytics.bestGrade = grade;
  }
};

userSchema.methods.getGradeValue = function(grade) {
  const gradeValues = { 'Excellent': 0, 'Good': 1, 'Fair': 2, 'Poor': 3 };
  return gradeValues[grade] || 3;
};

export default mongoose.model('User', userSchema);
