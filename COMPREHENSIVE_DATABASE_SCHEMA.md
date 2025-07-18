# Comprehensive Database Schema Documentation

## Overview

This document describes the comprehensive database schema for the Clinical EDC system that captures all data from the Overview, Design, Timeline, Arms, Objectives, Assessments, Audit, and AI Insights tabs. The schema follows CDISC/SDTM/ADaM standards with a flat, non-nested structure for optimal performance and simplicity.

## Database Schema

### Study Model (`lib/models/Study.ts`)

The Study model captures all clinical trial data in a single document with the following structure:

#### Overview Tab Data

```typescript
// Study identification
studyId: string                    // Unique study identifier (e.g., "STUDY-2025-001")
studyName: string                  // Study name/title
studyDescription: string           // Study description

// Protocol information
protocolNumber: string             // Protocol number
protocolVersion: string            // Protocol version
protocolDate: Date                 // Protocol date
protocolTitle: string              // Full protocol title
protocolShortTitle: string         // Short protocol title

// Study classification (CDISC standards)
studyType: 'INTERVENTIONAL' | 'OBSERVATIONAL' | 'EXPANDED_ACCESS'
studyPhase: 'I' | 'II' | 'III' | 'IV' | 'PILOT' | 'FEASIBILITY'
therapeuticArea: string            // Therapeutic area (e.g., "DIABETES")
indication: string                 // Primary indication
keywords: string[]                 // Study keywords

// Organization information
sponsor: {
  name: string
  email: string
  phone: string
  role: string
}
cro: {
  name: string
  email: string
  phone: string
  role: string
}
principalInvestigator: {
  name: string
  affiliation: string
  email: string
  phone: string
  type: string
}

// Study status and timeline
studyStatus: 'PLANNING' | 'ACTIVE' | 'RECRUITING' | 'SUSPENDED' | 'COMPLETED' | 'TERMINATED'
statusHistory: Array<{
  status: string
  date: Date
  reason: string
}>
milestones: {
  firstPatientIn: Date
  lastPatientIn: Date
  lastPatientOut: Date
  databaseLock: Date
}

// Enrollment information
plannedEnrollment: number          // Target enrollment
currentEnrollment: number          // Current enrollment
enrollmentStatus: 'NOT_STARTED' | 'RECRUITING' | 'ACTIVE' | 'COMPLETED'

// Progress tracking
completionPercentage: number       // Study completion percentage
priority: 'LOW' | 'MEDIUM' | 'HIGH'
processingStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED'
lastActivity: string               // Last activity timestamp
```

#### Design Tab Data

```typescript
// Study design
studyDesign: {
  type: 'PARALLEL_GROUP' | 'CROSSOVER' | 'FACTORIAL' | 'SINGLE_GROUP'
  allocation: 'RANDOMIZED' | 'NON_RANDOMIZED'
  blinding: {
    type: 'OPEN' | 'SINGLE_BLIND' | 'DOUBLE_BLIND' | 'TRIPLE_BLIND'
    blindedRoles: string[]
    unblindingProcedure: string
  }
  control: {
    type: 'PLACEBO' | 'ACTIVE' | 'NO_TREATMENT'
    description: string
  }
}

// Population
population: {
  target: string                   // Target population description
  plannedSize: number              // Planned sample size
  ageRange: {
    minimum: number
    maximum?: number
    unit: string
  }
  genderEligibility: string
  healthyVolunteers: boolean
  geographicScope: string
}

// Inclusion/Exclusion criteria
inclusionCriteria: Array<{
  id: string
  text: string
  category: string
  aiConfidence?: number
}>
exclusionCriteria: Array<{
  id: string
  text: string
  category: string
  aiConfidence?: number
}>
```

#### Timeline Tab Data

```typescript
// Study epochs
epochs: Array<{
  code: string                     // Epoch code (e.g., "SCREENING")
  name: string                     // Epoch name
  description: string              // Epoch description
  order: number                    // Epoch order
  duration: {
    value: number
    unit: string
    range?: {
      min: number
      max: number
    }
  }
  isTreatment: boolean             // Whether this is a treatment epoch
}>

// Study visits
visits: Array<{
  number: number                   // Visit number
  code: string                     // Visit code (e.g., "VISIT_1")
  name: string                     // Visit name
  epoch: string                    // Associated epoch
  nominalDay: number               // Nominal day
  window: {
    before: number
    after: number
    unit: string
  }
  type: string                     // Visit type
  required: boolean                // Whether visit is required
  procedures: Array<{
    name: string
    timing: string
    required: boolean
  }>
}>
```

#### Arms Tab Data

```typescript
// Treatment arms
treatmentArms: Array<{
  code: string                     // Arm code (e.g., "ARM_A")
  name: string                     // Arm name
  description: string              // Arm description
  type: 'EXPERIMENTAL' | 'PLACEBO_COMPARATOR' | 'ACTIVE_COMPARATOR'
  plannedSubjects: number          // Planned subjects per arm
  interventions: Array<{
    code: string                   // Intervention code
    name: string                   // Intervention name
    type: string                   // Intervention type
    dosing: {
      route: string                // Administration route
      form: string                 // Dosage form
      strength: string             // Strength
      frequency: string            // Frequency
    }
  }>
}>
```

#### Objectives Tab Data

```typescript
// Study objectives
objectives: Array<{
  type: 'PRIMARY' | 'SECONDARY' | 'EXPLORATORY'
  number: number                   // Objective number
  description: string              // Objective description
  endpoints: Array<{
    type: string                   // Endpoint type
    title: string                  // Endpoint title
    description: string            // Endpoint description
    measurement: {
      parameter: string            // Measurement parameter
      method: string               // Measurement method
      timepoints: string[]         // Measurement timepoints
      units: string                // Measurement units
    }
  }>
}>
```

#### Assessments Tab Data

```typescript
// Study assessments
assessments: {
  safetyAssessments: Array<{
    id: string
    name: string
    description: string
    frequency: string
    required: boolean
  }>
  efficacyAssessments: Array<{
    id: string
    name: string
    description: string
    frequency: string
    required: boolean
  }>
  pkAssessments: Array<{
    id: string
    name: string
    description: string
    frequency: string
    required: boolean
  }>
  biomarkerAssessments: Array<{
    id: string
    name: string
    description: string
    frequency: string
    required: boolean
  }>
}
```

#### Audit Tab Data

```typescript
// Regulatory compliance
regulatoryCompliance: {
  authority: string                // Regulatory authority (e.g., "FDA")
  gcpStandard: string             // GCP standard (e.g., "ICH_GCP")
  dataIntegrityLevel: string      // Data integrity level
}

// Audit trail settings
auditTrailSettings: {
  auditLevel: string               // Audit level
  retentionPeriod: string          // Data retention period
  electronicSignatureRequired: boolean
}

// User roles and permissions
userRoles: Array<{
  roleName: string
  permissionLevel: string
  dataAccess: string
}>

// Data security
dataSecurity: {
  encryptionLevel: string          // Encryption level
  backupFrequency: string          // Backup frequency
  privacyCompliance: string[]      // Privacy compliance standards
}
```

#### AI Insights Tab Data

```typescript
// AI-generated insights
aiInsights: {
  protocolDeviationPrediction: {
    status: string
    riskScore: number              // Risk score (0-1)
    predictedDeviations: Array<{
      type: string
      likelihood: string
      details: string
    }>
    recommendations: string
  }
  enrollmentForecast: {
    status: string
    currentEnrollment: number
    targetEnrollment: number
    projectedCompletionDate: Date
    onTrack: boolean
    variance: string
    factors: string[]
  }
  dataQualityAnomalies: {
    status: string
    anomaliesDetected: number
    criticalAnomalies: number
    details: Array<{
      type: string
      field: string
      subject: string
      visit: string
    }>
    recommendations: string
  }
}
```

## API Endpoints

### Get All Studies
```
GET /api/studies
```
Returns a list of studies with transformed data for the home page display.

### Get Single Study
```
GET /api/studies/[studyId]
```
Returns comprehensive study data for detailed view.

### Create New Study
```
POST /api/studies/create
```
Creates a new comprehensive study with all tab data.

### Update Study
```
PUT /api/studies/[studyId]
```
Updates an existing study.

### Delete Study
```
DELETE /api/studies/[studyId]
```
Deletes a study.

## Database Setup

The database has been populated with comprehensive mock data including:

- 4 complete studies with all tab data
- Realistic clinical trial information
- CDISC/SDTM/ADaM compliant structure
- All required fields populated

The data is already migrated and ready for use.

## Usage Examples

### Creating a New Study

```typescript
const newStudy = {
  studyId: "STUDY-2025-005",
  studyName: "Novel Drug Safety Study",
  studyDescription: "A Phase 1 safety study of novel drug",
  protocolNumber: "PROTO-005",
  studyType: "INTERVENTIONAL",
  studyPhase: "I",
  therapeuticArea: "ONCOLOGY",
  indication: "Solid Tumors",
  // ... additional fields
}

const response = await fetch('/api/studies/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newStudy)
})
```

### Fetching Study Details

```typescript
const { study, loading, error } = useStudy("STUDY-2025-001")

if (loading) return <div>Loading...</div>
if (error) return <div>Error: {error}</div>

// Access comprehensive data
console.log(study.studyDesign)        // Design tab data
console.log(study.treatmentArms)      // Arms tab data
console.log(study.objectives)         // Objectives tab data
console.log(study.assessments)        // Assessments tab data
```

### Home Page Display

The home page automatically displays:
- Study names and IDs
- Progress percentages
- Completion status
- Participant counts
- Site information
- Priority levels
- Last activity timestamps

## Benefits

1. **Complete Data Capture**: All tab data is stored in a single, comprehensive schema
2. **CDISC Compliance**: Follows CDISC/SDTM/ADaM standards
3. **Flat Structure**: No deep nesting for optimal performance
4. **Type Safety**: Full TypeScript support with comprehensive interfaces
5. **Real-time Updates**: All data is fetched from database instead of static mock data
6. **Scalable**: Can handle large numbers of studies and complex data
7. **Audit Trail**: Complete tracking of changes and user actions

## Data Flow

1. **Home Page**: Displays study list with progress percentages and key metrics
2. **Study Details**: Shows comprehensive data from all tabs
3. **Create Study**: Collects data from all tabs and saves to database
4. **Edit Study**: Updates existing study data across all tabs
5. **AI Integration**: AI insights are stored and updated in real-time

This comprehensive schema ensures that all clinical trial data is properly captured, stored, and accessible throughout the application while maintaining compliance with industry standards. 