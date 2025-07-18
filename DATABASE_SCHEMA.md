# Clinical EDC Database Schema

This document describes the CDISC/SDTM-compliant database schema for the Clinical EDC application.

## 🎯 Overview

The database schema follows CDISC (Clinical Data Interchange Standards Consortium) and SDTM (Study Data Tabulation Model) standards to ensure:
- **Regulatory compliance** with FDA, EMA, and other authorities
- **Data interoperability** with other clinical systems
- **Standardized terminology** and data structures
- **Audit trail** and data integrity

## 📊 Database Collections

### 1. Studies Collection (`studies`)

**Purpose**: Core study information following CDISC DM domain standards

**Key Fields**:
- `studyId` - Unique study identifier (STUDYID)
- `studyName` - Study title/name
- `studyDescription` - Detailed study description
- `sponsor` - Sponsor organization
- `principalInvestigator` - Principal investigator name
- `studyCoordinator` - Study coordinator name

**Study Classification**:
- `studyType` - INTERVENTIONAL, OBSERVATIONAL, EXPANDED_ACCESS
- `studyPhase` - I, II, III, IV, PILOT, FEASIBILITY
- `therapeuticArea` - Therapeutic area (e.g., Endocrinology)
- `indication` - Primary indication

**Study Status & Timeline**:
- `studyStatus` - DRAFT, ACTIVE, COMPLETED, TERMINATED, SUSPENDED
- `startDate` - Study start date
- `endDate` - Study end date (optional)
- `enrollmentStatus` - NOT_STARTED, RECRUITING, ACTIVE, COMPLETED

**Study Design**:
- `studyDesign` - PARALLEL, CROSSOVER, SEQUENTIAL, FACTORIAL
- `blinding` - OPEN, SINGLE_BLIND, DOUBLE_BLIND, TRIPLE_BLIND
- `randomization` - RANDOMIZED, NON_RANDOMIZED

**Regulatory Information**:
- `regulatoryAuthority` - FDA, EMA, etc.
- `protocolNumber` - Protocol number
- `protocolVersion` - Protocol version

**Enrollment Information**:
- `plannedEnrollment` - Target enrollment
- `currentEnrollment` - Current enrollment

**Data Management**:
- `dataManager` - Data manager name
- `databaseLockDate` - Database lock date
- `lastPatientVisitDate` - Last patient visit date

### 2. Sites Collection (`sites`)

**Purpose**: Clinical trial sites information

**Key Fields**:
- `siteId` - Unique site identifier
- `studyId` - Reference to study
- `siteNumber` - Site number (001, 002, etc.)
- `siteName` - Site name
- `siteType` - INVESTIGATIONAL, CRO, LABORATORY, IMAGING
- `siteStatus` - ACTIVE, INACTIVE, PENDING, SUSPENDED, TERMINATED

**Location Information**:
- `country` - Country
- `state` - State/Province
- `city` - City
- `address` - Full address

**Contact Information**:
- `principalInvestigator` - Site PI name
- `siteCoordinator` - Site coordinator name
- `contactEmail` - Contact email
- `contactPhone` - Contact phone

**Regulatory Information**:
- `regulatoryNumber` - Regulatory approval number
- `irbNumber` - IRB/EC approval number
- `irbExpiryDate` - IRB/EC expiry date

**Site Capabilities**:
- `maxSubjects` - Maximum subjects this site can enroll
- `currentSubjects` - Current subjects enrolled
- `siteActivationDate` - Site activation date
- `firstSubjectDate` - First subject enrolled date
- `lastSubjectDate` - Last subject enrolled date

## 🔄 Data Flow

```
Mock Data → CDISC/SDTM Schema → MongoDB
```

## 🛠️ Database Setup

The database has been populated with comprehensive mock data including:

1. **4 existing studies** with all tab data
2. **Study metadata** in CDISC format
3. **Status mapping** (ACTIVE → ACTIVE, etc.)
4. **Phase mapping** (PHASE_3 → III, etc.)
5. **Enrollment data** with proper tracking

The data is already migrated and ready for use.

## 📋 CDISC Compliance

### SDTM Domain Mapping

| SDTM Domain | Our Collection | Purpose |
|-------------|----------------|---------|
| DM (Demographics) | studies | Study-level information |
| SE (Subject Elements) | sites | Site-level information |
| SV (Subject Visits) | visits | Visit scheduling |
| EX (Exposure) | treatments | Treatment administration |
| EG (ECG) | assessments | Safety assessments |

### Standardized Terminology

- **Study Types**: INTERVENTIONAL, OBSERVATIONAL, EXPANDED_ACCESS
- **Study Phases**: I, II, III, IV, PILOT, FEASIBILITY
- **Study Status**: DRAFT, ACTIVE, COMPLETED, TERMINATED, SUSPENDED
- **Site Status**: ACTIVE, INACTIVE, PENDING, SUSPENDED, TERMINATED

## 🔍 Indexes for Performance

### Studies Collection
- `studyId` (unique)
- `studyStatus`
- `studyPhase`
- `therapeuticArea`
- `sponsor`
- `startDate`

### Sites Collection
- `siteId` (unique)
- `studyId`
- `siteStatus`
- `country`
- `siteType`

## 🚨 Important Notes

1. **Database Ready**: The database has been populated and is ready for use
2. **Data Integrity**: All fields have proper validation and constraints
3. **Audit Trail**: All records include createdBy, updatedBy, and timestamps
4. **Regulatory Compliance**: Schema follows FDA 21 CFR Part 11 requirements

## 🎉 Benefits

- ✅ **Regulatory compliant** data structure
- ✅ **Standardized terminology** across the industry
- ✅ **Scalable architecture** for large clinical trials
- ✅ **Audit trail** for data integrity
- ✅ **Interoperable** with other clinical systems

Your Clinical EDC now follows industry standards! 🚀 