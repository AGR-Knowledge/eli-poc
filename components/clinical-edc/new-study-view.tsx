"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Plus, Sparkles, Users } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create New Study</h1>
                <p className="text-xs text-gray-500">Setup clinical trial parameters</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={handleCreateUsingAI} className="bg-red-600 hover:bg-red-700 text-white">
                <Sparkles className="h-4 w-4 mr-2" />
                Use AI Assistant
              </Button>
              <Button variant="outline" onClick={() => setCurrentView("studies")} className="border-gray-300">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* AI Upload Section */}
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
            <OverviewTab editMode={true} />
          </TabsContent>
          <TabsContent value="design">
            <DesignTab editMode={true} />
          </TabsContent>
          <TabsContent value="timeline">
            <TimelineTab editMode={true} />
          </TabsContent>
          <TabsContent value="arms">
            <ArmsTab editMode={true} />
          </TabsContent>
          <TabsContent value="objectives">
            <ObjectivesTab editMode={true} />
          </TabsContent>
          <TabsContent value="assessments">
            <AssessmentsTab editMode={true} />
          </TabsContent>
          <TabsContent value="audit">
            <AuditTab editMode={true} />
          </TabsContent>
          <TabsContent value="ai">
            <AiInsightsTab editMode={true} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button variant="outline" className="border-gray-300 bg-transparent">
            Save Draft
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">Create Study</Button>
        </div>
      </main>
    </div>
  )
}
