// Mock data with complete structure for various sections
export const mockStudyData = {
  _id: "507f1f77bcf86cd799439011",
  studyId: "STUDY-2025-001",
  protocol: {
    number: "PROTO-001",
    version: "1.0",
    date: "2025-01-15T00:00:00Z",
    title: {
      full: "A Phase 3, Randomized, Double-Blind, Placebo-Controlled Study of Tirzepatide in Adults with Type 1 Diabetes and Obesity/Overweight",
      short: "Tirzepatide T1D Study",
      translations: {
        es: "Estudio de Tirzepatida en Diabetes Tipo 1",
        fr: "Étude de Tirzepatide dans le Diabète de Type 1",
      },
    },
    amendments: [
      {
        version: "1.1",
        date: "2025-02-01T00:00:00Z",
        description: "Updated inclusion criteria for HbA1c levels",
        changes: ["Modified IC002 HbA1c threshold"],
      },
    ],
  },
  classification: {
    type: "INTERVENTIONAL",
    phase: "PHASE_3",
    therapeuticArea: "DIABETES",
    indication: "Type 1 Diabetes",
    keywords: ["diabetes", "tirzepatide", "obesity"],
    customCategories: {
      riskLevel: "HIGH",
      complexity: "COMPLEX",
      aiGenerated: true,
    },
  },
  organization: {
    sponsor: {
      name: "Pharmaceutical Company Inc.",
      contact: {
        email: "clinical@pharma.com",
        phone: "+1-555-0123",
      },
      role: "SPONSOR",
    },
    cro: {
      name: "Global CRO Solutions",
      contact: {
        email: "operations@globalcro.com",
        phone: "+1-555-0456",
      },
      role: "CRO",
    },
    investigators: [
      {
        type: "GLOBAL_PI",
        name: "Dr. Sarah Johnson",
        affiliation: "University Medical Center",
        contact: {
          email: "s.johnson@umc.edu",
          phone: "+1-555-0789",
        },
      },
    ],
  },
  status: {
    current: "ACTIVE",
    history: [
      {
        status: "PLANNING",
        date: "2024-12-01T00:00:00Z",
        reason: "Study setup and protocol development",
      },
      {
        status: "ACTIVE",
        date: "2025-01-15T00:00:00Z",
        reason: "First patient enrolled",
      },
    ],
    milestones: {
      firstPatientIn: "2025-01-15T00:00:00Z",
      lastPatientIn: "2025-12-31T00:00:00Z",
      lastPatientOut: "2026-10-31T00:00:00Z",
      databaseLock: "2026-12-15T00:00:00Z",
    },
  },
}

export const mockDesignData = {
  design: {
    type: "PARALLEL_GROUP",
    allocation: "RANDOMIZED",
    blinding: {
      type: "DOUBLE_BLIND",
      blindedRoles: ["PARTICIPANT", "INVESTIGATOR", "ASSESSOR"],
      unblindingProcedure: "Emergency code break available 24/7",
    },
    control: {
      type: "PLACEBO",
      description: "Matching placebo injection",
    },
  },
  population: {
    target: "Adults with Type 1 Diabetes and obesity/overweight",
    plannedSize: 905,
    ageRange: {
      minimum: 18,
      maximum: null,
      unit: "YEARS",
    },
    genderEligibility: "ALL",
    healthyVolunteers: false,
    geographicScope: "GLOBAL",
  },
  inclusionCriteria: [
    {
      id: "IC001",
      text: "Age ≥18 years",
      category: "DEMOGRAPHICS",
      aiConfidence: 0.99,
    },
    {
      id: "IC002",
      text: "Type 1 diabetes diagnosis with insulin treatment ≥1 year",
      category: "MEDICAL_HISTORY",
      aiConfidence: 0.95,
    },
    {
      id: "IC003",
      text: "BMI ≥27 kg/m² or ≥25 kg/m² with weight-related comorbidity",
      category: "ANTHROPOMETRIC",
      aiConfidence: 0.97,
    },
  ],
  exclusionCriteria: [
    {
      id: "EC001",
      text: "≥2 hospitalizations for hyperglycemia/DKA in 180 days",
      category: "MEDICAL_HISTORY",
      aiConfidence: 0.92,
    },
    {
      id: "EC002",
      text: "History of pancreatitis or pancreatic cancer",
      category: "MEDICAL_HISTORY",
      aiConfidence: 0.98,
    },
  ],
}

export const mockTimelineData = {
  epochs: [
    {
      code: "SCREENING",
      name: "Screening Period",
      description: "Subject screening and eligibility assessment",
      order: 1,
      duration: { value: 35, unit: "DAYS", range: { min: 21, max: 35 } },
      isTreatment: false,
    },
    {
      code: "TREATMENT",
      name: "Treatment Period",
      description: "Active treatment administration",
      order: 2,
      duration: { value: 40, unit: "WEEKS" },
      isTreatment: true,
    },
    {
      code: "FOLLOWUP",
      name: "Follow-up Period",
      description: "Safety follow-up after treatment",
      order: 3,
      duration: { value: 4, unit: "WEEKS" },
      isTreatment: false,
    },
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
        { name: "Medical History", timing: "PROCEDURE", required: true },
      ],
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
        { name: "Vital Signs", timing: "PROCEDURE", required: true },
      ],
    },
  ],
}

export const mockTreatmentArms = [
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
          frequency: "WEEKLY",
        },
      },
    ],
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
          frequency: "WEEKLY",
        },
      },
    ],
  },
]

export const mockObjectives = [
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
          units: "PERCENT",
        },
      },
    ],
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
          units: "PERCENT",
        },
      },
    ],
  },
]

export const mockAssessmentsData = {
  safetyAssessments: [
    {
      id: "SA001",
      name: "Vital Signs",
      description: "Blood pressure, heart rate, respiratory rate, temperature",
      frequency: "All visits",
      required: true,
    },
    {
      id: "SA002",
      name: "Laboratory Tests",
      description: "Hematology, chemistry, urinalysis",
      frequency: "Baseline, Week 4, Week 12, End of Study",
      required: true,
    },
    {
      id: "SA003",
      name: "Adverse Events (AEs)",
      description: "Collection and reporting of all adverse events",
      frequency: "Continuous",
      required: true,
    },
  ],
  efficacyAssessments: [
    {
      id: "EA001",
      name: "HbA1c",
      description: "Glycated hemoglobin measurement",
      frequency: "Baseline, Week 12, Week 24, Week 40",
      required: true,
    },
    {
      id: "EA002",
      name: "Body Weight",
      description: "Measurement of body weight",
      frequency: "All visits",
      required: true,
    },
    {
      id: "EA003",
      name: "CGM Data",
      description: "Continuous Glucose Monitoring data collection",
      frequency: "Baseline, Week 20, Week 40",
      required: false,
    },
  ],
  pkAssessments: [
    {
      id: "PK001",
      name: "Pharmacokinetic Sampling",
      description: "Blood samples for drug concentration analysis",
      frequency: "Specific visits",
      required: true,
    },
  ],
  biomarkerAssessments: [
    {
      id: "BM001",
      name: "Inflammatory Markers",
      description: "Measurement of C-reactive protein, IL-6",
      frequency: "Baseline, Week 40",
      required: false,
    },
  ],
}

export const mockAuditData = {
  regulatoryCompliance: {
    authority: "FDA",
    gcpStandard: "ICH_GCP",
    dataIntegrityLevel: "ENHANCED",
  },
  auditTrailSettings: {
    auditLevel: "COMPREHENSIVE",
    retentionPeriod: "15_YEARS",
    electronicSignatureRequired: true,
  },
  userRoles: [
    { roleName: "Principal Investigator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" },
    { roleName: "Study Coordinator", permissionLevel: "DATA_ENTRY", dataAccess: "OWN_SITE" },
    { roleName: "Data Manager", permissionLevel: "ADMIN", dataAccess: "ALL_SITES" },
  ],
  dataSecurity: {
    encryptionLevel: "AES_256",
    backupFrequency: "DAILY",
    privacyCompliance: ["GDPR", "HIPAA"],
  },
}

export const mockAiInsightsData = {
  protocolDeviationPrediction: {
    status: "ACTIVE",
    riskScore: 0.75,
    predictedDeviations: [
      { type: "Missed Visit", likelihood: "HIGH", details: "Site 001, Subject 103, Visit 5" },
      { type: "Inclusion/Exclusion Violation", likelihood: "MEDIUM", details: "Site 005, Subject 210" },
    ],
    recommendations: "Review site 001 visit scheduling, re-train site 005 on eligibility criteria.",
  },
  enrollmentForecast: {
    status: "ACTIVE",
    currentEnrollment: 280,
    targetEnrollment: 905,
    projectedCompletionDate: "2026-03-15",
    onTrack: false,
    variance: "-3 months",
    factors: ["Slow site activation", "High screen failure rate"],
  },
  dataQualityAnomalies: {
    status: "ACTIVE",
    anomaliesDetected: 12,
    criticalAnomalies: 3,
    details: [
      { type: "Outlier Data Point", field: "HbA1c", subject: "105", visit: "Week 12" },
      { type: "Missing Data", field: "Body Weight", subject: "201", visit: "Week 8" },
    ],
    recommendations: "Query site 105 for HbA1c re-check, follow up on missing data for subject 201.",
  },
}

export const mockStudiesList = [
  {
    id: "STUDY-2025-001",
    title: "Tirzepatide in Type 1 Diabetes with Obesity",
    phase: "PHASE_3",
    status: "ACTIVE",
    indication: "Type 1 Diabetes",
    sponsor: "Pharmaceutical Company Inc.",
    createdDate: "2025-01-15",
    processingStatus: "COMPLETED",
    participants: 453,
    sites: 12,
    countries: 8,
    completion: 67,
    lastActivity: "2 hours ago",
    priority: "HIGH",
  },
  {
    id: "STUDY-2025-002",
    title: "Semaglutide for Weight Management in Obesity",
    phase: "PHASE_2",
    status: "RECRUITING",
    indication: "Obesity",
    sponsor: "BioPharma Corp",
    createdDate: "2025-01-20",
    processingStatus: "PROCESSING",
    participants: 280,
    sites: 8,
    countries: 5,
    completion: 23,
    lastActivity: "1 day ago",
    priority: "MEDIUM",
  },
  {
    id: "STUDY-2025-003",
    title: "Continuous Glucose Monitoring Efficacy Trial",
    phase: "PHASE_3",
    status: "COMPLETED",
    indication: "Type 1 Diabetes",
    sponsor: "MedDevice Inc.",
    createdDate: "2024-12-10",
    processingStatus: "COMPLETED",
    participants: 156,
    sites: 5,
    countries: 3,
    completion: 100,
    lastActivity: "1 week ago",
    priority: "LOW",
  },
  {
    id: "STUDY-2025-004",
    title: "Novel Insulin Formulation Safety Study",
    phase: "PHASE_1",
    status: "PLANNING",
    indication: "Type 2 Diabetes",
    sponsor: "InnovatePharma Ltd.",
    createdDate: "2025-02-01",
    processingStatus: "COMPLETED",
    participants: 48,
    sites: 2,
    countries: 1,
    completion: 0,
    lastActivity: "3 days ago",
    priority: "HIGH",
  },
]
