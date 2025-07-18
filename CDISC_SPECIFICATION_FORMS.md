# CDISC/CDASH Specification Forms System

## Overview

This document describes the enhanced specification forms system that supports CDISC/CDASH standards with field dependencies, code lists, validation rules, and dynamic form generation. The system provides a comprehensive solution for creating regulatory-compliant clinical trial forms.

## 🎯 Key Features

### 1. CDISC/CDASH Compliance
- **CDISC Domain Mapping**: Supports all major CDISC domains (VS, LB, AE, CM, etc.)
- **CDASH Question Integration**: Built-in CDASH question text and numbering
- **Standard Versioning**: Support for multiple CDISC standard versions
- **Regulatory Compliance**: FDA, EMA, and other authority compliance

### 2. Dynamic Form Generation
- **Field Dependencies**: Conditional field visibility and requirements
- **Real-time Validation**: Client-side and server-side validation
- **Responsive Layout**: Adaptive grid layouts for different screen sizes
- **Section Management**: Collapsible sections with field grouping

### 3. Code List Management
- **Standardized Terminologies**: Integration with CDISC controlled vocabularies
- **Hierarchical Lists**: Support for parent-child code relationships
- **Version Control**: Code list versioning and deprecation
- **Mapping Rules**: Cross-code list mapping and relationships

### 4. Validation Engine
- **Field-level Validation**: Required, range, pattern, and length validation
- **Cross-field Validation**: Complex validation rules across multiple fields
- **Business Rules**: Conditional calculations and derivations
- **Severity Levels**: Error, warning, and info message types

## 📊 System Architecture

### Database Models

#### FormSpecification Model
```typescript
interface IFormSpecification {
  // Form identification
  formId: string
  studyId: string
  formName: string
  formCode: string
  formVersion: string
  
  // CDISC/CDASH metadata
  cdiscDomain: string
  cdashCategory: string
  cdashSubcategory?: string
  standardVersion: string
  
  // Form configuration
  formType: 'CRF' | 'eCRF' | 'ePRO' | 'LAB' | 'IMAGING'
  assessmentCategory: 'SAFETY' | 'EFFICACY' | 'PHARMACOKINETIC' | 'BIOMARKER'
  visitSchedule: string[]
  required: boolean
  
  // Field specifications
  fields: FormField[]
  
  // Form layout
  layout: FormLayout
  
  // Form validation
  formValidation: FormValidation
  
  // Status and versioning
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'
  versionHistory: VersionHistory[]
}
```

#### CodeList Model
```typescript
interface ICodeList {
  // Code list identification
  codeListId: string
  codeListName: string
  codeListCode: string
  codeListVersion: string
  
  // CDISC metadata
  cdiscDomain: string
  cdiscVariable: string
  cdashQuestion: string
  standardSource: string
  standardVersion: string
  
  // Code list configuration
  codeListType: 'CONTROLLED' | 'EXTENSIBLE' | 'CUSTOM'
  dataType: string
  format?: string
  length?: number
  
  // Code values
  codes: CodeValue[]
  
  // Code list relationships
  relationships: CodeListRelationship[]
  
  // Validation rules
  validationRules: ValidationRule[]
  
  // Status and versioning
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}
```

### Field Dependencies

The system supports complex field dependencies with the following actions:

- **SHOW/HIDE**: Control field visibility based on other field values
- **REQUIRE/OPTIONAL**: Make fields required or optional conditionally
- **ENABLE/DISABLE**: Enable or disable field interaction
- **Multiple Conditions**: Support for complex conditional logic

#### Example Dependencies
```typescript
dependencies: [
  {
    dependentFieldId: "vstest",
    condition: "EQUALS",
    action: "REQUIRE",
    value: "SYSBP"
  },
  {
    dependentFieldId: "vsorres",
    condition: "IS_EMPTY",
    action: "REQUIRE",
    value: ""
  }
]
```

### Validation Rules

#### Field-level Validation
```typescript
validationRules: [
  {
    ruleType: "REQUIRED",
    rule: "required",
    message: "Field is required",
    severity: "ERROR"
  },
  {
    ruleType: "RANGE",
    rule: "70,300",
    message: "Value must be between 70 and 300",
    severity: "ERROR"
  },
  {
    ruleType: "PATTERN",
    rule: "^[A-Z]{2,3}$",
    message: "Must be 2-3 uppercase letters",
    severity: "ERROR"
  }
]
```

#### Cross-field Validation
```typescript
crossFieldValidation: [
  {
    ruleId: "VS001",
    ruleName: "Blood Pressure Range Check",
    ruleExpression: "vstest == 'SYSBP' && vsorres < 70",
    errorMessage: "Systolic blood pressure below 70 mmHg requires attention",
    severity: "WARNING",
    fields: ["vstest", "vsorres"]
  }
]
```

## 🛠️ Implementation

### Dynamic Form Builder Component

The `DynamicFormBuilder` component provides:

1. **Automatic Field Rendering**: Renders fields based on specification
2. **Dependency Evaluation**: Real-time dependency processing
3. **Validation Display**: Shows validation errors and warnings
4. **CDISC Information**: Optional display of CDISC metadata
5. **Responsive Layout**: Adaptive grid layouts

### API Endpoints

#### Form Specifications
- `GET /api/forms` - List form specifications
- `POST /api/forms` - Create new form specification
- `GET /api/forms/[formId]` - Get specific form
- `PUT /api/forms/[formId]` - Update form specification
- `DELETE /api/forms/[formId]` - Delete form specification

#### Code Lists
- `GET /api/codelists` - List code lists
- `POST /api/codelists` - Create new code list
- `GET /api/codelists/[codeListId]` - Get specific code list
- `PUT /api/codelists/[codeListId]` - Update code list
- `DELETE /api/codelists/[codeListId]` - Delete code list

## 📋 Usage Examples

### Creating a Vital Signs Form

```typescript
const vitalSignsForm = {
  formId: "VS001",
  formName: "Vital Signs",
  formCode: "VS",
  cdiscDomain: "VS",
  cdashCategory: "Vital Signs",
  fields: [
    {
      fieldId: "vstest",
      fieldName: "VSTEST",
      fieldLabel: "Vital Signs Test Name",
      fieldType: "SELECT",
      cdiscVariable: "VSTEST",
      cdashQuestion: "What vital signs test was performed?",
      required: true,
      codeListValues: [
        { code: "SYSBP", label: "Systolic Blood Pressure" },
        { code: "DIABP", label: "Diastolic Blood Pressure" },
        { code: "PULSE", label: "Pulse Rate" }
      ]
    },
    {
      fieldId: "vsorres",
      fieldName: "VSORRES",
      fieldLabel: "Vital Signs Result",
      fieldType: "NUMBER",
      cdiscVariable: "VSORRES",
      cdashQuestion: "What is the result of the vital signs test?",
      required: true,
      dependencies: [
        {
          dependentFieldId: "vstest",
          condition: "EQUALS",
          action: "REQUIRE",
          value: "SYSBP"
        }
      ],
      validationRules: [
        {
          ruleType: "RANGE",
          rule: "0,300",
          message: "Result must be between 0 and 300",
          severity: "ERROR"
        }
      ]
    }
  ]
}
```

### Using the Dynamic Form Builder

```tsx
<DynamicFormBuilder
  formSpecification={vitalSignsForm}
  initialData={existingData}
  onSubmit={handleFormSubmit}
  onValidationError={handleValidationError}
  showCDISCInfo={true}
  readOnly={false}
/>
```

## 🔧 Configuration

### Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27024/clinical-edc

# CDISC Standards
CDISC_STANDARD_VERSION=CDASH 2.1
CDISC_DOMAIN_MAPPING=true

# Validation
ENABLE_REAL_TIME_VALIDATION=true
ENABLE_CROSS_FIELD_VALIDATION=true
```

### Form Configuration Options

```typescript
interface FormConfig {
  // Display options
  showCDISCInfo: boolean
  showValidationMessages: boolean
  showFieldDependencies: boolean
  
  // Layout options
  gridColumns: number
  responsiveLayout: boolean
  collapsibleSections: boolean
  
  // Validation options
  realTimeValidation: boolean
  crossFieldValidation: boolean
  severityLevels: ('ERROR' | 'WARNING' | 'INFO')[]
}
```

## 📈 Benefits

### 1. Regulatory Compliance
- **CDISC Standards**: Full compliance with CDISC/CDASH standards
- **Audit Trail**: Complete audit trail for all form changes
- **Data Quality**: Built-in validation ensures data quality
- **Regulatory Approval**: Streamlined regulatory approval process

### 2. Development Efficiency
- **Reusable Components**: Dynamic form generation reduces development time
- **Template System**: Pre-built templates for common assessments
- **Code List Management**: Centralized code list management
- **Version Control**: Built-in versioning and change tracking

### 3. User Experience
- **Intuitive Interface**: User-friendly form builder interface
- **Real-time Feedback**: Immediate validation feedback
- **Responsive Design**: Works on all device types
- **Accessibility**: WCAG compliant interface

### 4. Data Quality
- **Validation Rules**: Comprehensive validation at field and form levels
- **Dependency Management**: Ensures data consistency
- **Error Prevention**: Prevents common data entry errors
- **Quality Metrics**: Built-in data quality reporting

## 🚀 Future Enhancements

### Planned Features

1. **AI-Powered Form Generation**
   - Protocol interpretation using AI
   - Automatic form generation from protocols
   - Smart field dependency suggestions

2. **Advanced Validation**
   - Machine learning-based anomaly detection
   - Predictive validation rules
   - Real-time data quality scoring

3. **Integration Capabilities**
   - EDC system integration
   - Clinical trial management system (CTMS) integration
   - Electronic health record (EHR) integration

4. **Enhanced Reporting**
   - Real-time compliance reporting
   - Data quality dashboards
   - Regulatory submission preparation

### Technical Improvements

1. **Performance Optimization**
   - Caching strategies for form specifications
   - Lazy loading for large forms
   - Optimized database queries

2. **Scalability**
   - Microservices architecture
   - Horizontal scaling support
   - Cloud-native deployment

3. **Security**
   - Role-based access control (RBAC)
   - Data encryption at rest and in transit
   - Audit logging and monitoring

## 📚 Resources

### Documentation
- [CDISC Standards](https://www.cdisc.org/standards)
- [CDASH Implementation Guide](https://www.cdisc.org/standards/foundational/cdash)
- [SDTM Implementation Guide](https://www.cdisc.org/standards/foundational/sdtm)

### Training
- CDISC Academy courses
- Implementation workshops
- Best practices documentation

### Support
- Technical documentation
- User guides and tutorials
- Community forums
- Professional services

## 🤝 Contributing

We welcome contributions to improve the CDISC/CDASH specification forms system. Please see our contributing guidelines for more information.

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Access the application at `http://localhost:3000`

### Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e
```

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Jest for testing
- Cypress for E2E testing

---

This specification forms system provides a comprehensive solution for creating CDISC/CDASH compliant clinical trial forms with advanced features for field dependencies, validation, and dynamic form generation. 