import mongoose, { Schema, Document } from 'mongoose';

// CDISC/SDTM-compliant Site model (DM domain equivalent)
export interface ISite extends Document {
  // Site identification
  siteId: string;                     // SITEID - Unique site identifier
  studyId: string;                    // STUDYID - Reference to study
  siteNumber: string;                 // Site number (e.g., "001", "002")
  siteName: string;                   // Site name
  
  // Site information
  siteType: 'INVESTIGATIONAL' | 'CRO' | 'LABORATORY' | 'IMAGING';
  siteStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'TERMINATED';
  
  // Location information
  country: string;                    // Country
  state: string;                      // State/Province
  city: string;                       // City
  address: string;                    // Full address
  
  // Contact information
  principalInvestigator: string;      // Principal investigator name
  siteCoordinator: string;            // Site coordinator name
  contactEmail: string;               // Contact email
  contactPhone: string;               // Contact phone
  
  // Regulatory information
  regulatoryNumber: string;           // Regulatory approval number
  irbNumber: string;                  // IRB/EC approval number
  irbExpiryDate: Date;                // IRB/EC expiry date
  
  // Site capabilities
  maxSubjects: number;                // Maximum subjects this site can enroll
  currentSubjects: number;            // Current subjects enrolled
  siteActivationDate?: Date;          // Site activation date
  firstSubjectDate?: Date;            // First subject enrolled date
  lastSubjectDate?: Date;             // Last subject enrolled date
  
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

const SiteSchema: Schema = new Schema({
  // Site identification
  siteId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  studyId: {
    type: String,
    required: true,
    index: true,
  },
  siteNumber: {
    type: String,
    required: true,
    trim: true,
  },
  siteName: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Site information
  siteType: {
    type: String,
    enum: ['INVESTIGATIONAL', 'CRO', 'LABORATORY', 'IMAGING'],
    default: 'INVESTIGATIONAL',
  },
  siteStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'TERMINATED'],
    default: 'PENDING',
  },
  
  // Location information
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  
  // Contact information
  principalInvestigator: {
    type: String,
    required: true,
  },
  siteCoordinator: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  
  // Regulatory information
  regulatoryNumber: {
    type: String,
    required: true,
  },
  irbNumber: {
    type: String,
    required: true,
  },
  irbExpiryDate: {
    type: Date,
    required: true,
  },
  
  // Site capabilities
  maxSubjects: {
    type: Number,
    required: true,
    min: 1,
  },
  currentSubjects: {
    type: Number,
    default: 0,
    min: 0,
  },
  siteActivationDate: {
    type: Date,
  },
  firstSubjectDate: {
    type: Date,
  },
  lastSubjectDate: {
    type: Date,
  },
  
  // Audit fields
  createdBy: {
    type: String,
    required: true,
    default: 'system',
  },
  updatedBy: {
    type: String,
    required: true,
    default: 'system',
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
SiteSchema.index({ siteId: 1 });
SiteSchema.index({ studyId: 1 });
SiteSchema.index({ siteStatus: 1 });
SiteSchema.index({ country: 1 });
SiteSchema.index({ siteType: 1 });

export default mongoose.models.Site || mongoose.model<ISite>('Site', SiteSchema); 