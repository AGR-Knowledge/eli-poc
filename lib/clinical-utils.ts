export const formatDate = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "RECRUITING":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "PLANNING":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "COMPLETED":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "SUSPENDED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getProcessingStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "PROCESSING":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200"
    case "MEDIUM":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "LOW":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const formatDateForInput = (dateInput: string | Date | undefined) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toISOString().split('T')[0];
}

/**
 * Normalize extracted data from Claude to match database schema
 */
export function normalizeExtractedData(data: any): any {
  console.log('Normalizing extracted data:', JSON.stringify(data, null, 2));
  
  const normalized = { ...data };

  // Ensure assessments object exists
  if (!normalized.assessments) {
    normalized.assessments = {};
  }

  // Convert criteria to proper object format
  if (Array.isArray(normalized.inclusionCriteria)) {
    normalized.inclusionCriteria = normalized.inclusionCriteria.map((criteria: any, index: number) => {
      if (typeof criteria === 'string') {
        return {
          id: `IC${String(index + 1).padStart(3, '0')}`,
          text: criteria,
          category: 'General',
          aiConfidence: 0.8
        };
      }
      return criteria;
    });
  } else if (typeof normalized.inclusionCriteria === 'string') {
    normalized.inclusionCriteria = [{
      id: 'IC001',
      text: normalized.inclusionCriteria,
      category: 'General',
      aiConfidence: 0.8
    }];
  } else {
    normalized.inclusionCriteria = [];
  }

  if (Array.isArray(normalized.exclusionCriteria)) {
    normalized.exclusionCriteria = normalized.exclusionCriteria.map((criteria: any, index: number) => {
      if (typeof criteria === 'string') {
        return {
          id: `EC${String(index + 1).padStart(3, '0')}`,
          text: criteria,
          category: 'General',
          aiConfidence: 0.8
        };
      }
      return criteria;
    });
  } else if (typeof normalized.exclusionCriteria === 'string') {
    normalized.exclusionCriteria = [{
      id: 'EC001',
      text: normalized.exclusionCriteria,
      category: 'General',
      aiConfidence: 0.8
    }];
  } else {
    normalized.exclusionCriteria = [];
  }

  // Convert assessments to proper object format
  if (Array.isArray(normalized.assessments.safetyAssessments)) {
    normalized.assessments.safetyAssessments = normalized.assessments.safetyAssessments.map((assessment: any, index: number) => {
      if (typeof assessment === 'string') {
        return {
          id: `SA${String(index + 1).padStart(3, '0')}`,
          name: assessment,
          description: assessment,
          frequency: 'As needed',
          required: true
        };
      }
      return assessment;
    });
  } else if (typeof normalized.assessments.safetyAssessments === 'string') {
    normalized.assessments.safetyAssessments = [{
      id: 'SA001',
      name: normalized.assessments.safetyAssessments,
      description: normalized.assessments.safetyAssessments,
      frequency: 'As needed',
      required: true
    }];
  } else {
    normalized.assessments.safetyAssessments = [];
  }

  if (Array.isArray(normalized.assessments.efficacyAssessments)) {
    normalized.assessments.efficacyAssessments = normalized.assessments.efficacyAssessments.map((assessment: any, index: number) => {
      if (typeof assessment === 'string') {
        return {
          id: `EA${String(index + 1).padStart(3, '0')}`,
          name: assessment,
          description: assessment,
          frequency: 'Regular intervals',
          required: true
        };
      }
      return assessment;
    });
  } else if (typeof normalized.assessments.efficacyAssessments === 'string') {
    normalized.assessments.efficacyAssessments = [{
      id: 'EA001',
      name: normalized.assessments.efficacyAssessments,
      description: normalized.assessments.efficacyAssessments,
      frequency: 'Regular intervals',
      required: true
    }];
  } else {
    normalized.assessments.efficacyAssessments = [];
  }

  if (Array.isArray(normalized.assessments.pkAssessments)) {
    normalized.assessments.pkAssessments = normalized.assessments.pkAssessments.map((assessment: any, index: number) => {
      if (typeof assessment === 'string') {
        return {
          id: `PKA${String(index + 1).padStart(3, '0')}`,
          name: assessment,
          description: assessment,
          frequency: 'As scheduled',
          required: true
        };
      }
      return assessment;
    });
  } else if (typeof normalized.assessments.pkAssessments === 'string') {
    normalized.assessments.pkAssessments = [{
      id: 'PKA001',
      name: normalized.assessments.pkAssessments,
      description: normalized.assessments.pkAssessments,
      frequency: 'As scheduled',
      required: true
    }];
  } else {
    normalized.assessments.pkAssessments = [];
  }

  if (Array.isArray(normalized.assessments.biomarkerAssessments)) {
    normalized.assessments.biomarkerAssessments = normalized.assessments.biomarkerAssessments.map((assessment: any, index: number) => {
      if (typeof assessment === 'string') {
        return {
          id: `BA${String(index + 1).padStart(3, '0')}`,
          name: assessment,
          description: assessment,
          frequency: 'As scheduled',
          required: true
        };
      }
      return assessment;
    });
  } else if (typeof normalized.assessments.biomarkerAssessments === 'string') {
    normalized.assessments.biomarkerAssessments = [{
      id: 'BA001',
      name: normalized.assessments.biomarkerAssessments,
      description: normalized.assessments.biomarkerAssessments,
      frequency: 'As scheduled',
      required: true
    }];
  } else {
    normalized.assessments.biomarkerAssessments = [];
  }

  // Normalize study design
  if (normalized.studyDesign) {
    // Convert string blinding to object format
    if (typeof normalized.studyDesign.blinding === 'string') {
      const blindingType = normalized.studyDesign.blinding.toLowerCase();
      let mappedType = 'DOUBLE_BLIND';
      
      if (blindingType.includes('single')) {
        mappedType = 'SINGLE_BLIND';
      } else if (blindingType.includes('triple')) {
        mappedType = 'TRIPLE_BLIND';
      } else if (blindingType.includes('open')) {
        mappedType = 'OPEN';
      }
      
      normalized.studyDesign.blinding = {
        type: mappedType,
        blindedRoles: [],
        unblindingProcedure: 'Standard unblinding procedures apply'
      };
    }
    
    // Ensure other study design fields exist
    if (!normalized.studyDesign.type) {
      normalized.studyDesign.type = 'PARALLEL_GROUP';
    }
    if (!normalized.studyDesign.allocation) {
      normalized.studyDesign.allocation = 'RANDOMIZED';
    }
    if (!normalized.studyDesign.control) {
      normalized.studyDesign.control = {
        type: 'PLACEBO',
        description: 'Matching placebo'
      };
    }
  }

  // Map enum values to correct format
  const phaseMapping: { [key: string]: string } = {
    '1': 'I',
    '2': 'II', 
    '3': 'III',
    '4': 'IV',
    'I': 'I',
    'II': 'II',
    'III': 'III',
    'IV': 'IV',
    'PILOT': 'PILOT',
    'FEASIBILITY': 'FEASIBILITY'
  };

  if (normalized.studyPhase && phaseMapping[normalized.studyPhase]) {
    normalized.studyPhase = phaseMapping[normalized.studyPhase];
  }

  // Map treatment arm types
  const armTypeMapping: { [key: string]: string } = {
    'Experimental': 'EXPERIMENTAL',
    'Placebo Comparator': 'PLACEBO_COMPARATOR',
    'Active Comparator': 'ACTIVE_COMPARATOR',
    'EXPERIMENTAL': 'EXPERIMENTAL',
    'PLACEBO_COMPARATOR': 'PLACEBO_COMPARATOR',
    'ACTIVE_COMPARATOR': 'ACTIVE_COMPARATOR'
  };

  if (normalized.treatmentArms) {
    normalized.treatmentArms = normalized.treatmentArms.map((arm: any) => ({
      ...arm,
      type: armTypeMapping[arm.type] || 'EXPERIMENTAL'
    }));
  }

  // Map objective types
  const objectiveTypeMapping: { [key: string]: string } = {
    'Primary': 'PRIMARY',
    'Secondary': 'SECONDARY',
    'Key Secondary': 'SECONDARY',
    'Exploratory': 'EXPLORATORY',
    'PRIMARY': 'PRIMARY',
    'SECONDARY': 'SECONDARY',
    'EXPLORATORY': 'EXPLORATORY'
  };

  if (normalized.objectives) {
    normalized.objectives = normalized.objectives.map((obj: any, index: number) => ({
      ...obj,
      type: objectiveTypeMapping[obj.type] || 'SECONDARY',
      number: obj.number || index + 1
    }));
  }

  // Normalize population field
  if (normalized.population) {
    if (!normalized.population.target) {
      normalized.population.target = 'Adult participants with Type 1 Diabetes';
    }
    if (!normalized.population.plannedSize) {
      normalized.population.plannedSize = normalized.plannedEnrollment || 0;
    }
    if (!normalized.population.ageRange) {
      normalized.population.ageRange = {
        minimum: normalized.population.minimumAge || 18,
        unit: 'YEARS'
      };
    }
    if (!normalized.population.genderEligibility) {
      normalized.population.genderEligibility = normalized.population.gender === 'All' ? 'ALL' : 'MALE_AND_FEMALE';
    }
    if (normalized.population.healthyVolunteers === undefined) {
      normalized.population.healthyVolunteers = false;
    }
    if (!normalized.population.geographicScope) {
      normalized.population.geographicScope = 'MULTI_COUNTRY';
    }
  }

  // Ensure required fields have default values
  normalized.studyStatus = normalized.studyStatus || 'DRAFT';
  normalized.enrollmentStatus = normalized.enrollmentStatus || 'NOT_STARTED';
  normalized.completionPercentage = normalized.completionPercentage || 0;
  normalized.priority = normalized.priority || 'MEDIUM';
  normalized.processingStatus = normalized.processingStatus || 'COMPLETED';
  normalized.keywords = normalized.keywords || [];
  normalized.statusHistory = normalized.statusHistory || [];
  normalized.milestones = normalized.milestones || {
    firstPatientIn: new Date(),
    lastPatientIn: new Date(),
    lastPatientOut: new Date(),
    databaseLock: new Date()
  };

  return normalized;
}
