"use client"

import { EnhancedAssessmentsTab } from "@/components/clinical-edc/tabs/enhanced-assessments-tab"

export default function TestCDISCFormsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CDISC/CDASH Forms Test Page
          </h1>
          <p className="text-gray-600">
            This page demonstrates the enhanced CDISC/CDASH specification forms system with field dependencies, validation, and code lists.
          </p>
        </div>
        
        <EnhancedAssessmentsTab 
          editMode={true} 
          studyData={{
            studyId: "TEST-STUDY-001",
            studyName: "Test Study for CDISC Forms"
          }}
        />
      </div>
    </div>
  )
} 