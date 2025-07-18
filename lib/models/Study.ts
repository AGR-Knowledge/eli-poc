import mongoose, { Schema, Document } from 'mongoose';

// CDISC/SDTM/ADaM-compliant Study model capturing all tab data
export interface IStudy extends Document {
  // ===== OVERVIEW TAB DATA =====
  // Study identification (DM domain equivalent)
  studyId: string;                    // STUDYID - Unique study identifier
  studyName?: string;                 // Study name/title
  studyDescription?: string;          // Study description
  
  // Protocol information
  protocolNumber?: string;            // Protocol number
  protocolVersion?: string;           // Protocol version
  protocolDate?: Date;                // Protocol date
  protocolTitle?: string;             // Full protocol title
  protocolShortTitle?: string;        // Short protocol title
  
  // Study classification (CDISC standards)
  studyType?: 'INTERVENTIONAL' | 'OBSERVATIONAL' | 'EXPANDED_ACCESS';
  studyPhase?: 'I' | 'II' | 'III' | 'IV' | 'PILOT' | 'FEASIBILITY';
  therapeuticArea?: string;           // Therapeutic area (e.g., Endocrinology)
  indication?: string;                // Primary indication
  keywords: string[];                 // Study keywords
  
  // Organization information
  sponsor: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
  cro: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
  principalInvestigator: {
    name?: string;
    affiliation?: string;
    email?: string;
    phone?: string;
    type?: string;
  };
  
  // Study status and timeline
  studyStatus: 'DRAFT' | 'PLANNING' | 'ACTIVE' | 'RECRUITING' | 'SUSPENDED' | 'COMPLETED' | 'TERMINATED';
  statusHistory: Array<{
    status: string;
    date: Date;
    reason: string;
  }>;
  milestones: {
    firstPatientIn: Date;
    lastPatientIn: Date;
    lastPatientOut: Date;
    databaseLock: Date;
  };
  
  // Enrollment information
  plannedEnrollment?: number;         // Target enrollment
  currentEnrollment?: number;         // Current enrollment
  enrollmentStatus: 'NOT_STARTED' | 'RECRUITING' | 'ACTIVE' | 'COMPLETED';
  
  // Progress tracking
  completionPercentage: number;       // Study completion percentage
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  processingStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  lastActivity: string;               // Last activity timestamp
  
  // ===== DESIGN TAB DATA =====
  // Study design
  studyDesign: {
    type: 'PARALLEL_GROUP' | 'CROSSOVER' | 'FACTORIAL' | 'SINGLE_GROUP';
    allocation: 'RANDOMIZED' | 'NON_RANDOMIZED';
    blinding: {
      type: 'OPEN' | 'SINGLE_BLIND' | 'DOUBLE_BLIND' | 'TRIPLE_BLIND';
      blindedRoles: string[];
      unblindingProcedure: string;
    };
    control: {
      type: 'PLACEBO' | 'ACTIVE' | 'NO_TREATMENT';
      description: string;
    };
  };
  
  // Population
  population: {
    target: string;
    plannedSize: number;
    ageRange: {
      minimum: number;
      maximum?: number;
      unit: string;
    };
    genderEligibility: string;
    healthyVolunteers: boolean;
    geographicScope: string;
  };
  
  // Inclusion/Exclusion criteria
  inclusionCriteria: Array<{
    id: string;
    text: string;
    category: string;
    aiConfidence?: number;
  }>;
  exclusionCriteria: Array<{
    id: string;
    text: string;
    category: string;
    aiConfidence?: number;
  }>;
  
  // ===== TIMELINE TAB DATA =====
  // Study epochs
  epochs: Array<{
    code: string;
    name: string;
    description: string;
    order: number;
    duration: {
      value: number;
      unit: string;
      range?: {
        min: number;
        max: number;
      };
    };
    isTreatment: boolean;
  }>;
  
  // Study visits
  visits: Array<{
    number: number;
    code: string;
    name: string;
    epoch: string;
    nominalDay: number;
    window: {
      before: number;
      after: number;
      unit: string;
    };
    type: string;
    required: boolean;
    procedures: Array<{
      name: string;
      timing: string;
      required: boolean;
    }>;
  }>;
  
  // ===== ARMS TAB DATA =====
  // Treatment arms
  treatmentArms: Array<{
    code: string;
    name: string;
    description: string;
    type: 'EXPERIMENTAL' | 'PLACEBO_COMPARATOR' | 'ACTIVE_COMPARATOR';
    plannedSubjects: number;
    interventions: Array<{
      code: string;
      name: string;
      type: string;
      dosing: {
        route: string;
        form: string;
        strength: string;
        frequency: string;
      };
    }>;
  }>;
  
  // ===== OBJECTIVES TAB DATA =====
  // Study objectives
  objectives: Array<{
    type: 'PRIMARY' | 'SECONDARY' | 'EXPLORATORY';
    number: number;
    description: string;
    endpoints: Array<{
      type: string;
      title: string;
      description: string;
      measurement: {
        parameter: string;
        method: string;
        timepoints: string[];
        units: string;
      };
    }>;
  }>;
  
  // ===== ASSESSMENTS TAB DATA =====
  // Study assessments
  assessments: {
    safetyAssessments: Array<{
      id: string;
      name: string;
      description: string;
      frequency: string;
      required: boolean;
    }>;
    efficacyAssessments: Array<{
      id: string;
      name: string;
      description: string;
      frequency: string;
      required: boolean;
    }>;
    pkAssessments: Array<{
      id: string;
      name: string;
      description: string;
      frequency: string;
      required: boolean;
    }>;
    biomarkerAssessments: Array<{
      id: string;
      name: string;
      description: string;
      frequency: string;
      required: boolean;
    }>;
  };
  
  // ===== AUDIT TAB DATA =====
  // Regulatory compliance
  regulatoryCompliance: {
    authority: string;
    gcpStandard: string;
    dataIntegrityLevel: string;
  };
  
  // Audit trail settings
  auditTrailSettings: {
    auditLevel: string;
    retentionPeriod: string;
    electronicSignatureRequired: boolean;
  };
  
  // User roles and permissions
  userRoles: Array<{
    roleName: string;
    permissionLevel: string;
    dataAccess: string;
  }>;
  
  // Data security
  dataSecurity: {
    encryptionLevel: string;
    backupFrequency: string;
    privacyCompliance: string[];
  };
  
  // ===== AI INSIGHTS TAB DATA =====
  // AI-generated insights
  aiInsights: {
    protocolDeviationPrediction: {
      status: string;
      riskScore: number;
      predictedDeviations: Array<{
        type: string;
        likelihood: string;
        details: string;
      }>;
      recommendations: string;
    };
    enrollmentForecast: {
      status: string;
      currentEnrollment: number;
      targetEnrollment: number;
      projectedCompletionDate: Date;
      onTrack: boolean;
      variance: string;
      factors: string[];
    };
    dataQualityAnomalies: {
      status: string;
      anomaliesDetected: number;
      criticalAnomalies: number;
      details: Array<{
        type: string;
        field: string;
        subject: string;
        visit: string;
      }>;
      recommendations: string;
    };
  };
  
  // Additional fields mentioned in error
  dataManager: string;
  startDate: Date;
  studyCoordinator: string;
  
  // ===== FILE UPLOAD DATA =====
  // File upload information
  uploadedFiles?: Array<{
    fileName: string;
    originalName: string;
    s3Uri: string;
    fileSize: number;
    contentType: string;
    uploadDate: Date;
    processingStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED';
    extractedData?: any;
    extractionConfidence?: number;
    processingTime?: number;
    errorMessage?: string;
  }>;
  
  // ===== METADATA =====
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

const StudySchema = new Schema<IStudy>({
  // ===== OVERVIEW TAB DATA =====
  studyId: { type: String, required: true, unique: true },
  studyName: { type: String, required: false },
  studyDescription: { type: String, required: false },
  
  // Protocol information
  protocolNumber: { type: String, required: false },
  protocolVersion: { type: String, default: '1.0' },
  protocolDate: { type: Date, required: false },
  protocolTitle: { type: String, required: false },
  protocolShortTitle: { type: String, required: false },
  
  // Study classification
  studyType: { 
    type: String, 
    enum: ['INTERVENTIONAL', 'OBSERVATIONAL', 'EXPANDED_ACCESS'],
    required: false,
    default: 'INTERVENTIONAL'
  },
  studyPhase: { 
    type: String, 
    enum: ['I', 'II', 'III', 'IV', 'PILOT', 'FEASIBILITY'],
    required: false,
    default: 'I'
  },
  therapeuticArea: { type: String, required: false },
  indication: { type: String, required: false },
  keywords: [{ type: String }],
  
  // Organization information
  sponsor: {
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    role: { type: String, default: 'SPONSOR' }
  },
  cro: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    role: { type: String, default: 'CRO' }
  },
  principalInvestigator: {
    name: { type: String, required: false },
    affiliation: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    type: { type: String, default: 'GLOBAL_PI' }
  },
  
  // Study status and timeline
  studyStatus: { 
    type: String, 
    enum: ['DRAFT', 'PLANNING', 'ACTIVE', 'RECRUITING', 'SUSPENDED', 'COMPLETED', 'TERMINATED'],
    default: 'DRAFT'
  },
  statusHistory: [{
    status: { type: String, required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true }
  }],
  milestones: {
    firstPatientIn: { type: Date },
    lastPatientIn: { type: Date },
    lastPatientOut: { type: Date },
    databaseLock: { type: Date }
  },
  
  // Enrollment information
  plannedEnrollment: { type: Number, required: false, min: 0, default: 0 },
  currentEnrollment: { type: Number, default: 0 },
  enrollmentStatus: { 
    type: String, 
    enum: ['NOT_STARTED', 'RECRUITING', 'ACTIVE', 'COMPLETED'],
    default: 'NOT_STARTED'
  },
  
  // Progress tracking
  completionPercentage: { type: Number, default: 0 },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  processingStatus: { 
    type: String, 
    enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED'
  },
  lastActivity: { type: String, default: 'Just now' },
  
  // ===== DESIGN TAB DATA =====
  studyDesign: {
    type: { 
      type: String, 
      enum: ['PARALLEL_GROUP', 'CROSSOVER', 'FACTORIAL', 'SINGLE_GROUP'],
      default: 'PARALLEL_GROUP'
    },
    allocation: { 
      type: String, 
      enum: ['RANDOMIZED', 'NON_RANDOMIZED'],
      default: 'RANDOMIZED'
    },
    blinding: {
      type: { 
        type: String, 
        enum: ['OPEN', 'SINGLE_BLIND', 'DOUBLE_BLIND', 'TRIPLE_BLIND'],
        default: 'DOUBLE_BLIND'
      },
      blindedRoles: [{ type: String }],
      unblindingProcedure: { type: String }
    },
    control: {
      type: { 
        type: String, 
        enum: ['PLACEBO', 'ACTIVE', 'NO_TREATMENT'],
        default: 'PLACEBO'
      },
      description: { type: String, default: 'Matching placebo' }
    }
  },
  
  population: {
    target: { type: String, default: 'Not specified' },
    plannedSize: { type: Number, default: 0 },
    ageRange: {
      minimum: { type: Number, default: 18 },
      maximum: { type: Number },
      unit: { type: String, default: 'YEARS' }
    },
    genderEligibility: { type: String, default: 'ALL' },
    healthyVolunteers: { type: Boolean, default: false },
    geographicScope: { type: String, default: 'SINGLE_COUNTRY' }
  },
  
  inclusionCriteria: [{
    id: { type: String, required: false },
    text: { type: String, required: false },
    category: { type: String, required: false },
    aiConfidence: { type: Number, min: 0, max: 1 }
  }],
  exclusionCriteria: [{
    id: { type: String, required: false },
    text: { type: String, required: false },
    category: { type: String, required: false },
    aiConfidence: { type: Number, min: 0, max: 1 }
  }],
  
  // ===== TIMELINE TAB DATA =====
  epochs: [{
    code: { type: String, required: false, default: () => Math.random().toString(36).substr(2, 9) },
    name: { type: String, required: false, default: 'To be specified' },
    description: { type: String, required: false, default: 'To be specified' },
    order: { type: Number, required: false, default: 1 },
    duration: {
      value: { type: Number, required: false, default: 0 },
      unit: { type: String, required: false, default: 'DAYS' },
      range: {
        min: { type: Number },
        max: { type: Number }
      }
    },
    isTreatment: { type: Boolean, required: false, default: false }
  }],
  
  visits: [{
    number: { type: Number, required: false, default: 1 },
    code: { type: String, required: false, default: () => Math.random().toString(36).substr(2, 9) },
    name: { type: String, required: false, default: 'To be specified' },
    epoch: { type: String, required: false, default: 'SCREENING' },
    nominalDay: { type: Number, required: false, default: 0 },
    window: {
      before: { type: Number, required: false, default: 0 },
      after: { type: Number, required: false, default: 0 },
      unit: { type: String, required: false, default: 'DAYS' }
    },
    type: { type: String, required: false, default: 'SCREENING' },
    required: { type: Boolean, required: false, default: true },
    procedures: [{
      name: { type: String, required: false, default: 'To be specified' },
      timing: { type: String, required: false, default: 'BASELINE' },
      required: { type: Boolean, required: false, default: true }
    }]
  }],
  
  // ===== ARMS TAB DATA =====
  treatmentArms: [{
    code: { type: String, required: false, default: () => Math.random().toString(36).substr(2, 9) },
    name: { type: String, required: false, default: 'To be specified' },
    description: { type: String, required: false, default: 'To be specified' },
    type: { 
      type: String, 
      enum: ['EXPERIMENTAL', 'PLACEBO_COMPARATOR', 'ACTIVE_COMPARATOR'],
      required: false,
      default: 'EXPERIMENTAL'
    },
    plannedSubjects: { type: Number, required: false, default: 0 },
    interventions: [{
      code: { type: String, required: false, default: () => Math.random().toString(36).substr(2, 9) },
      name: { type: String, required: false, default: 'To be specified' },
      type: { type: String, required: false, default: 'DRUG' },
      dosing: {
        route: { type: String, required: false, default: 'ORAL' },
        form: { type: String, required: false, default: 'TABLET' },
        strength: { type: String, required: false, default: '10MG' },
        frequency: { type: String, required: false, default: 'ONCE_DAILY' }
      }
    }]
  }],
  
  // ===== OBJECTIVES TAB DATA =====
  objectives: [{
    type: { 
      type: String, 
      enum: ['PRIMARY', 'SECONDARY', 'EXPLORATORY'],
      required: false,
      default: 'PRIMARY'
    },
    number: { type: Number, required: false, default: 1 },
    description: { type: String, required: false, default: 'To be specified' },
    endpoints: [{
      type: { type: String, required: false, default: 'PRIMARY' },
      title: { type: String, required: false, default: 'To be specified' },
      description: { type: String, required: false, default: 'To be specified' },
      measurement: {
        parameter: { type: String, required: false, default: 'To be specified' },
        method: { type: String, required: false, default: 'CENTRAL_LAB' },
        timepoints: [{ type: String }],
        units: { type: String, required: false, default: 'To be specified' }
      }
    }]
  }],
  
  // ===== ASSESSMENTS TAB DATA =====
  assessments: {
    safetyAssessments: [{
      id: { type: String, required: false, default: () => Math.random().toString(36).substr(2, 9) },
      name: { type: String, required: false, default: 'To be specified' },
      description: { type: String, required: false, default: 'To be specified' },
      frequency: { type: String, required: false, default: 'BASELINE' },
      required: { type: Boolean, required: false, default: true }
    }],
    efficacyAssessments: [{
      id: { type: String, required: false, default: () => Math.random().toString(36).substr(2, 9) },
      name: { type: String, required: false, default: 'To be specified' },
      description: { type: String, required: false, default: 'To be specified' },
      frequency: { type: String, required: false, default: 'BASELINE' },
      required: { type: Boolean, required: false, default: true }
    }],
    pkAssessments: [{
      id: { type: String, required: false, default: () => Math.random().toString(36).substr(2, 9) },
      name: { type: String, required: false, default: 'To be specified' },
      description: { type: String, required: false, default: 'To be specified' },
      frequency: { type: String, required: false, default: 'BASELINE' },
      required: { type: Boolean, required: false, default: true }
    }],
    biomarkerAssessments: [{
      id: { type: String, required: false, default: () => Math.random().toString(36).substr(2, 9) },
      name: { type: String, required: false, default: 'To be specified' },
      description: { type: String, required: false, default: 'To be specified' },
      frequency: { type: String, required: false, default: 'BASELINE' },
      required: { type: Boolean, required: false, default: true }
    }]
  },
  
  // ===== AUDIT TAB DATA =====
  regulatoryCompliance: {
    authority: { type: String, default: 'FDA' },
    gcpStandard: { type: String, default: 'ICH_GCP' },
    dataIntegrityLevel: { type: String, default: 'STANDARD' }
  },
  
  auditTrailSettings: {
    auditLevel: { type: String, default: 'STANDARD' },
    retentionPeriod: { type: String, default: '10_YEARS' },
    electronicSignatureRequired: { type: Boolean, default: true }
  },
  
  userRoles: [{
    roleName: { type: String, default: 'Principal Investigator' },
    permissionLevel: { type: String, default: 'DATA_ENTRY' },
    dataAccess: { type: String, default: 'OWN_SITE' }
  }],
  
  dataSecurity: {
    encryptionLevel: { type: String, default: 'AES_256' },
    backupFrequency: { type: String, default: 'DAILY' },
    privacyCompliance: [{ type: String }]
  },
  
  // ===== AI INSIGHTS TAB DATA =====
  aiInsights: {
    protocolDeviationPrediction: {
      status: { type: String, required: false, default: 'NOT_ANALYZED' },
      riskScore: { type: Number, min: 0, max: 1, default: 0 },
      predictedDeviations: [{
        type: { type: String, required: false, default: 'UNKNOWN' },
        likelihood: { type: String, required: false, default: 'LOW' },
        details: { type: String, required: false, default: 'No details available' }
      }],
      recommendations: { type: String, default: 'No recommendations available' }
    },
    enrollmentForecast: {
      status: { type: String, required: false, default: 'NOT_ANALYZED' },
      currentEnrollment: { type: Number, required: false, default: 0 },
      targetEnrollment: { type: Number, required: false, default: 0 },
      projectedCompletionDate: { type: Date },
      onTrack: { type: Boolean, required: false, default: false },
      variance: { type: String, default: 'N/A' },
      factors: [{ type: String }]
    },
    dataQualityAnomalies: {
      status: { type: String, required: false, default: 'NOT_ANALYZED' },
      anomaliesDetected: { type: Number, required: false, default: 0 },
      criticalAnomalies: { type: Number, required: false, default: 0 },
      details: [{
        type: { type: String, required: false, default: 'UNKNOWN' },
        field: { type: String, required: false, default: 'UNKNOWN' },
        subject: { type: String, required: false, default: 'UNKNOWN' },
        visit: { type: String, required: false, default: 'UNKNOWN' }
      }],
      recommendations: { type: String, default: 'No recommendations available' }
    }
  },
  
  // Additional fields mentioned in error
  dataManager: { type: String, default: 'Not specified' },
  startDate: { type: Date, default: Date.now },
  studyCoordinator: { type: String, default: 'Not specified' },
  
  // ===== FILE UPLOAD DATA =====
  uploadedFiles: [{
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    s3Uri: { type: String, required: true },
    fileSize: { type: Number, required: true },
    contentType: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    processingStatus: { 
      type: String, 
      enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PROCESSING'
    },
    extractedData: { type: Schema.Types.Mixed },
    extractionConfidence: { type: Number, min: 0, max: 1 },
    processingTime: { type: Number },
    errorMessage: { type: String }
  }],
  
  // ===== METADATA =====
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: false, default: 'System' },
  updatedBy: { type: String, required: false, default: 'System' }
}, {
  timestamps: true
});

// Indexes for better query performance
StudySchema.index({ studyStatus: 1 });
StudySchema.index({ studyPhase: 1 });
StudySchema.index({ therapeuticArea: 1 });
StudySchema.index({ createdAt: -1 });

export default mongoose.models.Study || mongoose.model<IStudy>('Study', StudySchema); 