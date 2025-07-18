"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Users,
  Calendar,
  Pill,
  Target,
  FlaskConical,
  Shield,
  Brain,
  Edit,
  Save,
  Download,
  ArrowLeft,
} from "lucide-react"
import { OverviewTab } from "./tabs/overview-tab"
import { DesignTab } from "./tabs/design-tab"
import { TimelineTab } from "./tabs/timeline-tab"
import { ArmsTab } from "./tabs/arms-tab"
import { ObjectivesTab } from "./tabs/objectives-tab"
import { AssessmentsTab } from "./tabs/assessments-tab"
import { AuditTab } from "./tabs/audit-tab"
import { AiInsightsTab } from "./tabs/ai-insights-tab"
import { useStudy, ComprehensiveStudy } from "@/hooks/useStudies"

interface StudyDetailsViewProps {
  selectedStudy: string | null
  setCurrentView: (view: "studies" | "study" | "upload" | "new-study") => void
  editMode?: boolean
  setEditMode?: (editMode: boolean) => void
}

export function StudyDetailsView({ selectedStudy, setCurrentView, editMode: initialEditMode = false, setEditMode: setEditModeProp }: StudyDetailsViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [editMode, setEditMode] = useState(initialEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [editedStudy, setEditedStudy] = useState<ComprehensiveStudy | null>(null)
  
  // Fetch comprehensive study data from database
  const { study, loading, error, updateStudy } = useStudy(selectedStudy)

  // Update edited study when study data changes
  useEffect(() => {
    if (study) {
      setEditedStudy(study)
    }
  }, [study])

  // Sync editMode with prop
  useEffect(() => {
    setEditMode(initialEditMode)
  }, [initialEditMode])

  // Function to update edited study data
  const updateEditedStudy = (updates: Partial<ComprehensiveStudy>) => {
    if (editedStudy) {
      setEditedStudy({ ...editedStudy, ...updates })
    }
  }

  // Function to save changes
  const handleSaveChanges = async () => {
    if (!editedStudy || !updateStudy) return
    
    try {
      setIsSaving(true)
      setSaveError(null)
      
      await updateStudy(editedStudy)
      setEditMode(false)
      if (setEditModeProp) {
        setEditModeProp(false)
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditedStudy(study)
    setEditMode(false)
    if (setEditModeProp) {
      setEditModeProp(false)
    }
    setSaveError(null)
  }

  // Functions for adding/removing items in edit mode
  const addTreatmentArm = () => {
    if (!editedStudy) return
    const newArm = {
      code: `ARM_${editedStudy.treatmentArms.length + 1}`,
      name: '',
      description: '',
      type: 'EXPERIMENTAL' as const,
      plannedSubjects: 0,
      interventions: []
    }
    setEditedStudy({
      ...editedStudy,
      treatmentArms: [...editedStudy.treatmentArms, newArm]
    })
  }

  const updateTreatmentArm = (index: number, updates: any) => {
    if (!editedStudy) return
    const updatedArms = [...editedStudy.treatmentArms]
    updatedArms[index] = { ...updatedArms[index], ...updates }
    setEditedStudy({ ...editedStudy, treatmentArms: updatedArms })
  }

  const removeTreatmentArm = (index: number) => {
    if (!editedStudy) return
    const updatedArms = editedStudy.treatmentArms.filter((_, i) => i !== index)
    setEditedStudy({ ...editedStudy, treatmentArms: updatedArms })
  }

  const addIntervention = (armIndex: number) => {
    if (!editedStudy) return
    const newIntervention = {
      code: `INT_${editedStudy.treatmentArms[armIndex].interventions.length + 1}`,
      name: '',
      type: 'DRUG',
      dosing: {
        route: 'ORAL',
        form: 'TABLET',
        strength: '10MG',
        frequency: 'ONCE_DAILY'
      }
    }
    const updatedArms = [...editedStudy.treatmentArms]
    updatedArms[armIndex].interventions.push(newIntervention)
    setEditedStudy({ ...editedStudy, treatmentArms: updatedArms })
  }

  const updateIntervention = (armIndex: number, interventionIndex: number, updates: any) => {
    if (!editedStudy) return
    const updatedArms = [...editedStudy.treatmentArms]
    updatedArms[armIndex].interventions[interventionIndex] = {
      ...updatedArms[armIndex].interventions[interventionIndex],
      ...updates
    }
    setEditedStudy({ ...editedStudy, treatmentArms: updatedArms })
  }

  const removeIntervention = (armIndex: number, interventionIndex: number) => {
    if (!editedStudy) return
    const updatedArms = [...editedStudy.treatmentArms]
    updatedArms[armIndex].interventions = updatedArms[armIndex].interventions.filter((_, i) => i !== interventionIndex)
    setEditedStudy({ ...editedStudy, treatmentArms: updatedArms })
  }

  const addObjective = () => {
    if (!editedStudy) return
    const newObjective = {
      number: editedStudy.objectives.length + 1,
      type: 'PRIMARY' as const,
      description: '',
      endpoints: []
    }
    setEditedStudy({
      ...editedStudy,
      objectives: [...editedStudy.objectives, newObjective]
    })
  }

  const updateObjective = (index: number, updates: any) => {
    if (!editedStudy) return
    const updatedObjectives = [...editedStudy.objectives]
    updatedObjectives[index] = { ...updatedObjectives[index], ...updates }
    setEditedStudy({ ...editedStudy, objectives: updatedObjectives })
  }

  const removeObjective = (index: number) => {
    if (!editedStudy) return
    const updatedObjectives = editedStudy.objectives.filter((_, i) => i !== index)
    setEditedStudy({ ...editedStudy, objectives: updatedObjectives })
  }

  const addEndpoint = (objectiveIndex: number) => {
    if (!editedStudy) return
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
    const updatedObjectives = [...editedStudy.objectives]
    updatedObjectives[objectiveIndex].endpoints.push(newEndpoint)
    setEditedStudy({ ...editedStudy, objectives: updatedObjectives })
  }

  const updateEndpoint = (objectiveIndex: number, endpointIndex: number, updates: any) => {
    if (!editedStudy) return
    const updatedObjectives = [...editedStudy.objectives]
    updatedObjectives[objectiveIndex].endpoints[endpointIndex] = {
      ...updatedObjectives[objectiveIndex].endpoints[endpointIndex],
      ...updates
    }
    setEditedStudy({ ...editedStudy, objectives: updatedObjectives })
  }

  const removeEndpoint = (objectiveIndex: number, endpointIndex: number) => {
    if (!editedStudy) return
    const updatedObjectives = [...editedStudy.objectives]
    updatedObjectives[objectiveIndex].endpoints = updatedObjectives[objectiveIndex].endpoints.filter((_, i) => i !== endpointIndex)
    setEditedStudy({ ...editedStudy, objectives: updatedObjectives })
  }

  const addInclusionCriterion = () => {
    if (!editedStudy) return
    const newCriterion = {
      id: `INC_${editedStudy.inclusionCriteria.length + 1}`,
      text: '',
      category: 'DEMOGRAPHICS'
    }
    setEditedStudy({
      ...editedStudy,
      inclusionCriteria: [...editedStudy.inclusionCriteria, newCriterion]
    })
  }

  const updateInclusionCriterion = (index: number, updates: any) => {
    if (!editedStudy) return
    const updatedCriteria = [...editedStudy.inclusionCriteria]
    updatedCriteria[index] = { ...updatedCriteria[index], ...updates }
    setEditedStudy({ ...editedStudy, inclusionCriteria: updatedCriteria })
  }

  const removeInclusionCriterion = (index: number) => {
    if (!editedStudy) return
    const updatedCriteria = editedStudy.inclusionCriteria.filter((_, i) => i !== index)
    setEditedStudy({ ...editedStudy, inclusionCriteria: updatedCriteria })
  }

  const addExclusionCriterion = () => {
    if (!editedStudy) return
    const newCriterion = {
      id: `EXC_${editedStudy.exclusionCriteria.length + 1}`,
      text: '',
      category: 'DEMOGRAPHICS'
    }
    setEditedStudy({
      ...editedStudy,
      exclusionCriteria: [...editedStudy.exclusionCriteria, newCriterion]
    })
  }

  const updateExclusionCriterion = (index: number, updates: any) => {
    if (!editedStudy) return
    const updatedCriteria = [...editedStudy.exclusionCriteria]
    updatedCriteria[index] = { ...updatedCriteria[index], ...updates }
    setEditedStudy({ ...editedStudy, exclusionCriteria: updatedCriteria })
  }

  const removeExclusionCriterion = (index: number) => {
    if (!editedStudy) return
    const updatedCriteria = editedStudy.exclusionCriteria.filter((_, i) => i !== index)
    setEditedStudy({ ...editedStudy, exclusionCriteria: updatedCriteria })
  }

  // Timeline functions
  const addEpoch = () => {
    if (!editedStudy) return
    const newEpoch = {
      code: `EPOCH_${editedStudy.epochs.length + 1}`,
      name: '',
      description: '',
      order: editedStudy.epochs.length + 1,
      duration: {
        value: 0,
        unit: 'DAYS'
      },
      isTreatment: false
    }
    setEditedStudy({
      ...editedStudy,
      epochs: [...editedStudy.epochs, newEpoch]
    })
  }

  const updateEpoch = (index: number, updates: any) => {
    if (!editedStudy) return
    const updatedEpochs = [...editedStudy.epochs]
    updatedEpochs[index] = { ...updatedEpochs[index], ...updates }
    setEditedStudy({ ...editedStudy, epochs: updatedEpochs })
  }

  const removeEpoch = (index: number) => {
    if (!editedStudy) return
    const updatedEpochs = editedStudy.epochs.filter((_, i) => i !== index)
    setEditedStudy({ ...editedStudy, epochs: updatedEpochs })
  }

  const addVisit = () => {
    if (!editedStudy) return
    const newVisit = {
      number: editedStudy.visits.length + 1,
      code: `VISIT_${editedStudy.visits.length + 1}`,
      name: '',
      epoch: 'SCREENING',
      nominalDay: 0,
      window: {
        before: 0,
        after: 0,
        unit: 'DAYS'
      },
      type: 'SCREENING',
      required: true,
      procedures: []
    }
    setEditedStudy({
      ...editedStudy,
      visits: [...editedStudy.visits, newVisit]
    })
  }

  const updateVisit = (index: number, updates: any) => {
    if (!editedStudy) return
    const updatedVisits = [...editedStudy.visits]
    updatedVisits[index] = { ...updatedVisits[index], ...updates }
    setEditedStudy({ ...editedStudy, visits: updatedVisits })
  }

  const removeVisit = (index: number) => {
    if (!editedStudy) return
    const updatedVisits = editedStudy.visits.filter((_, i) => i !== index)
    setEditedStudy({ ...editedStudy, visits: updatedVisits })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study details...</p>
        </div>
      </div>
    )
  }

  if (error || !study) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading study: {error}</p>
          <Button onClick={() => setCurrentView("studies")} className="bg-red-600 hover:bg-red-700 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Studies
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header with Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          {/* Back button and study info */}
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
              <h1 className="text-lg font-semibold text-gray-900">{study.studyId}</h1>
              <p className="text-sm text-gray-600">{study.studyName}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            {editMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="border-gray-300 bg-transparent"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(true)}
                  className="border-gray-300 bg-transparent"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-300 bg-transparent"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/studies/${study?.studyId || selectedStudy}/export`)
                      if (response.ok) {
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `study-${study.studyId}-${new Date().toISOString().split('T')[0]}.json`
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        document.body.removeChild(a)
                      } else {
                        const errorData = await response.json()
                        alert(`Failed to export study: ${errorData.error || 'Unknown error'}`)
                      }
                    } catch (error) {
                      alert(`Error exporting study: ${error instanceof Error ? error.message : 'Unknown error'}`)
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error display */}
      {saveError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{saveError}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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
            <TabsTrigger
              value="ai"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <Brain className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="overview">
            <OverviewTab 
              editMode={editMode} 
              studyData={editMode ? editedStudy! : study} 
              onUpdateStudyData={editMode ? updateEditedStudy : undefined}
            />
          </TabsContent>
          <TabsContent value="design">
            <DesignTab 
              editMode={editMode} 
              studyData={editMode ? editedStudy! : study}
              onUpdateStudyData={editMode ? updateEditedStudy : undefined}
              onAddInclusionCriterion={editMode ? addInclusionCriterion : undefined}
              onUpdateInclusionCriterion={editMode ? updateInclusionCriterion : undefined}
              onRemoveInclusionCriterion={editMode ? removeInclusionCriterion : undefined}
              onAddExclusionCriterion={editMode ? addExclusionCriterion : undefined}
              onUpdateExclusionCriterion={editMode ? updateExclusionCriterion : undefined}
              onRemoveExclusionCriterion={editMode ? removeExclusionCriterion : undefined}
            />
          </TabsContent>
          <TabsContent value="timeline">
            <TimelineTab 
              editMode={editMode} 
              studyData={editMode ? editedStudy! : study}
              onUpdateStudyData={editMode ? updateEditedStudy : undefined}
              onAddEpoch={editMode ? addEpoch : undefined}
              onUpdateEpoch={editMode ? updateEpoch : undefined}
              onRemoveEpoch={editMode ? removeEpoch : undefined}
              onAddVisit={editMode ? addVisit : undefined}
              onUpdateVisit={editMode ? updateVisit : undefined}
              onRemoveVisit={editMode ? removeVisit : undefined}
            />
          </TabsContent>
          <TabsContent value="arms">
            <ArmsTab 
              editMode={editMode} 
              studyData={editMode ? editedStudy! : study}
              onUpdateStudyData={editMode ? updateEditedStudy : undefined}
              onAddTreatmentArm={editMode ? addTreatmentArm : undefined}
              onUpdateTreatmentArm={editMode ? updateTreatmentArm : undefined}
              onRemoveTreatmentArm={editMode ? removeTreatmentArm : undefined}
              onAddIntervention={editMode ? addIntervention : undefined}
              onUpdateIntervention={editMode ? updateIntervention : undefined}
              onRemoveIntervention={editMode ? removeIntervention : undefined}
            />
          </TabsContent>
          <TabsContent value="objectives">
            <ObjectivesTab 
              editMode={editMode} 
              studyData={editMode ? editedStudy! : study}
              onUpdateStudyData={editMode ? updateEditedStudy : undefined}
              onAddObjective={editMode ? addObjective : undefined}
              onUpdateObjective={editMode ? updateObjective : undefined}
              onRemoveObjective={editMode ? removeObjective : undefined}
              onAddEndpoint={editMode ? addEndpoint : undefined}
              onUpdateEndpoint={editMode ? updateEndpoint : undefined}
              onRemoveEndpoint={editMode ? removeEndpoint : undefined}
            />
          </TabsContent>
          <TabsContent value="assessments">
            <AssessmentsTab editMode={editMode} studyData={editMode ? editedStudy! : study} />
          </TabsContent>
          <TabsContent value="audit">
            <AuditTab editMode={editMode} studyData={editMode ? editedStudy! : study} />
          </TabsContent>
          <TabsContent value="ai">
            <AiInsightsTab editMode={editMode} studyData={editMode ? editedStudy! : study} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
