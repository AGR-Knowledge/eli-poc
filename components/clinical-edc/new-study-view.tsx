"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Plus, Sparkles, Users, ArrowLeft } from "lucide-react"
import { FileUpload } from "./file-upload"
import { OverviewTab } from "./tabs/overview-tab"
import { DesignTab } from "./tabs/design-tab"
import { TimelineTab } from "./tabs/timeline-tab"
import { ArmsTab } from "./tabs/arms-tab"
import { ObjectivesTab } from "./tabs/objectives-tab"
import { AssessmentsTab } from "./tabs/assessments-tab"
import { AuditTab } from "./tabs/audit-tab"
import { AiInsightsTab } from "./tabs/ai-insights-tab"
import { FlaskConical, Calendar, Pill, Target, Shield, FileText } from "lucide-react"
import { ComprehensiveStudy } from "@/hooks/useStudies"

interface NewStudyViewProps {
  setCurrentView: (view: "studies" | "study" | "upload" | "new-study") => void
  handleCreateUsingAI: () => void
  handleFileUpload: (file: File) => void
  processingStatus: "PROCESSING" | "SUCCESS" | "FAILED" | null
  processingProgress: number
}

export function NewStudyView({
  setCurrentView,
  handleCreateUsingAI,
  handleFileUpload,
  processingStatus,
  processingProgress,
}: NewStudyViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize empty study data for form with state management
  const [studyData, setStudyData] = useState<ComprehensiveStudy>({
    studyId: '',
    studyName: '',
    studyDescription: '',
    protocolNumber: '',
    protocolVersion: '1.0',
    protocolDate: new Date(),
    protocolTitle: '',
    protocolShortTitle: '',
    studyType: 'INTERVENTIONAL',
    studyPhase: 'I',
    therapeuticArea: '',
    indication: '',
    keywords: [],
    sponsor: {
      name: '',
      email: '',
      phone: '',
      role: 'SPONSOR'
    },
    cro: {
      name: '',
      email: '',
      phone: '',
      role: 'CRO'
    },
    principalInvestigator: {
      name: '',
      affiliation: '',
      email: '',
      phone: '',
      type: 'GLOBAL_PI'
    },
    studyStatus: 'PLANNING',
    statusHistory: [],
    milestones: {
      firstPatientIn: new Date(),
      lastPatientIn: new Date(),
      lastPatientOut: new Date(),
      databaseLock: new Date()
    },
    plannedEnrollment: 0,
    currentEnrollment: 0,
    enrollmentStatus: 'NOT_STARTED',
    completionPercentage: 0,
    priority: 'MEDIUM',
    processingStatus: 'COMPLETED',
    lastActivity: 'Just now',
    studyDesign: {
      type: 'PARALLEL_GROUP',
      allocation: 'RANDOMIZED',
      blinding: {
        type: 'DOUBLE_BLIND',
        blindedRoles: ['PARTICIPANT', 'INVESTIGATOR'],
        unblindingProcedure: 'Emergency unblinding available'
      },
      control: {
        type: 'PLACEBO',
        description: 'Matching placebo'
      }
    },
    population: {
      target: '',
      plannedSize: 0,
      ageRange: {
        minimum: 18,
        maximum: undefined,
        unit: 'YEARS'
      },
      genderEligibility: 'ALL',
      healthyVolunteers: false,
      geographicScope: 'SINGLE_COUNTRY'
    },
    inclusionCriteria: [],
    exclusionCriteria: [],
    epochs: [],
    visits: [],
    treatmentArms: [],
    objectives: [],
    assessments: {
      safetyAssessments: [],
      efficacyAssessments: [],
      pkAssessments: [],
      biomarkerAssessments: []
    },
    regulatoryCompliance: {
      authority: 'FDA',
      gcpStandard: 'ICH_GCP',
      dataIntegrityLevel: 'STANDARD'
    },
    auditTrailSettings: {
      auditLevel: 'STANDARD',
      retentionPeriod: '10_YEARS',
      electronicSignatureRequired: true
    },
    userRoles: [
      {
        roleName: 'Principal Investigator',
        permissionLevel: 'DATA_ENTRY',
        dataAccess: 'OWN_SITE'
      }
    ],
    dataSecurity: {
      encryptionLevel: 'AES_256',
      backupFrequency: 'DAILY',
      privacyCompliance: ['HIPAA']
    },
    aiInsights: {
      protocolDeviationPrediction: {
        status: 'INACTIVE',
        riskScore: 0.0,
        predictedDeviations: [],
        recommendations: ''
      },
      enrollmentForecast: {
        status: 'NOT_STARTED',
        currentEnrollment: 0,
        targetEnrollment: 0,
        projectedCompletionDate: new Date(),
        onTrack: true,
        variance: 'Not started',
        factors: []
      },
      dataQualityAnomalies: {
        status: 'INACTIVE',
        anomaliesDetected: 0,
        criticalAnomalies: 0,
        details: [],
        recommendations: ''
      }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    updatedBy: 'system'
  })

  // Function to update study data
  const updateStudyData = (updates: Partial<ComprehensiveStudy>) => {
    setStudyData(prev => ({ ...prev, ...updates }))
  }

  // Function to add treatment arm
  const addTreatmentArm = () => {
    const newArm = {
      code: `ARM_${studyData.treatmentArms.length + 1}`,
      name: '',
      description: '',
      type: 'EXPERIMENTAL' as const,
      plannedSubjects: 0,
      interventions: []
    }
    updateStudyData({
      treatmentArms: [...studyData.treatmentArms, newArm]
    })
  }

  // Function to update treatment arm
  const updateTreatmentArm = (index: number, updates: any) => {
    const updatedArms = [...studyData.treatmentArms]
    updatedArms[index] = { ...updatedArms[index], ...updates }
    updateStudyData({ treatmentArms: updatedArms })
  }

  // Function to remove treatment arm
  const removeTreatmentArm = (index: number) => {
    const updatedArms = studyData.treatmentArms.filter((_, i) => i !== index)
    updateStudyData({ treatmentArms: updatedArms })
  }

  // Function to add intervention to treatment arm
  const addIntervention = (armIndex: number) => {
    const newIntervention = {
      code: `INT_${studyData.treatmentArms[armIndex].interventions.length + 1}`,
      name: '',
      type: 'DRUG',
      dosing: {
        route: 'ORAL',
        form: 'TABLET',
        strength: '10MG',
        frequency: 'ONCE_DAILY'
      }
    }
    const updatedArms = [...studyData.treatmentArms]
    updatedArms[armIndex].interventions.push(newIntervention)
    updateStudyData({ treatmentArms: updatedArms })
  }

  // Function to update intervention
  const updateIntervention = (armIndex: number, interventionIndex: number, updates: any) => {
    const updatedArms = [...studyData.treatmentArms]
    updatedArms[armIndex].interventions[interventionIndex] = {
      ...updatedArms[armIndex].interventions[interventionIndex],
      ...updates
    }
    updateStudyData({ treatmentArms: updatedArms })
  }

  // Function to remove intervention
  const removeIntervention = (armIndex: number, interventionIndex: number) => {
    const updatedArms = [...studyData.treatmentArms]
    updatedArms[armIndex].interventions = updatedArms[armIndex].interventions.filter((_, i) => i !== interventionIndex)
    updateStudyData({ treatmentArms: updatedArms })
  }

  // Function to add objective
  const addObjective = () => {
    const newObjective = {
      number: studyData.objectives.length + 1,
      type: 'PRIMARY' as const,
      description: '',
      endpoints: []
    }
    updateStudyData({
      objectives: [...studyData.objectives, newObjective]
    })
  }

  // Function to update objective
  const updateObjective = (index: number, updates: any) => {
    const updatedObjectives = [...studyData.objectives]
    updatedObjectives[index] = { ...updatedObjectives[index], ...updates }
    updateStudyData({ objectives: updatedObjectives })
  }

  // Function to remove objective
  const removeObjective = (index: number) => {
    const updatedObjectives = studyData.objectives.filter((_, i) => i !== index)
    updateStudyData({ objectives: updatedObjectives })
  }

  // Function to add endpoint to objective
  const addEndpoint = (objectiveIndex: number) => {
    const newEndpoint = {
      type: 'PRIMARY',
      title: '',
      description: '',
      measurement: {
        parameter: '',
        method: 'CENTRAL_LAB',
        timepoints: [],
        units: ''
      }
    }
    const updatedObjectives = [...studyData.objectives]
    updatedObjectives[objectiveIndex].endpoints.push(newEndpoint)
    updateStudyData({ objectives: updatedObjectives })
  }

  // Function to update endpoint
  const updateEndpoint = (objectiveIndex: number, endpointIndex: number, updates: any) => {
    const updatedObjectives = [...studyData.objectives]
    updatedObjectives[objectiveIndex].endpoints[endpointIndex] = {
      ...updatedObjectives[objectiveIndex].endpoints[endpointIndex],
      ...updates
    }
    updateStudyData({ objectives: updatedObjectives })
  }

  // Function to remove endpoint
  const removeEndpoint = (objectiveIndex: number, endpointIndex: number) => {
    const updatedObjectives = [...studyData.objectives]
    updatedObjectives[objectiveIndex].endpoints = updatedObjectives[objectiveIndex].endpoints.filter((_, i) => i !== endpointIndex)
    updateStudyData({ objectives: updatedObjectives })
  }

  // Function to add inclusion criterion
  const addInclusionCriterion = () => {
    const newCriterion = {
      id: `INC_${studyData.inclusionCriteria.length + 1}`,
      text: '',
      category: 'DEMOGRAPHICS'
    }
    updateStudyData({
      inclusionCriteria: [...studyData.inclusionCriteria, newCriterion]
    })
  }

  // Function to update inclusion criterion
  const updateInclusionCriterion = (index: number, updates: any) => {
    const updatedCriteria = [...studyData.inclusionCriteria]
    updatedCriteria[index] = { ...updatedCriteria[index], ...updates }
    updateStudyData({ inclusionCriteria: updatedCriteria })
  }

  // Function to remove inclusion criterion
  const removeInclusionCriterion = (index: number) => {
    const updatedCriteria = studyData.inclusionCriteria.filter((_, i) => i !== index)
    updateStudyData({ inclusionCriteria: updatedCriteria })
  }

  // Function to add exclusion criterion
  const addExclusionCriterion = () => {
    const newCriterion = {
      id: `EXC_${studyData.exclusionCriteria.length + 1}`,
      text: '',
      category: 'DEMOGRAPHICS'
    }
    updateStudyData({
      exclusionCriteria: [...studyData.exclusionCriteria, newCriterion]
    })
  }

  // Function to update exclusion criterion
  const updateExclusionCriterion = (index: number, updates: any) => {
    const updatedCriteria = [...studyData.exclusionCriteria]
    updatedCriteria[index] = { ...updatedCriteria[index], ...updates }
    updateStudyData({ exclusionCriteria: updatedCriteria })
  }

  // Function to remove exclusion criterion
  const removeExclusionCriterion = (index: number) => {
    const updatedCriteria = studyData.exclusionCriteria.filter((_, i) => i !== index)
    updateStudyData({ exclusionCriteria: updatedCriteria })
  }

  const handleCreateStudy = async (isDraft: boolean = false) => {
    try {
      setIsCreating(true)
      setError(null)
      
      // Generate a unique study ID and exclude _id field
      const { _id, ...studyDataWithoutId } = studyData;
      const formData = {
        ...studyDataWithoutId,
        studyId: studyData.studyId || `STUDY-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        studyStatus: isDraft ? 'DRAFT' : studyData.studyStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const response = await fetch('/api/studies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create study')
      }

      const newStudy = await response.json()
      
      // Navigate to the new study
      setCurrentView("studies")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create study')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header with Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          {/* Back button and title */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("studies")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Studies
            </Button>
            <div className="border-l border-gray-300 h-8"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Create New Study</h1>
              <p className="text-sm text-gray-600">Set up a new clinical trial</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleCreateUsingAI}
              className="border-gray-300 bg-transparent"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button
              onClick={() => handleCreateStudy(false)}
              disabled={isCreating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Study
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Setup Section */}
      <div className="bg-red-50/30 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Quick Setup with AI</h2>
            <p className="text-gray-600">Upload your protocol document to automatically populate study fields</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} isProcessing={processingStatus === "PROCESSING"} />
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Study Form with ALL TABS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white shadow-sm rounded-lg p-1 border border-gray-200">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <Users className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="arms"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <Pill className="h-4 w-4" />
              Arms
            </TabsTrigger>
            <TabsTrigger
              value="objectives"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <Target className="h-4 w-4" />
              Objectives
            </TabsTrigger>
            <TabsTrigger
              value="assessments"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <FlaskConical className="h-4 w-4" />
              Assessments
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <Shield className="h-4 w-4" />
              Audit
            </TabsTrigger>
            <TabsTrigger value="ai" disabled className="flex items-center gap-2 opacity-50 cursor-not-allowed">
              <Brain className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="overview">
            <OverviewTab 
              editMode={true} 
              studyData={studyData}
              onUpdateStudyData={updateStudyData}
            />
          </TabsContent>
          <TabsContent value="design">
            <DesignTab 
              editMode={true} 
              studyData={studyData}
              onUpdateStudyData={updateStudyData}
              onAddInclusionCriterion={addInclusionCriterion}
              onUpdateInclusionCriterion={updateInclusionCriterion}
              onRemoveInclusionCriterion={removeInclusionCriterion}
              onAddExclusionCriterion={addExclusionCriterion}
              onUpdateExclusionCriterion={updateExclusionCriterion}
              onRemoveExclusionCriterion={removeExclusionCriterion}
            />
          </TabsContent>
          <TabsContent value="timeline">
            <TimelineTab 
              editMode={true} 
              studyData={studyData}
              onUpdateStudyData={updateStudyData}
            />
          </TabsContent>
          <TabsContent value="arms">
            <ArmsTab 
              editMode={true} 
              studyData={studyData}
              onUpdateStudyData={updateStudyData}
              onAddTreatmentArm={addTreatmentArm}
              onUpdateTreatmentArm={updateTreatmentArm}
              onRemoveTreatmentArm={removeTreatmentArm}
              onAddIntervention={addIntervention}
              onUpdateIntervention={updateIntervention}
              onRemoveIntervention={removeIntervention}
            />
          </TabsContent>
          <TabsContent value="objectives">
            <ObjectivesTab 
              editMode={true} 
              studyData={studyData}
              onUpdateStudyData={updateStudyData}
              onAddObjective={addObjective}
              onUpdateObjective={updateObjective}
              onRemoveObjective={removeObjective}
              onAddEndpoint={addEndpoint}
              onUpdateEndpoint={updateEndpoint}
              onRemoveEndpoint={removeEndpoint}
            />
          </TabsContent>
          <TabsContent value="assessments">
            <AssessmentsTab 
              editMode={true} 
              studyData={studyData}
              onUpdateStudyData={updateStudyData}
            />
          </TabsContent>
          <TabsContent value="audit">
            <AuditTab 
              editMode={true} 
              studyData={studyData}
              onUpdateStudyData={updateStudyData}
            />
          </TabsContent>
          <TabsContent value="ai">
            <AiInsightsTab 
              editMode={true} 
              studyData={studyData}
              onUpdateStudyData={updateStudyData}
            />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="border-gray-300 bg-transparent"
            onClick={() => setCurrentView("studies")}
          >
            Cancel
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleCreateStudy(true)}
            disabled={isCreating}
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Saving...
              </>
            ) : (
              'Save as Draft'
            )}
          </Button>
          <Button 
            onClick={() => handleCreateStudy(false)}
            disabled={isCreating}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Study'
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
