import mongoose, { Schema, Document } from 'mongoose';

// CDISC/CDASH Form Specification Model
export interface IFormSpecification extends Document {
  // Form identification
  formId: string;                    // Unique form identifier
  studyId: string;                   // Reference to study
  formName: string;                  // Form name (e.g., "Vital Signs")
  formCode: string;                  // CDASH form code (e.g., "VS")
  formVersion: string;               // Form version
  
  // CDISC/CDASH metadata
  cdiscDomain: string;               // CDISC domain (e.g., "VS", "LB", "AE")
  cdashCategory: string;             // CDASH category
  cdashSubcategory?: string;         // CDASH subcategory
  standardVersion: string;           // CDISC standard version
  
  // Form configuration
  formType: 'CRF' | 'eCRF' | 'ePRO' | 'LAB' | 'IMAGING';
  assessmentCategory: 'SAFETY' | 'EFFICACY' | 'PHARMACOKINETIC' | 'BIOMARKER';
  visitSchedule: string[];           // Applicable visits
  required: boolean;                 // Is form required
  
  // Field specifications
  fields: Array<{
    fieldId: string;                 // Unique field identifier
    fieldName: string;               // Field name
    fieldLabel: string;              // Display label
    fieldType: 'TEXT' | 'NUMBER' | 'DATE' | 'TIME' | 'DATETIME' | 'SELECT' | 'MULTISELECT' | 'RADIO' | 'CHECKBOX' | 'TEXTAREA' | 'FILE';
    dataType: string;                // Data type (e.g., "CHAR", "NUM", "DATE")
    format?: string;                 // Format pattern
    length?: number;                 // Field length
    precision?: number;              // Decimal precision for numbers
    
    // CDISC/CDASH metadata
    cdiscVariable: string;           // CDISC variable name
    cdashQuestion: string;           // CDASH question text
    cdashQuestionNumber?: string;    // CDASH question number
    
    // Validation rules
    required: boolean;               // Is field required
    validationRules: Array<{
      ruleType: 'REQUIRED' | 'RANGE' | 'PATTERN' | 'LENGTH' | 'DEPENDENCY' | 'CROSS_FIELD';
      rule: string;                  // Validation rule expression
      message: string;               // Error message
      severity: 'ERROR' | 'WARNING' | 'INFO';
    }>;
    
    // Code list integration
    codeListId?: string;             // Reference to code list
    codeListValues?: Array<{
      code: string;                  // Code value
      label: string;                 // Display label
      description?: string;          // Code description
      order: number;                 // Display order
      active: boolean;               // Is code active
    }>;
    
    // Field dependencies
    dependencies: Array<{
      dependentFieldId: string;      // Field this depends on
      condition: string;             // Condition expression
      action: 'SHOW' | 'HIDE' | 'REQUIRE' | 'OPTIONAL' | 'ENABLE' | 'DISABLE';
      value?: any;                   // Expected value for condition
    }>;
    
    // Field grouping
    groupId?: string;                // Group identifier
    groupOrder: number;              // Order within group
    rowOrder: number;                // Row order
    columnOrder: number;             // Column order
    
    // Display properties
    displayProperties: {
      width?: string;                // Field width
      height?: string;               // Field height
      cssClass?: string;             // CSS class
      tooltip?: string;              // Tooltip text
      helpText?: string;             // Help text
      placeholder?: string;          // Placeholder text
    };
    
    // Default values
    defaultValue?: any;              // Default value
    calculatedValue?: string;        // Calculated value expression
    
    // Audit fields
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }>;
  
  // Form layout
  layout: {
    sections: Array<{
      sectionId: string;             // Section identifier
      sectionName: string;           // Section name
      sectionOrder: number;          // Section order
      fields: string[];              // Field IDs in this section
      collapsible: boolean;          // Is section collapsible
      collapsed: boolean;            // Default collapsed state
    }>;
    gridLayout: {
      columns: number;               // Number of columns
      responsive: boolean;           // Is responsive layout
    };
  };
  
  // Form validation
  formValidation: {
    crossFieldValidation: Array<{
      ruleId: string;                // Rule identifier
      ruleName: string;              // Rule name
      ruleExpression: string;        // Validation expression
      errorMessage: string;          // Error message
      severity: 'ERROR' | 'WARNING' | 'INFO';
      fields: string[];              // Fields involved in validation
    }>;
    businessRules: Array<{
      ruleId: string;                // Rule identifier
      ruleName: string;              // Rule name
      ruleType: 'CONDITIONAL' | 'CALCULATION' | 'DERIVATION';
      ruleExpression: string;        // Rule expression
      description: string;           // Rule description
      active: boolean;               // Is rule active
    }>;
  };
  
  // Form metadata
  description: string;               // Form description
  instructions: string;              // Form instructions
  notes: string;                     // Additional notes
  
  // Status and versioning
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
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

const FormSpecificationSchema = new Schema<IFormSpecification>({
  // Form identification
  formId: {
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
  formName: {
    type: String,
    required: true,
    trim: true,
  },
  formCode: {
    type: String,
    required: true,
    trim: true,
  },
  formVersion: {
    type: String,
    default: '1.0',
  },
  
  // CDISC/CDASH metadata
  cdiscDomain: {
    type: String,
    required: true,
    trim: true,
  },
  cdashCategory: {
    type: String,
    required: true,
    trim: true,
  },
  cdashSubcategory: {
    type: String,
    trim: true,
  },
  standardVersion: {
    type: String,
    default: 'CDASH 2.1',
  },
  
  // Form configuration
  formType: {
    type: String,
    enum: ['CRF', 'eCRF', 'ePRO', 'LAB', 'IMAGING'],
    default: 'eCRF',
  },
  assessmentCategory: {
    type: String,
    enum: ['SAFETY', 'EFFICACY', 'PHARMACOKINETIC', 'BIOMARKER'],
    required: true,
  },
  visitSchedule: [{
    type: String,
    trim: true,
  }],
  required: {
    type: Boolean,
    default: true,
  },
  
  // Field specifications
  fields: [{
    fieldId: {
      type: String,
      required: true,
      trim: true,
    },
    fieldName: {
      type: String,
      required: true,
      trim: true,
    },
    fieldLabel: {
      type: String,
      required: true,
      trim: true,
    },
    fieldType: {
      type: String,
      enum: ['TEXT', 'NUMBER', 'DATE', 'TIME', 'DATETIME', 'SELECT', 'MULTISELECT', 'RADIO', 'CHECKBOX', 'TEXTAREA', 'FILE'],
      required: true,
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
    precision: {
      type: Number,
      min: 0,
    },
    
    // CDISC/CDASH metadata
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
    cdashQuestionNumber: {
      type: String,
      trim: true,
    },
    
    // Validation rules
    required: {
      type: Boolean,
      default: false,
    },
    validationRules: [{
      ruleType: {
        type: String,
        enum: ['REQUIRED', 'RANGE', 'PATTERN', 'LENGTH', 'DEPENDENCY', 'CROSS_FIELD'],
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
    
    // Code list integration
    codeListId: {
      type: String,
      trim: true,
    },
    codeListValues: [{
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
      order: {
        type: Number,
        default: 0,
      },
      active: {
        type: Boolean,
        default: true,
      },
    }],
    
    // Field dependencies
    dependencies: [{
      dependentFieldId: {
        type: String,
        required: true,
        trim: true,
      },
      condition: {
        type: String,
        required: true,
        trim: true,
      },
      action: {
        type: String,
        enum: ['SHOW', 'HIDE', 'REQUIRE', 'OPTIONAL', 'ENABLE', 'DISABLE'],
        required: true,
      },
      value: Schema.Types.Mixed,
    }],
    
    // Field grouping
    groupId: {
      type: String,
      trim: true,
    },
    groupOrder: {
      type: Number,
      default: 0,
    },
    rowOrder: {
      type: Number,
      default: 0,
    },
    columnOrder: {
      type: Number,
      default: 0,
    },
    
    // Display properties
    displayProperties: {
      width: {
        type: String,
        trim: true,
      },
      height: {
        type: String,
        trim: true,
      },
      cssClass: {
        type: String,
        trim: true,
      },
      tooltip: {
        type: String,
        trim: true,
      },
      helpText: {
        type: String,
        trim: true,
      },
      placeholder: {
        type: String,
        trim: true,
      },
    },
    
    // Default values
    defaultValue: Schema.Types.Mixed,
    calculatedValue: {
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
  
  // Form layout
  layout: {
    sections: [{
      sectionId: {
        type: String,
        required: true,
        trim: true,
      },
      sectionName: {
        type: String,
        required: true,
        trim: true,
      },
      sectionOrder: {
        type: Number,
        required: true,
      },
      fields: [{
        type: String,
        trim: true,
      }],
      collapsible: {
        type: Boolean,
        default: false,
      },
      collapsed: {
        type: Boolean,
        default: false,
      },
    }],
    gridLayout: {
      columns: {
        type: Number,
        default: 1,
        min: 1,
        max: 4,
      },
      responsive: {
        type: Boolean,
        default: true,
      },
    },
  },
  
  // Form validation
  formValidation: {
    crossFieldValidation: [{
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
      ruleExpression: {
        type: String,
        required: true,
        trim: true,
      },
      errorMessage: {
        type: String,
        required: true,
        trim: true,
      },
      severity: {
        type: String,
        enum: ['ERROR', 'WARNING', 'INFO'],
        default: 'ERROR',
      },
      fields: [{
        type: String,
        trim: true,
      }],
    }],
    businessRules: [{
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
        enum: ['CONDITIONAL', 'CALCULATION', 'DERIVATION'],
        required: true,
      },
      ruleExpression: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      active: {
        type: Boolean,
        default: true,
      },
    }],
  },
  
  // Form metadata
  description: {
    type: String,
    trim: true,
  },
  instructions: {
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
FormSpecificationSchema.index({ formId: 1 });
FormSpecificationSchema.index({ studyId: 1 });
FormSpecificationSchema.index({ cdiscDomain: 1 });
FormSpecificationSchema.index({ assessmentCategory: 1 });
FormSpecificationSchema.index({ status: 1 });

export const FormSpecification = mongoose.models.FormSpecification || 
  mongoose.model<IFormSpecification>('FormSpecification', FormSpecificationSchema); 