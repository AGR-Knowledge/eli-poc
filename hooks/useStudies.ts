import { useState, useEffect } from 'react';

export interface Study {
  _id: string;
  id: string;
  title: string;
  description: string;
  sponsor: string;
  principalInvestigator: string;
  status: 'draft' | 'active' | 'completed' | 'terminated' | 'planning' | 'recruiting' | 'suspended';
  phase: 'I' | 'II' | 'III' | 'IV' | 'PILOT' | 'FEASIBILITY';
  indication: string;
  therapeuticArea: string;
  startDate: string;
  endDate?: string;
  enrollmentTarget: number;
  currentEnrollment: number;
  sites: number;
  visits: Array<{
    visitId: string;
    visitName: string;
    visitNumber: number;
    dayOffset: number;
    windowMin: number;
    windowMax: number;
    required: boolean;
  }>;
  endpoints: Array<{
    endpointId: string;
    endpointName: string;
    endpointType: 'primary' | 'secondary' | 'exploratory';
    description: string;
  }>;
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  treatments: Array<{
    treatmentId: string;
    treatmentName: string;
    treatmentType: 'drug' | 'device' | 'procedure';
    description: string;
  }>;
  documents: Array<{
    documentId: string;
    documentName: string;
    documentType: 'protocol' | 'informed_consent' | 'case_report_form' | 'other';
    uploadDate: string;
    filePath: string;
  }>;
  createdAt: string;
  updatedAt: string;
  
  // Additional fields for home page display
  participants: number;
  completion: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  processingStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  lastActivity: string;
  countries: number;
  createdDate: string;
}

// Comprehensive study interface for detailed view
export interface ComprehensiveStudy {
  _id?: string;
  studyId: string;
  studyName: string;
  studyDescription: string;
  
  // Protocol information
  protocolNumber: string;
  protocolVersion: string;
  protocolDate: Date;
  protocolTitle: string;
  protocolShortTitle: string;
  
  // Study classification
  studyType: 'INTERVENTIONAL' | 'OBSERVATIONAL' | 'EXPANDED_ACCESS';
  studyPhase: 'I' | 'II' | 'III' | 'IV' | 'PILOT' | 'FEASIBILITY';
  therapeuticArea: string;
  indication: string;
  keywords: string[];
  
  // Organization information
  sponsor: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  cro: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  principalInvestigator: {
    name: string;
    affiliation: string;
    email: string;
    phone: string;
    type: string;
  };
  
  // Study status and timeline
  studyStatus: 'PLANNING' | 'ACTIVE' | 'RECRUITING' | 'SUSPENDED' | 'COMPLETED' | 'TERMINATED';
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
  plannedEnrollment: number;
  currentEnrollment: number;
  enrollmentStatus: 'NOT_STARTED' | 'RECRUITING' | 'ACTIVE' | 'COMPLETED';
  
  // Progress tracking
  completionPercentage: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  processingStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  lastActivity: string;
  
  // Design data
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
  
  // Timeline data
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
  
  // Arms data
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
  
  // Objectives data
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
  
  // Assessments data
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
  
  // Audit data
  regulatoryCompliance: {
    authority: string;
    gcpStandard: string;
    dataIntegrityLevel: string;
  };
  
  auditTrailSettings: {
    auditLevel: string;
    retentionPeriod: string;
    electronicSignatureRequired: boolean;
  };
  
  userRoles: Array<{
    roleName: string;
    permissionLevel: string;
    dataAccess: string;
  }>;
  
  dataSecurity: {
    encryptionLevel: string;
    backupFrequency: string;
    privacyCompliance: string[];
  };
  
  // AI Insights data
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
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

interface UseStudiesOptions {
  status?: string;
  therapeuticArea?: string;
  sponsor?: string;
  page?: number;
  limit?: number;
}

interface StudiesResponse {
  studies: Study[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useStudies(options: UseStudiesOptions = {}) {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<StudiesResponse['pagination'] | null>(null);

  const fetchStudies = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.therapeuticArea) params.append('therapeuticArea', options.therapeuticArea);
      if (options.sponsor) params.append('sponsor', options.sponsor);
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());

      console.log('Fetching studies with params:', params.toString());
      const response = await fetch(`/api/studies?${params.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch studies:', response.status, errorText);
        throw new Error('Failed to fetch studies');
      }

      const data: StudiesResponse = await response.json();
      console.log('Fetched studies:', data);
      setStudies(data.studies);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error in fetchStudies:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, [options.status, options.therapeuticArea, options.sponsor, options.page, options.limit]);

  const createStudy = async (studyData: Partial<ComprehensiveStudy>) => {
    try {
      const response = await fetch('/api/studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studyData),
      });

      if (!response.ok) {
        throw new Error('Failed to create study');
      }

      const newStudy = await response.json();
      setStudies(prev => [newStudy, ...prev]);
      return newStudy;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create study');
      throw err;
    }
  };

  const updateStudy = async (studyId: string, studyData: Partial<ComprehensiveStudy>) => {
    try {
      const response = await fetch(`/api/studies/${studyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studyData),
      });

      if (!response.ok) {
        throw new Error('Failed to update study');
      }

      const updatedStudy = await response.json();
      setStudies(prev => prev.map(study => 
        study.id === studyId ? { ...study, ...updatedStudy } : study
      ));
      return updatedStudy;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update study');
      throw err;
    }
  };

  const deleteStudy = async (studyId: string) => {
    try {
      const response = await fetch(`/api/studies/${studyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete study');
      }

      setStudies(prev => prev.filter(study => study.id !== studyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete study');
      throw err;
    }
  };

  return {
    studies,
    loading,
    error,
    pagination,
    fetchStudies,
    createStudy,
    updateStudy,
    deleteStudy,
  };
}

// Hook for fetching a single study with comprehensive data
export function useStudy(studyId: string | null) {
  const [study, setStudy] = useState<ComprehensiveStudy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudy = async () => {
    if (!studyId) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/studies/${studyId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch study');
      }

      const data: ComprehensiveStudy = await response.json();
      setStudy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStudy = async (studyData: Partial<ComprehensiveStudy>) => {
    if (!studyId || !study) return;
    
    try {
      const response = await fetch(`/api/studies/${studyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studyData),
      });

      if (!response.ok) {
        throw new Error('Failed to update study');
      }

      const updatedStudy = await response.json();
      setStudy(updatedStudy);
      return updatedStudy;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update study');
      throw err;
    }
  };

  useEffect(() => {
    fetchStudy();
  }, [studyId]);

  return {
    study,
    loading,
    error,
    fetchStudy,
    updateStudy,
  };
} 