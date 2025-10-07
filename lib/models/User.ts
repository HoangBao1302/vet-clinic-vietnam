import mongoose, { Schema, models } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  membershipTier: 'free' | 'paid';
  isPaid: boolean;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  premiumPostsReadThisMonth: number;
  lastPremiumPostReset: Date;
  downloadsThisMonth: {
    eaDemo: number;
    indicators: number;
  };
  lastDownloadReset: Date;
  purchasedProducts: string[];
  affiliateStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  affiliateCode?: string;
  totalPostsRead: number;
  readingTimeMinutes: number;
  favoriteCategories: string[];
  lastReadDate?: Date;
  newsletterSubscribed: boolean;
  newsletterEmail?: string;
  newsletterSubscribedAt?: Date;
  newsletterUnsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    membershipTier: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    premiumPostsReadThisMonth: {
      type: Number,
      default: 0,
    },
    lastPremiumPostReset: {
      type: Date,
      default: Date.now,
    },
    downloadsThisMonth: {
      eaDemo: {
        type: Number,
        default: 0,
      },
      indicators: {
        type: Number,
        default: 0,
      },
    },
    lastDownloadReset: {
      type: Date,
      default: Date.now,
    },
    purchasedProducts: {
      type: [String],
      default: [],
    },
    affiliateStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },
    affiliateCode: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to not be unique
    },
    totalPostsRead: {
      type: Number,
      default: 0,
    },
    readingTimeMinutes: {
      type: Number,
      default: 0,
    },
    favoriteCategories: {
      type: [String],
      default: [],
    },
    lastReadDate: {
      type: Date,
    },
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    newsletterEmail: {
      type: String,
    },
    newsletterSubscribedAt: {
      type: Date,
    },
    newsletterUnsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

