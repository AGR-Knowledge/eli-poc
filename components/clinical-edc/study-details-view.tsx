"use client"

import { useState } from "react"
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
} from "lucide-react"
import { OverviewTab } from "./tabs/overview-tab"
import { DesignTab } from "./tabs/design-tab"
import { TimelineTab } from "./tabs/timeline-tab"
import { ArmsTab } from "./tabs/arms-tab"
import { ObjectivesTab } from "./tabs/objectives-tab"
import { AssessmentsTab } from "./tabs/assessments-tab"
import { AuditTab } from "./tabs/audit-tab"
import { AiInsightsTab } from "./tabs/ai-insights-tab"
import { mockStudyData } from "@/lib/mock-data"

interface StudyDetailsViewProps {
  selectedStudy: string | null
  setCurrentView: (view: "studies" | "study" | "upload" | "new-study") => void
}

export function StudyDetailsView({ selectedStudy, setCurrentView }: StudyDetailsViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [editMode, setEditMode] = useState(false)

  const handleExportData = () => {
    // In a real application, this would trigger a backend process
    // to generate CDISC, SDTM, ADaM compliant files.
    // For this demo, we'll simulate a JSON download.
    const dataToExport = {
      studyDetails: mockStudyData,
      // In a real app, you'd fetch the actual data for the selected study
      // and include all relevant data points for CDISC conversion.
    }
    const filename = `${selectedStudy || "study-data"}-export.json`
    const jsonStr = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([jsonStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    alert(
      "Simulated data export initiated. For CDISC/SDTM/ADaM compliant exports, a robust backend data transformation pipeline is required.",
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Study Details</h1>
                <p className="text-xs text-gray-500">{selectedStudy || mockStudyData.studyId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleExportData} className="border-gray-300 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" onClick={() => setEditMode(!editMode)} className="border-gray-300">
                {editMode ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Study
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setCurrentView("studies")} className="border-gray-300">
                Back to Studies
              </Button>
            </div>
          </div>
        </div>
      </header>

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
            <OverviewTab editMode={editMode} />
          </TabsContent>
          <TabsContent value="design">
            <DesignTab editMode={editMode} />
          </TabsContent>
          <TabsContent value="timeline">
            <TimelineTab editMode={editMode} />
          </TabsContent>
          <TabsContent value="arms">
            <ArmsTab editMode={editMode} />
          </TabsContent>
          <TabsContent value="objectives">
            <ObjectivesTab editMode={editMode} />
          </TabsContent>
          <TabsContent value="assessments">
            <AssessmentsTab editMode={editMode} />
          </TabsContent>
          <TabsContent value="audit">
            <AuditTab editMode={editMode} />
          </TabsContent>
          <TabsContent value="ai">
            <AiInsightsTab editMode={editMode} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
