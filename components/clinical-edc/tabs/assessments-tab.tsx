"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlaskConical } from "lucide-react"
import { mockAssessmentsData } from "@/lib/mock-data"
import { EnhancedAssessmentsTab } from "./enhanced-assessments-tab"

import { ComprehensiveStudy } from "@/hooks/useStudies"

interface AssessmentsTabProps {
  editMode: boolean
  studyData: ComprehensiveStudy
}

export function AssessmentsTab({ editMode, studyData }: AssessmentsTabProps) {
  // Use enhanced assessments tab for edit mode
  if (editMode) {
          return <EnhancedAssessmentsTab editMode={editMode} studyData={studyData} />
  }

  // View mode - display existing assessments
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <FlaskConical className="h-5 w-5 mr-2 text-red-600" />
          Study Assessments
        </CardTitle>
        <CardDescription className="text-gray-600">
          CDISC/CDASH compliant forms and assessments for the study
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Assessments */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-red-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Safety Assessments</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockAssessmentsData.safetyAssessments.map((assessment) => (
                <div key={assessment.id} className="p-2 border border-gray-200 rounded">
                  <h5 className="text-sm font-medium text-gray-900">{assessment.name}</h5>
                  <p className="text-xs text-gray-600">{assessment.description}</p>
                  <p className="text-xs text-gray-500">Frequency: {assessment.frequency}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Efficacy Assessments */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-blue-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Efficacy Assessments</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockAssessmentsData.efficacyAssessments.map((assessment) => (
                <div key={assessment.id} className="p-2 border border-gray-200 rounded">
                  <h5 className="text-sm font-medium text-gray-900">{assessment.name}</h5>
                  <p className="text-xs text-gray-600">{assessment.description}</p>
                  <p className="text-xs text-gray-500">Frequency: {assessment.frequency}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Other Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-gray-200">
            <CardHeader className="bg-purple-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">PK Assessments</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockAssessmentsData.pkAssessments.map((assessment) => (
                <div key={assessment.id} className="p-2 border border-gray-200 rounded">
                  <h5 className="text-sm font-medium text-gray-900">{assessment.name}</h5>
                  <p className="text-xs text-gray-600">{assessment.description}</p>
                  <p className="text-xs text-gray-500">Frequency: {assessment.frequency}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardHeader className="bg-orange-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Biomarker Assessments</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockAssessmentsData.biomarkerAssessments.map((assessment) => (
                <div key={assessment.id} className="p-2 border border-gray-200 rounded">
                  <h5 className="text-sm font-medium text-gray-900">{assessment.name}</h5>
                  <p className="text-xs text-gray-600">{assessment.description}</p>
                  <p className="text-xs text-gray-500">Frequency: {assessment.frequency}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
