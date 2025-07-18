import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// User roles for role-based access control
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STUDY_MANAGER = 'STUDY_MANAGER',
  DATA_MANAGER = 'DATA_MANAGER',
  CLINICAL_RESEARCHER = 'CLINICAL_RESEARCHER',
  PRINCIPAL_INVESTIGATOR = 'PRINCIPAL_INVESTIGATOR',
  SITE_COORDINATOR = 'SITE_COORDINATOR',
  MONITOR = 'MONITOR',
  VIEWER = 'VIEWER'
}

// User status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_APPROVAL = 'PENDING_APPROVAL'
}

// SSO provider types
export enum SSOProvider {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  SAML = 'saml',
  LOCAL = 'local'
}

// User interface
export interface IUser extends Document {
  // Basic information
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  
  // Authentication
  password?: string; // Optional for SSO users
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  
  // SSO information
  ssoProvider?: SSOProvider;
  ssoId?: string; // External ID from SSO provider
  ssoData?: {
    provider: SSOProvider;
    providerId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  
  // Role and permissions
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  
  // Organization information
  organization: {
    name: string;
    type: 'SPONSOR' | 'CRO' | 'SITE' | 'LABORATORY' | 'REGULATORY';
    id: string;
  };
  
  // Study access
  assignedStudies: string[]; // Study IDs the user has access to
  assignedSites: string[]; // Site IDs the user has access to
  
  // Profile information
  phone?: string;
  department?: string;
  jobTitle?: string;
  timezone?: string;
  language?: string;
  
  // Security
  lastLoginAt?: Date;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  generateEmailVerificationToken(): string;
  isLocked(): boolean;
  incrementFailedLoginAttempts(): Promise<void>;
  resetFailedLoginAttempts(): Promise<void>;
}

const UserSchema = new Schema<IUser>({
  // Basic information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  
  // Authentication
  password: {
    type: String,
    minlength: 8,
    select: false // Don't include password in queries by default
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  
  // SSO information
  ssoProvider: {
    type: String,
    enum: Object.values(SSOProvider)
  },
  ssoId: {
    type: String,
    index: true
  },
  ssoData: {
    provider: {
      type: String,
      enum: Object.values(SSOProvider)
    },
    providerId: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Date
  },
  
  // Role and permissions
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.VIEWER,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.PENDING_APPROVAL,
    required: true
  },
  permissions: [{
    type: String,
    trim: true
  }],
  
  // Organization information
  organization: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['SPONSOR', 'CRO', 'SITE', 'LABORATORY', 'REGULATORY'],
      required: true
    },
    id: {
      type: String,
      required: true,
      trim: true
    }
  },
  
  // Study access
  assignedStudies: [{
    type: String,
    ref: 'Study'
  }],
  assignedSites: [{
    type: String,
    ref: 'Site'
  }],
  
  // Profile information
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  language: {
    type: String,
    default: 'en'
  },
  
  // Security
  lastLoginAt: {
    type: Date
  },
  lastLoginIp: {
    type: String
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockedUntil: {
    type: Date
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  
  // Audit fields
  createdBy: {
    type: String,
    default: 'system'
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ ssoProvider: 1, ssoId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ organization: 1 });
UserSchema.index({ assignedStudies: 1 });
UserSchema.index({ assignedSites: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance methods
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generatePasswordResetToken = function(): string {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = token;
  this.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  return token;
};

UserSchema.methods.generateEmailVerificationToken = function(): string {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 86400000); // 24 hours
  return token;
};

UserSchema.methods.isLocked = function(): boolean {
  return this.lockedUntil && this.lockedUntil > new Date();
};

UserSchema.methods.incrementFailedLoginAttempts = async function(): Promise<void> {
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts for 30 minutes
  if (this.failedLoginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 1800000); // 30 minutes
  }
  
  await this.save();
};

UserSchema.methods.resetFailedLoginAttempts = async function(): Promise<void> {
  this.failedLoginAttempts = 0;
  this.lockedUntil = undefined;
  await this.save();
};

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findBySSO = function(provider: SSOProvider, providerId: string) {
  return this.findOne({ ssoProvider: provider, ssoId: providerId });
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 