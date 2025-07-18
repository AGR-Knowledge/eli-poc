import mongoose, { Schema, Document } from 'mongoose';

// CDISC Code List Model for standardized terminologies
export interface ICodeList extends Document {
  // Code list identification
  codeListId: string;                // Unique code list identifier
  codeListName: string;              // Code list name
  codeListCode: string;              // CDISC code list code
  codeListVersion: string;           // Code list version
  
  // CDISC metadata
  cdiscDomain: string;               // CDISC domain (e.g., "VS", "LB", "AE")
  cdiscVariable: string;             // CDISC variable name
  cdashQuestion: string;             // CDASH question text
  standardSource: string;            // Standard source (e.g., "CDISC", "WHO", "FDA")
  standardVersion: string;           // Standard version
  
  // Code list configuration
  codeListType: 'CONTROLLED' | 'EXTENSIBLE' | 'CUSTOM';
  dataType: string;                  // Data type (e.g., "CHAR", "NUM")
  format?: string;                   // Format pattern
  length?: number;                   // Maximum length
  
  // Code values
  codes: Array<{
    code: string;                    // Code value
    label: string;                   // Display label
    description?: string;            // Code description
    definition?: string;             // Formal definition
    synonyms?: string[];             // Alternative terms
    order: number;                   // Display order
    active: boolean;                 // Is code active
    deprecated: boolean;             // Is code deprecated
    deprecatedDate?: Date;           // Deprecation date
    replacementCode?: string;        // Replacement code if deprecated
    
    // CDISC metadata
    cdiscCode: string;               // CDISC code
    cdiscLabel: string;              // CDISC label
    cdiscDefinition?: string;        // CDISC definition
    cdiscSynonyms?: string[];        // CDISC synonyms
    
    // Hierarchy information
    parentCode?: string;             // Parent code for hierarchical lists
    level: number;                   // Hierarchy level
    path: string;                    // Full hierarchy path
    
    // Audit fields
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }>;
  
  // Code list relationships
  relationships: Array<{
    relatedCodeListId: string;       // Related code list
    relationshipType: 'SUBSET' | 'SUPERSET' | 'MAPPING' | 'DEPENDENT';
    mappingRules?: Array<{
      sourceCode: string;            // Source code
      targetCode: string;            // Target code
      mappingType: 'DIRECT' | 'CONDITIONAL' | 'CALCULATED';
      condition?: string;            // Mapping condition
    }>;
  }>;
  
  // Validation rules
  validationRules: Array<{
    ruleId: string;                  // Rule identifier
    ruleName: string;                // Rule name
    ruleType: 'REQUIRED' | 'UNIQUE' | 'FORMAT' | 'DEPENDENCY';
    rule: string;                    // Validation rule
    message: string;                 // Error message
    severity: 'ERROR' | 'WARNING' | 'INFO';
  }>;
  
  // Code list metadata
  description: string;               // Code list description
  purpose: string;                   // Purpose of the code list
  usage: string;                     // Usage instructions
  notes: string;                     // Additional notes
  
  // Status and versioning
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;               // Approver
  approvedDate?: Date;               // Approval date
  versionHistory: Array<{
    version: string;                 // Version number
    date: Date;                      // Version date
    changes: string;                 // Change description
    author: string;                  // Author
  }>;
  
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

const CodeListSchema = new Schema<ICodeList>({
  // Code list identification
  codeListId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  codeListName: {
    type: String,
    required: true,
    trim: true,
  },
  codeListCode: {
    type: String,
    required: true,
    trim: true,
  },
  codeListVersion: {
    type: String,
    default: '1.0',
  },
  
  // CDISC metadata
  cdiscDomain: {
    type: String,
    required: true,
    trim: true,
  },
  cdiscVariable: {
    type: String,
    required: true,
    trim: true,
  },
  cdashQuestion: {
    type: String,
    required: true,
    trim: true,
  },
  standardSource: {
    type: String,
    required: true,
    trim: true,
  },
  standardVersion: {
    type: String,
    default: 'CDISC 2.1',
  },
  
  // Code list configuration
  codeListType: {
    type: String,
    enum: ['CONTROLLED', 'EXTENSIBLE', 'CUSTOM'],
    default: 'CONTROLLED',
  },
  dataType: {
    type: String,
    required: true,
    trim: true,
  },
  format: {
    type: String,
    trim: true,
  },
  length: {
    type: Number,
    min: 1,
  },
  
  // Code values
  codes: [{
    code: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    definition: {
      type: String,
      trim: true,
    },
    synonyms: [{
      type: String,
      trim: true,
    }],
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    deprecated: {
      type: Boolean,
      default: false,
    },
    deprecatedDate: {
      type: Date,
    },
    replacementCode: {
      type: String,
      trim: true,
    },
    
    // CDISC metadata
    cdiscCode: {
      type: String,
      required: true,
      trim: true,
    },
    cdiscLabel: {
      type: String,
      required: true,
      trim: true,
    },
    cdiscDefinition: {
      type: String,
      trim: true,
    },
    cdiscSynonyms: [{
      type: String,
      trim: true,
    }],
    
    // Hierarchy information
    parentCode: {
      type: String,
      trim: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    path: {
      type: String,
      trim: true,
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
  }],
  
  // Code list relationships
  relationships: [{
    relatedCodeListId: {
      type: String,
      required: true,
      trim: true,
    },
    relationshipType: {
      type: String,
      enum: ['SUBSET', 'SUPERSET', 'MAPPING', 'DEPENDENT'],
      required: true,
    },
    mappingRules: [{
      sourceCode: {
        type: String,
        required: true,
        trim: true,
      },
      targetCode: {
        type: String,
        required: true,
        trim: true,
      },
      mappingType: {
        type: String,
        enum: ['DIRECT', 'CONDITIONAL', 'CALCULATED'],
        default: 'DIRECT',
      },
      condition: {
        type: String,
        trim: true,
      },
    }],
  }],
  
  // Validation rules
  validationRules: [{
    ruleId: {
      type: String,
      required: true,
      trim: true,
    },
    ruleName: {
      type: String,
      required: true,
      trim: true,
    },
    ruleType: {
      type: String,
      enum: ['REQUIRED', 'UNIQUE', 'FORMAT', 'DEPENDENCY'],
      required: true,
    },
    rule: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ['ERROR', 'WARNING', 'INFO'],
      default: 'ERROR',
    },
  }],
  
  // Code list metadata
  description: {
    type: String,
    trim: true,
  },
  purpose: {
    type: String,
    trim: true,
  },
  usage: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  
  // Status and versioning
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'DEPRECATED'],
    default: 'DRAFT',
  },
  approvalStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  approvedBy: {
    type: String,
    trim: true,
  },
  approvedDate: {
    type: Date,
  },
  versionHistory: [{
    version: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    changes: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
  }],
  
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
CodeListSchema.index({ codeListId: 1 });
CodeListSchema.index({ cdiscDomain: 1 });
CodeListSchema.index({ cdiscVariable: 1 });
CodeListSchema.index({ status: 1 });
CodeListSchema.index({ approvalStatus: 1 });

export const CodeList = mongoose.models.CodeList || 
  mongoose.model<ICodeList>('CodeList', CodeListSchema); 