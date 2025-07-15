"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, X } from "lucide-react"
import { FileUpload } from "./file-upload"
import { ProcessingStatus } from "./processing-status"

interface UploadViewProps {
  isNewStudy: boolean
  setCurrentView: (view: "studies" | "study" | "upload" | "new-study") => void
  handleFileUpload: (file: File) => void
  processingStatus: "PROCESSING" | "SUCCESS" | "FAILED" | null
  processingProgress: number
  processingMessage: string
}

export function UploadView({
  isNewStudy,
  setCurrentView,
  handleFileUpload,
  processingStatus,
  processingProgress,
  processingMessage,
}: UploadViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Protocol Parser</h1>
                <p className="text-xs text-gray-500">Intelligent Document Processing</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentView(isNewStudy ? "new-study" : "studies")}
              className="border-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </header>

      {/* Upload Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Protocol Document</h2>
          <p className="text-gray-600">
            Our AI will automatically extract study information, endpoints, visit schedules, and more
          </p>
        </div>

        {processingStatus ? (
          <ProcessingStatus status={processingStatus} progress={processingProgress} message={processingMessage} />
        ) : (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <FileUpload onFileUpload={handleFileUpload} isProcessing={processingStatus === "PROCESSING"} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
