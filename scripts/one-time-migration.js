#!/usr/bin/env node

/**
 * ONE-TIME MIGRATION SCRIPT
 * 
 * This script migrates existing mock data to the new CDISC/SDTM-compliant schema.
 * After running this script successfully, you can delete this file from the codebase.
 * 
 * Usage: node scripts/one-time-migration.js
 */

const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27024/clinical-edc';

// Comprehensive mock data for all tabs
const comprehensiveMockData = [
  {
    // STUDY-2025-001: Tirzepatide in Type 1 Diabetes with Obesity
    studyId: "STUDY-2025-001",
    studyName: "Tirzepatide in Type 1 Diabetes with Obesity",
    studyDescription: "A Phase 3, Randomized, Double-Blind, Placebo-Controlled Study of Tirzepatide in Adults with Type 1 Diabetes and Obesity/Overweight",
    
    // Protocol information
    protocolNumber: "PROTO-001",
    protocolVersion: "1.0",
    protocolDate: new Date("2025-01-15T00:00:00Z"),
    protocolTitle: "A Phase 3, Randomized, Double-Blind, Placebo-Controlled Study of Tirzepatide in Adults with Type 1 Diabetes and Obesity/Overweight",
    protocolShortTitle: "Tirzepatide T1D Study",
    
    // Study classification
    studyType: "INTERVENTIONAL",
    studyPhase: "III",
    therapeuticArea: "DIABETES",
    indication: "Type 1 Diabetes",
    keywords: ["diabetes", "tirzepatide", "obesity"],
    
    // Organization information
    sponsor: {
      name: "Pharmaceutical Company Inc.",
      email: "clinical@pharma.com",
      phone: "+1-555-0123",
      role: "SPONSOR"
    },
    cro: {
      name: "Global CRO Solutions",
      email: "operations@globalcro.com",
      phone: "+1-555-0456",
      role: "CRO"
    },
    principalInvestigator: {
      name: "Dr. Sarah Johnson",
      affiliation: "University Medical Center",
      email: "s.johnson@umc.edu",
      phone: "+1-555-0789",
      type: "GLOBAL_PI"
    },
    
    // Study status and timeline
    studyStatus: "ACTIVE",
    statusHistory: [
      {
        status: "PLANNING",
        date: new Date("2024-12-01T00:00:00Z"),
        reason: "Study setup and protocol development"
      },
      {
        status: "ACTIVE",
        date: new Date("2025-01-15T00:00:00Z"),
        reason: "First patient enrolled"
      }
    ],
    milestones: {
      firstPatientIn: new Date("2025-01-15T00:00:00Z"),
      lastPatientIn: new Date("2025-12-31T00:00:00Z"),
      lastPatientOut: new Date("2026-10-31T00:00:00Z"),
      databaseLock: new Date("2026-12-15T00:00:00Z")
    },
    
    // Enrollment information
    plannedEnrollment: 905,
    currentEnrollment: 453,
    enrollmentStatus: "ACTIVE",
    
    // Progress tracking
    completionPercentage: 67,
    priority: "HIGH",
    processingStatus: "COMPLETED",
    lastActivity: "2 hours ago",
    
    // ===== DESIGN TAB DATA =====
    studyDesign: {
      type: "PARALLEL_GROUP",
      allocation: "RANDOMIZED",
      blinding: {
        type: "DOUBLE_BLIND",
        blindedRoles: ["PARTICIPANT", "INVESTIGATOR", "ASSESSOR"],
        unblindingProcedure: "Emergency code break available 24/7"
      },
      control: {
        type: "PLACEBO",
        description: "Matching placebo injection"
      }
    },
    
    population: {
      target: "Adults with Type 1 Diabetes and obesity/overweight",
      plannedSize: 905,
      ageRange: {
        minimum: 18,
        maximum: null,
        unit: "YEARS"
      },
      genderEligibility: "ALL",
      healthyVolunteers: false,
      geographicScope: "GLOBAL"
    },
    
    inclusionCriteria: [
      {
        id: "IC001",
        text: "Age ≥18 years",
        category: "DEMOGRAPHICS",
        aiConfidence: 0.99
      },
      {
        id: "IC002",
        text: "Type 1 diabetes diagnosis with insulin treatment ≥1 year",
        category: "MEDICAL_HISTORY",
        aiConfidence: 0.95
      },
      {
        id: "IC003",
        text: "BMI ≥27 kg/m² or ≥25 kg/m² with weight-related comorbidity",
        category: "ANTHROPOMETRIC",
        aiConfidence: 0.97
      }
    ],
    
    exclusionCriteria: [
      {
        id: "EC001",
        text: "≥2 hospitalizations for hyperglycemia/DKA in 180 days",
        category: "MEDICAL_HISTORY",
        aiConfidence: 0.92
      },
      {
        id: "EC002",
        text: "History of pancreatitis or pancreatic cancer",
        category: "MEDICAL_HISTORY",
        aiConfidence: 0.98
      }
    ],
    
    // ===== TIMELINE TAB DATA =====
    epochs: [
      {
        code: "SCREENING",
        name: "Screening Period",
        description: "Subject screening and eligibility assessment",
        order: 1,
        duration: { value: 35, unit: "DAYS", range: { min: 21, max: 35 } },
        isTreatment: false
      },
      {
        code: "TREATMENT",
        name: "Treatment Period",
        description: "Active treatment administration",
        order: 2,
        duration: { value: 40, unit: "WEEKS" },
        isTreatment: true
      },
      {
        code: "FOLLOWUP",
        name: "Follow-up Period",
        description: "Safety follow-up after treatment",
        order: 3,
        duration: { value: 4, unit: "WEEKS" },
        isTreatment: false
      }
    ],
    
    visits: [
      {
        number: 1,
        code: "VISIT_1",
        name: "Screening Visit 1",
        epoch: "SCREENING",
        nominalDay: -35,
        window: { before: 0, after: 14, unit: "DAYS" },
        type: "SCHEDULED",
        required: true,
        procedures: [
          { name: "Informed Consent", timing: "PRE_PROCEDURE", required: true },
          { name: "Demographics", timing: "PROCEDURE", required: true },
          { name: "Medical History", timing: "PROCEDURE", required: true }
        ]
      },
      {
        number: 2,
        code: "VISIT_2",
        name: "Baseline Visit",
        epoch: "TREATMENT",
        nominalDay: 0,
        window: { before: 3, after: 3, unit: "DAYS" },
        type: "SCHEDULED",
        required: true,
        procedures: [
          { name: "Randomization", timing: "PRE_PROCEDURE", required: true },
          { name: "Drug Dispensing", timing: "PROCEDURE", required: true },
          { name: "Vital Signs", timing: "PROCEDURE", required: true }
        ]
      }
    ],
    
    // ===== ARMS TAB DATA =====
    treatmentArms: [
      {
        code: "ARM_A",
        name: "Tirzepatide",
        description: "Tirzepatide once weekly subcutaneous injection",
        type: "EXPERIMENTAL",
        plannedSubjects: 453,
        interventions: [
          {
            code: "TIRZE_15MG",
            name: "Tirzepatide 15mg",
            type: "DRUG",
            dosing: {
              route: "SUBCUTANEOUS",
              form: "INJECTION",
              strength: "15mg/0.5mL",
              frequency: "WEEKLY"
            }
          }
        ]
      },
      {
        code: "ARM_B",
        name: "Placebo",
        description: "Matching placebo once weekly subcutaneous injection",
        type: "PLACEBO_COMPARATOR",
        plannedSubjects: 452,
        interventions: [
          {
            code: "PLACEBO",
            name: "Placebo",
            type: "DRUG",
            dosing: {
              route: "SUBCUTANEOUS",
              form: "INJECTION",
              strength: "0.5mL",
              frequency: "WEEKLY"
            }
          }
        ]
      }
    ],
    
    // ===== OBJECTIVES TAB DATA =====
    objectives: [
      {
        type: "PRIMARY",
        number: 1,
        description: "Demonstrate superiority of tirzepatide vs placebo for glycemic control",
        endpoints: [
          {
            type: "PRIMARY",
            title: "Change from baseline in HbA1c",
            description: "Change from baseline in HbA1c at Week 40",
            measurement: {
              parameter: "HBA1C",
              method: "CENTRAL_LAB",
              timepoints: ["BASELINE", "WEEK_40"],
              units: "PERCENT"
            }
          }
        ]
      },
      {
        type: "SECONDARY",
        number: 2,
        description: "Evaluate weight loss efficacy of tirzepatide vs placebo",
        endpoints: [
          {
            type: "SECONDARY",
            title: "Change from baseline in body weight",
            description: "Percent change from baseline in body weight at Week 40",
            measurement: {
              parameter: "BODY_WEIGHT",
              method: "CALIBRATED_SCALE",
              timepoints: ["BASELINE", "WEEK_40"],
              units: "PERCENT"
            }
          }
        ]
      }
    ],
    
    // ===== ASSESSMENTS TAB DATA =====
    assessments: {
      safetyAssessments: [
        {
          id: "SA001",
          name: "Vital Signs",
          description: "Blood pressure, heart rate, respiratory rate, temperature",
          frequency: "All visits",
          required: true
        },
        {
          id: "SA002",
          name: "Laboratory Tests",
          description: "Hematology, chemistry, urinalysis",
          frequency: "Baseline, Week 4, Week 12, End of Study",
          required: true
        },
        {
          id: "SA003",
          name: "Adverse Events (AEs)",
          description: "Collection and reporting of all adverse events",
          frequency: "Continuous",
          required: true
        }
      ],
      efficacyAssessments: [
        {
          id: "EA001",
          name: "HbA1c",
          description: "Glycated hemoglobin measurement",
          frequency: "Baseline, Week 12, Week 24, Week 40",
          required: true
        },
        {
          id: "EA002",
          name: "Body Weight",
          description: "Measurement of body weight",
          frequency: "All visits",
          required: true
        },
        {
          id: "EA003",
          name: "CGM Data",
          description: "Continuous Glucose Monitoring data collection",
          frequency: "Baseline, Week 20, Week 40",
          required: false
        }
      ],
      pkAssessments: [
        {
          id: "PK001",
          name: "Pharmacokinetic Sampling",
          description: "Blood samples for drug concentration analysis",
          frequency: "Specific visits",
          required: true
        }
      ],
      biomarkerAssessments: [
        {
          id: "BM001",
          name: "Inflammatory Markers",
          description: "Measurement of C-reactive protein, IL-6",
          frequency: "Baseline, Week 40",
          required: false
        }
      ]
    },
    
    // ===== AUDIT TAB DATA =====
    regulatoryCompliance: {
      authority: "FDA",
      gcpStandard: "ICH_GCP",
      dataIntegrityLevel: "ENHANCED"
    },
    
    auditTrailSettings: {
      auditLevel: "COMPREHENSIVE",
      retentionPeriod: "15_YEARS",
      electronicSignatureRequired: true
    },
    
    userRoles: [
      { roleName: "Principal Investigator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" },
      { roleName: "Study Coordinator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" },
      { roleName: "Data Manager", permissionLevel: "ADMIN", dataAccess: "ALL_SITES" }
    ],
    
    dataSecurity: {
      encryptionLevel: "AES_256",
      backupFrequency: "DAILY",
      privacyCompliance: ["GDPR", "HIPAA"]
    },
    
    // ===== AI INSIGHTS TAB DATA =====
    aiInsights: {
      protocolDeviationPrediction: {
        status: "ACTIVE",
        riskScore: 0.75,
        predictedDeviations: [
          { type: "Missed Visit", likelihood: "HIGH", details: "Site 001, Subject 103, Visit 5" },
          { type: "Inclusion/Exclusion Violation", likelihood: "MEDIUM", details: "Site 005, Subject 210" }
        ],
        recommendations: "Review site 001 visit scheduling, re-train site 005 on eligibility criteria."
      },
      enrollmentForecast: {
        status: "ACTIVE",
        currentEnrollment: 280,
        targetEnrollment: 905,
        projectedCompletionDate: new Date("2026-03-15"),
        onTrack: false,
        variance: "-3 months",
        factors: ["Slow site activation", "High screen failure rate"]
      },
      dataQualityAnomalies: {
        status: "ACTIVE",
        anomaliesDetected: 12,
        criticalAnomalies: 3,
        details: [
          { type: "Outlier Data Point", field: "HbA1c", subject: "105", visit: "Week 12" },
          { type: "Missing Data", field: "Body Weight", subject: "201", visit: "Week 8" }
        ],
        recommendations: "Query site 105 for HbA1c re-check, follow up on missing data for subject 201."
      }
    },
    
    // Metadata
    createdBy: "system",
    updatedBy: "system"
  },
  
  {
    // STUDY-2025-002: Semaglutide for Weight Management in Obesity
    studyId: "STUDY-2025-002",
    studyName: "Semaglutide for Weight Management in Obesity",
    studyDescription: "A Phase 2 study evaluating the efficacy and safety of semaglutide for weight management in obese patients",
    
    protocolNumber: "PROTO-002",
    protocolVersion: "1.0",
    protocolDate: new Date("2025-01-20T00:00:00Z"),
    protocolTitle: "A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study of Semaglutide for Weight Management in Obesity",
    protocolShortTitle: "Semaglutide Obesity Study",
    
    studyType: "INTERVENTIONAL",
    studyPhase: "II",
    therapeuticArea: "ENDOCRINOLOGY",
    indication: "Obesity",
    keywords: ["obesity", "semaglutide", "weight management"],
    
    sponsor: {
      name: "BioPharma Corp",
      email: "clinical@biopharma.com",
      phone: "+1-555-0234",
      role: "SPONSOR"
    },
    cro: {
      name: "Clinical Research Partners",
      email: "info@crp.com",
      phone: "+1-555-0567",
      role: "CRO"
    },
    principalInvestigator: {
      name: "Dr. Michael Chen",
      affiliation: "Metropolitan Medical Center",
      email: "m.chen@mmc.edu",
      phone: "+1-555-0890",
      type: "GLOBAL_PI"
    },
    
    studyStatus: "RECRUITING",
    statusHistory: [
      {
        status: "PLANNING",
        date: new Date("2024-11-15T00:00:00Z"),
        reason: "Protocol development and site selection"
      },
      {
        status: "RECRUITING",
        date: new Date("2025-01-20T00:00:00Z"),
        reason: "First site activated"
      }
    ],
    milestones: {
      firstPatientIn: new Date("2025-02-15T00:00:00Z"),
      lastPatientIn: new Date("2025-08-31T00:00:00Z"),
      lastPatientOut: new Date("2026-02-28T00:00:00Z"),
      databaseLock: new Date("2026-04-15T00:00:00Z")
    },
    
    plannedEnrollment: 400,
    currentEnrollment: 280,
    enrollmentStatus: "RECRUITING",
    
    completionPercentage: 23,
    priority: "MEDIUM",
    processingStatus: "PROCESSING",
    lastActivity: "1 day ago",
    
    studyDesign: {
      type: "PARALLEL_GROUP",
      allocation: "RANDOMIZED",
      blinding: {
        type: "DOUBLE_BLIND",
        blindedRoles: ["PARTICIPANT", "INVESTIGATOR"],
        unblindingProcedure: "Emergency unblinding available"
      },
      control: {
        type: "PLACEBO",
        description: "Matching placebo injection"
      }
    },
    
    population: {
      target: "Adults with obesity (BMI ≥30 kg/m²)",
      plannedSize: 400,
      ageRange: {
        minimum: 18,
        maximum: 75,
        unit: "YEARS"
      },
      genderEligibility: "ALL",
      healthyVolunteers: false,
      geographicScope: "MULTI_COUNTRY"
    },
    
    inclusionCriteria: [
      {
        id: "IC001",
        text: "Age 18-75 years",
        category: "DEMOGRAPHICS",
        aiConfidence: 0.98
      },
      {
        id: "IC002",
        text: "BMI ≥30 kg/m²",
        category: "ANTHROPOMETRIC",
        aiConfidence: 0.99
      }
    ],
    
    exclusionCriteria: [
      {
        id: "EC001",
        text: "History of pancreatitis",
        category: "MEDICAL_HISTORY",
        aiConfidence: 0.95
      }
    ],
    
    epochs: [
      {
        code: "SCREENING",
        name: "Screening Period",
        description: "Subject screening and eligibility assessment",
        order: 1,
        duration: { value: 28, unit: "DAYS" },
        isTreatment: false
      },
      {
        code: "TREATMENT",
        name: "Treatment Period",
        description: "Active treatment administration",
        order: 2,
        duration: { value: 24, unit: "WEEKS" },
        isTreatment: true
      }
    ],
    
    visits: [
      {
        number: 1,
        code: "VISIT_1",
        name: "Screening",
        epoch: "SCREENING",
        nominalDay: -28,
        window: { before: 0, after: 7, unit: "DAYS" },
        type: "SCHEDULED",
        required: true,
        procedures: [
          { name: "Informed Consent", timing: "PRE_PROCEDURE", required: true },
          { name: "Medical History", timing: "PROCEDURE", required: true }
        ]
      }
    ],
    
    treatmentArms: [
      {
        code: "ARM_A",
        name: "Semaglutide",
        description: "Semaglutide once weekly subcutaneous injection",
        type: "EXPERIMENTAL",
        plannedSubjects: 200,
        interventions: [
          {
            code: "SEMA_2.4MG",
            name: "Semaglutide 2.4mg",
            type: "DRUG",
            dosing: {
              route: "SUBCUTANEOUS",
              form: "INJECTION",
              strength: "2.4mg/0.75mL",
              frequency: "WEEKLY"
            }
          }
        ]
      },
      {
        code: "ARM_B",
        name: "Placebo",
        description: "Matching placebo once weekly subcutaneous injection",
        type: "PLACEBO_COMPARATOR",
        plannedSubjects: 200,
        interventions: [
          {
            code: "PLACEBO",
            name: "Placebo",
            type: "DRUG",
            dosing: {
              route: "SUBCUTANEOUS",
              form: "INJECTION",
              strength: "0.75mL",
              frequency: "WEEKLY"
            }
          }
        ]
      }
    ],
    
    objectives: [
      {
        type: "PRIMARY",
        number: 1,
        description: "Evaluate weight loss efficacy of semaglutide vs placebo",
        endpoints: [
          {
            type: "PRIMARY",
            title: "Percent change in body weight",
            description: "Percent change from baseline in body weight at Week 24",
            measurement: {
              parameter: "BODY_WEIGHT",
              method: "CALIBRATED_SCALE",
              timepoints: ["BASELINE", "WEEK_24"],
              units: "PERCENT"
            }
          }
        ]
      }
    ],
    
    assessments: {
      safetyAssessments: [
        {
          id: "SA001",
          name: "Vital Signs",
          description: "Blood pressure, heart rate, temperature",
          frequency: "All visits",
          required: true
        }
      ],
      efficacyAssessments: [
        {
          id: "EA001",
          name: "Body Weight",
          description: "Measurement of body weight",
          frequency: "All visits",
          required: true
        }
      ],
      pkAssessments: [],
      biomarkerAssessments: []
    },
    
    regulatoryCompliance: {
      authority: "FDA",
      gcpStandard: "ICH_GCP",
      dataIntegrityLevel: "STANDARD"
    },
    
    auditTrailSettings: {
      auditLevel: "STANDARD",
      retentionPeriod: "10_YEARS",
      electronicSignatureRequired: true
    },
    
    userRoles: [
      { roleName: "Principal Investigator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" },
      { roleName: "Study Coordinator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" }
    ],
    
    dataSecurity: {
      encryptionLevel: "AES_256",
      backupFrequency: "WEEKLY",
      privacyCompliance: ["HIPAA"]
    },
    
    aiInsights: {
      protocolDeviationPrediction: {
        status: "INACTIVE",
        riskScore: 0.25,
        predictedDeviations: [],
        recommendations: ""
      },
      enrollmentForecast: {
        status: "ACTIVE",
        currentEnrollment: 280,
        targetEnrollment: 400,
        projectedCompletionDate: new Date("2025-08-31"),
        onTrack: true,
        variance: "On track",
        factors: []
      },
      dataQualityAnomalies: {
        status: "INACTIVE",
        anomaliesDetected: 0,
        criticalAnomalies: 0,
        details: [],
        recommendations: ""
      }
    },
    
    createdBy: "system",
    updatedBy: "system"
  },
  
  {
    // STUDY-2025-003: Continuous Glucose Monitoring Efficacy Trial
    studyId: "STUDY-2025-003",
    studyName: "Continuous Glucose Monitoring Efficacy Trial",
    studyDescription: "A Phase 3 study evaluating the efficacy of continuous glucose monitoring in Type 1 diabetes management",
    
    protocolNumber: "PROTO-003",
    protocolVersion: "1.0",
    protocolDate: new Date("2024-12-10T00:00:00Z"),
    protocolTitle: "A Phase 3, Randomized Study of Continuous Glucose Monitoring Efficacy in Type 1 Diabetes Management",
    protocolShortTitle: "CGM Efficacy Trial",
    
    studyType: "INTERVENTIONAL",
    studyPhase: "III",
    therapeuticArea: "DIABETES",
    indication: "Type 1 Diabetes",
    keywords: ["diabetes", "CGM", "glucose monitoring"],
    
    sponsor: {
      name: "MedDevice Inc.",
      email: "clinical@meddevice.com",
      phone: "+1-555-0345",
      role: "SPONSOR"
    },
    cro: {
      name: "Device Research Solutions",
      email: "info@drs.com",
      phone: "+1-555-0678",
      role: "CRO"
    },
    principalInvestigator: {
      name: "Dr. Emily Rodriguez",
      affiliation: "Diabetes Research Institute",
      email: "e.rodriguez@dri.edu",
      phone: "+1-555-0901",
      type: "GLOBAL_PI"
    },
    
    studyStatus: "COMPLETED",
    statusHistory: [
      {
        status: "ACTIVE",
        date: new Date("2024-12-10T00:00:00Z"),
        reason: "Study initiation"
      },
      {
        status: "COMPLETED",
        date: new Date("2024-12-31T00:00:00Z"),
        reason: "Study completed"
      }
    ],
    milestones: {
      firstPatientIn: new Date("2024-12-10T00:00:00Z"),
      lastPatientIn: new Date("2024-06-30T00:00:00Z"),
      lastPatientOut: new Date("2024-11-30T00:00:00Z"),
      databaseLock: new Date("2024-12-15T00:00:00Z")
    },
    
    plannedEnrollment: 200,
    currentEnrollment: 156,
    enrollmentStatus: "COMPLETED",
    
    completionPercentage: 100,
    priority: "LOW",
    processingStatus: "COMPLETED",
    lastActivity: "1 week ago",
    
    studyDesign: {
      type: "PARALLEL_GROUP",
      allocation: "RANDOMIZED",
      blinding: {
        type: "OPEN",
        blindedRoles: [],
        unblindingProcedure: "Not applicable"
      },
      control: {
        type: "ACTIVE",
        description: "Standard blood glucose monitoring"
      }
    },
    
    population: {
      target: "Adults with Type 1 diabetes",
      plannedSize: 200,
      ageRange: {
        minimum: 18,
        maximum: 70,
        unit: "YEARS"
      },
      genderEligibility: "ALL",
      healthyVolunteers: false,
      geographicScope: "MULTI_COUNTRY"
    },
    
    inclusionCriteria: [
      {
        id: "IC001",
        text: "Type 1 diabetes diagnosis ≥1 year",
        category: "MEDICAL_HISTORY",
        aiConfidence: 0.97
      }
    ],
    
    exclusionCriteria: [
      {
        id: "EC001",
        text: "Severe hypoglycemia in past 6 months",
        category: "MEDICAL_HISTORY",
        aiConfidence: 0.94
      }
    ],
    
    epochs: [
      {
        code: "TREATMENT",
        name: "Treatment Period",
        description: "CGM vs standard monitoring",
        order: 1,
        duration: { value: 26, unit: "WEEKS" },
        isTreatment: true
      }
    ],
    
    visits: [
      {
        number: 1,
        code: "VISIT_1",
        name: "Baseline",
        epoch: "TREATMENT",
        nominalDay: 0,
        window: { before: 0, after: 0, unit: "DAYS" },
        type: "SCHEDULED",
        required: true,
        procedures: [
          { name: "Randomization", timing: "PROCEDURE", required: true },
          { name: "Device Training", timing: "PROCEDURE", required: true }
        ]
      }
    ],
    
    treatmentArms: [
      {
        code: "ARM_A",
        name: "CGM Group",
        description: "Continuous glucose monitoring",
        type: "EXPERIMENTAL",
        plannedSubjects: 78,
        interventions: [
          {
            code: "CGM_DEVICE",
            name: "Continuous Glucose Monitor",
            type: "DEVICE",
            dosing: {
              route: "SUBCUTANEOUS",
              form: "SENSOR",
              strength: "N/A",
              frequency: "CONTINUOUS"
            }
          }
        ]
      },
      {
        code: "ARM_B",
        name: "Control Group",
        description: "Standard blood glucose monitoring",
        type: "ACTIVE_COMPARATOR",
        plannedSubjects: 78,
        interventions: [
          {
            code: "SMBG",
            name: "Self-Monitoring Blood Glucose",
            type: "DEVICE",
            dosing: {
              route: "FINGERSTICK",
              form: "METER",
              strength: "N/A",
              frequency: "MULTIPLE_DAILY"
            }
          }
        ]
      }
    ],
    
    objectives: [
      {
        type: "PRIMARY",
        number: 1,
        description: "Compare glycemic control between CGM and standard monitoring",
        endpoints: [
          {
            type: "PRIMARY",
            title: "Time in Range",
            description: "Percentage of time glucose is in target range (70-180 mg/dL)",
            measurement: {
              parameter: "TIME_IN_RANGE",
              method: "CGM_DATA",
              timepoints: ["WEEK_26"],
              units: "PERCENT"
            }
          }
        ]
      }
    ],
    
    assessments: {
      safetyAssessments: [
        {
          id: "SA001",
          name: "Device-related Adverse Events",
          description: "Collection of device-related adverse events",
          frequency: "Continuous",
          required: true
        }
      ],
      efficacyAssessments: [
        {
          id: "EA001",
          name: "HbA1c",
          description: "Glycated hemoglobin measurement",
          frequency: "Baseline, Week 13, Week 26",
          required: true
        }
      ],
      pkAssessments: [],
      biomarkerAssessments: []
    },
    
    regulatoryCompliance: {
      authority: "FDA",
      gcpStandard: "ICH_GCP",
      dataIntegrityLevel: "STANDARD"
    },
    
    auditTrailSettings: {
      auditLevel: "STANDARD",
      retentionPeriod: "10_YEARS",
      electronicSignatureRequired: true
    },
    
    userRoles: [
      { roleName: "Principal Investigator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" },
      { roleName: "Study Coordinator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" }
    ],
    
    dataSecurity: {
      encryptionLevel: "AES_256",
      backupFrequency: "WEEKLY",
      privacyCompliance: ["HIPAA"]
    },
    
    aiInsights: {
      protocolDeviationPrediction: {
        status: "INACTIVE",
        riskScore: 0.0,
        predictedDeviations: [],
        recommendations: ""
      },
      enrollmentForecast: {
        status: "COMPLETED",
        currentEnrollment: 156,
        targetEnrollment: 200,
        projectedCompletionDate: new Date("2024-11-30"),
        onTrack: true,
        variance: "Completed",
        factors: []
      },
      dataQualityAnomalies: {
        status: "INACTIVE",
        anomaliesDetected: 0,
        criticalAnomalies: 0,
        details: [],
        recommendations: ""
      }
    },
    
    createdBy: "system",
    updatedBy: "system"
  },
  
  {
    // STUDY-2025-004: Novel Insulin Formulation Safety Study
    studyId: "STUDY-2025-004",
    studyName: "Novel Insulin Formulation Safety Study",
    studyDescription: "A Phase 1 study evaluating the safety and pharmacokinetics of a novel insulin formulation",
    
    protocolNumber: "PROTO-004",
    protocolVersion: "1.0",
    protocolDate: new Date("2025-02-01T00:00:00Z"),
    protocolTitle: "A Phase 1, Single-Center, Open-Label Study of Novel Insulin Formulation Safety and Pharmacokinetics",
    protocolShortTitle: "Novel Insulin Safety Study",
    
    studyType: "INTERVENTIONAL",
    studyPhase: "I",
    therapeuticArea: "DIABETES",
    indication: "Type 2 Diabetes",
    keywords: ["diabetes", "insulin", "pharmacokinetics"],
    
    sponsor: {
      name: "InnovatePharma Ltd.",
      email: "clinical@innovatepharma.com",
      phone: "+1-555-0456",
      role: "SPONSOR"
    },
    cro: {
      name: "Early Phase Research",
      email: "info@epr.com",
      phone: "+1-555-0789",
      role: "CRO"
    },
    principalInvestigator: {
      name: "Dr. David Thompson",
      affiliation: "Clinical Research Unit",
      email: "d.thompson@cru.edu",
      phone: "+1-555-0123",
      type: "GLOBAL_PI"
    },
    
    studyStatus: "PLANNING",
    statusHistory: [
      {
        status: "PLANNING",
        date: new Date("2025-02-01T00:00:00Z"),
        reason: "Protocol development and regulatory submission"
      }
    ],
    milestones: {
      firstPatientIn: new Date("2025-03-15T00:00:00Z"),
      lastPatientIn: new Date("2025-06-30T00:00:00Z"),
      lastPatientOut: new Date("2025-08-31T00:00:00Z"),
      databaseLock: new Date("2025-09-15T00:00:00Z")
    },
    
    plannedEnrollment: 48,
    currentEnrollment: 0,
    enrollmentStatus: "NOT_STARTED",
    
    completionPercentage: 0,
    priority: "HIGH",
    processingStatus: "COMPLETED",
    lastActivity: "3 days ago",
    
    studyDesign: {
      type: "SINGLE_GROUP",
      allocation: "NON_RANDOMIZED",
      blinding: {
        type: "OPEN",
        blindedRoles: [],
        unblindingProcedure: "Not applicable"
      },
      control: {
        type: "NO_TREATMENT",
        description: "No control group in Phase 1"
      }
    },
    
    population: {
      target: "Healthy volunteers and Type 2 diabetes patients",
      plannedSize: 48,
      ageRange: {
        minimum: 18,
        maximum: 65,
        unit: "YEARS"
      },
      genderEligibility: "ALL",
      healthyVolunteers: true,
      geographicScope: "SINGLE_COUNTRY"
    },
    
    inclusionCriteria: [
      {
        id: "IC001",
        text: "Age 18-65 years",
        category: "DEMOGRAPHICS",
        aiConfidence: 0.99
      },
      {
        id: "IC002",
        text: "Healthy volunteers or Type 2 diabetes",
        category: "MEDICAL_HISTORY",
        aiConfidence: 0.95
      }
    ],
    
    exclusionCriteria: [
      {
        id: "EC001",
        text: "Type 1 diabetes",
        category: "MEDICAL_HISTORY",
        aiConfidence: 0.98
      }
    ],
    
    epochs: [
      {
        code: "SCREENING",
        name: "Screening Period",
        description: "Subject screening and eligibility assessment",
        order: 1,
        duration: { value: 21, unit: "DAYS" },
        isTreatment: false
      },
      {
        code: "TREATMENT",
        name: "Treatment Period",
        description: "Single dose administration",
        order: 2,
        duration: { value: 1, unit: "DAY" },
        isTreatment: true
      },
      {
        code: "FOLLOWUP",
        name: "Follow-up Period",
        description: "Safety and PK follow-up",
        order: 3,
        duration: { value: 7, unit: "DAYS" },
        isTreatment: false
      }
    ],
    
    visits: [
      {
        number: 1,
        code: "VISIT_1",
        name: "Screening",
        epoch: "SCREENING",
        nominalDay: -21,
        window: { before: 0, after: 7, unit: "DAYS" },
        type: "SCHEDULED",
        required: true,
        procedures: [
          { name: "Informed Consent", timing: "PRE_PROCEDURE", required: true },
          { name: "Medical History", timing: "PROCEDURE", required: true }
        ]
      },
      {
        number: 2,
        code: "VISIT_2",
        name: "Treatment",
        epoch: "TREATMENT",
        nominalDay: 0,
        window: { before: 0, after: 0, unit: "DAYS" },
        type: "SCHEDULED",
        required: true,
        procedures: [
          { name: "Drug Administration", timing: "PROCEDURE", required: true },
          { name: "PK Sampling", timing: "PROCEDURE", required: true }
        ]
      }
    ],
    
    treatmentArms: [
      {
        code: "ARM_A",
        name: "Novel Insulin",
        description: "Novel insulin formulation",
        type: "EXPERIMENTAL",
        plannedSubjects: 48,
        interventions: [
          {
            code: "NOVEL_INSULIN",
            name: "Novel Insulin Formulation",
            type: "DRUG",
            dosing: {
              route: "SUBCUTANEOUS",
              form: "INJECTION",
              strength: "Various doses",
              frequency: "SINGLE_DOSE"
            }
          }
        ]
      }
    ],
    
    objectives: [
      {
        type: "PRIMARY",
        number: 1,
        description: "Evaluate safety and tolerability of novel insulin formulation",
        endpoints: [
          {
            type: "PRIMARY",
            title: "Safety Assessment",
            description: "Incidence of adverse events",
            measurement: {
              parameter: "ADVERSE_EVENTS",
              method: "CLINICAL_ASSESSMENT",
              timepoints: ["DAY_1", "DAY_7"],
              units: "COUNT"
            }
          }
        ]
      },
      {
        type: "SECONDARY",
        number: 2,
        description: "Characterize pharmacokinetics of novel insulin formulation",
        endpoints: [
          {
            type: "SECONDARY",
            title: "PK Parameters",
            description: "Cmax, Tmax, AUC",
            measurement: {
              parameter: "INSULIN_CONCENTRATION",
              method: "BIOANALYTICAL",
              timepoints: ["MULTIPLE"],
              units: "NG/ML"
            }
          }
        ]
      }
    ],
    
    assessments: {
      safetyAssessments: [
        {
          id: "SA001",
          name: "Vital Signs",
          description: "Blood pressure, heart rate, temperature",
          frequency: "Multiple timepoints",
          required: true
        },
        {
          id: "SA002",
          name: "Laboratory Tests",
          description: "Safety laboratory assessments",
          frequency: "Screening, Day 1, Day 7",
          required: true
        }
      ],
      efficacyAssessments: [],
      pkAssessments: [
        {
          id: "PK001",
          name: "Pharmacokinetic Sampling",
          description: "Blood samples for insulin concentration analysis",
          frequency: "Multiple timepoints",
          required: true
        }
      ],
      biomarkerAssessments: []
    },
    
    regulatoryCompliance: {
      authority: "FDA",
      gcpStandard: "ICH_GCP",
      dataIntegrityLevel: "STANDARD"
    },
    
    auditTrailSettings: {
      auditLevel: "STANDARD",
      retentionPeriod: "10_YEARS",
      electronicSignatureRequired: true
    },
    
    userRoles: [
      { roleName: "Principal Investigator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" },
      { roleName: "Study Coordinator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" }
    ],
    
    dataSecurity: {
      encryptionLevel: "AES_256",
      backupFrequency: "DAILY",
      privacyCompliance: ["HIPAA"]
    },
    
    aiInsights: {
      protocolDeviationPrediction: {
        status: "INACTIVE",
        riskScore: 0.0,
        predictedDeviations: [],
        recommendations: ""
      },
      enrollmentForecast: {
        status: "NOT_STARTED",
        currentEnrollment: 0,
        targetEnrollment: 48,
        projectedCompletionDate: new Date("2025-06-30"),
        onTrack: true,
        variance: "Not started",
        factors: []
      },
      dataQualityAnomalies: {
        status: "INACTIVE",
        anomaliesDetected: 0,
        criticalAnomalies: 0,
        details: [],
        recommendations: ""
      }
    },
    
    createdBy: "system",
    updatedBy: "system"
  }
];

async function migrateData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const studiesCollection = db.collection('studies');
    
    // Clear existing data
    console.log('🗑️ Clearing existing studies...');
    await studiesCollection.deleteMany({});
    console.log('✅ Cleared existing studies');
    
    // Insert comprehensive data
    console.log('📝 Inserting comprehensive study data...');
    const result = await studiesCollection.insertMany(comprehensiveMockData);
    console.log(`✅ Successfully inserted ${result.insertedCount} studies`);
    
    // Verify the data
    const count = await studiesCollection.countDocuments();
    console.log(`📊 Total studies in database: ${count}`);
    
    // Display sample data
    const sampleStudy = await studiesCollection.findOne({ studyId: "STUDY-2025-001" });
    if (sampleStudy) {
      console.log('\n📋 Sample study data structure:');
      console.log(`- Study ID: ${sampleStudy.studyId}`);
      console.log(`- Study Name: ${sampleStudy.studyName}`);
      console.log(`- Phase: ${sampleStudy.studyPhase}`);
      console.log(`- Status: ${sampleStudy.studyStatus}`);
      console.log(`- Completion: ${sampleStudy.completionPercentage}%`);
      console.log(`- Treatment Arms: ${sampleStudy.treatmentArms?.length || 0}`);
      console.log(`- Objectives: ${sampleStudy.objectives?.length || 0}`);
      console.log(`- Epochs: ${sampleStudy.epochs?.length || 0}`);
      console.log(`- Visits: ${sampleStudy.visits?.length || 0}`);
      console.log(`- Safety Assessments: ${sampleStudy.assessments?.safetyAssessments?.length || 0}`);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('📝 This was a one-time migration. You can now delete this script.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
migrateData(); 