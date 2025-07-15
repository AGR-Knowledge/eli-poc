"use client"

import { useState } from "react"
import { StudiesListView } from "./components/clinical-edc/studies-list-view"
import { UploadView } from "./components/clinical-edc/upload-view"
import { NewStudyView } from "./components/clinical-edc/new-study-view"
import { StudyDetailsView } from "./components/clinical-edc/study-details-view"

export default function ClinicalTrialEDC() {
  const [currentView, setCurrentView] = useState<"studies" | "study" | "upload" | "new-study">("studies")
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<"PROCESSING" | "SUCCESS" | "FAILED" | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingMessage, setProcessingMessage] = useState("")
  const [isNewStudy, setIsNewStudy] = useState(false)

  // Simulate API call for document processing
  const simulateDocumentProcessing = async () => {
    setProcessingStatus("PROCESSING")
    setProcessingProgress(0)
    setProcessingMessage("Analyzing protocol document structure...")

    const progressSteps = [
      { progress: 20, message: "Extracting study information..." },
      { progress: 40, message: "Parsing inclusion/exclusion criteria..." },
      { progress: 60, message: "Identifying visit schedule..." },
      { progress: 80, message: "Processing endpoints and assessments..." },
      { progress: 100, message: "Finalizing study data..." },
    ]

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProcessingProgress(step.progress)
      setProcessingMessage(step.message)
    }

    const isSuccess = Math.random() > 0.1
    if (isSuccess) {
      setProcessingStatus("SUCCESS")
      setProcessingMessage("Protocol document successfully processed and study data populated.")
      setTimeout(() => {
        if (isNewStudy) {
          // For new study, after processing, go to study details in edit mode
          setCurrentView("study")
          // In a real app, you'd set the selectedStudy ID based on the processed data
          setSelectedStudy("NEW-STUDY-PROCESSED")
        } else {
          // If it was just an upload for an existing study, go back to studies list
          setCurrentView("studies")
        }
        setProcessingStatus(null)
      }, 2000)
    } else {
      setProcessingStatus("FAILED")
      setProcessingMessage("Failed to process protocol document. Please check the document format and try again.")
    }
  }

  const handleFileUpload = (file: File) => {
    console.log("Uploading file:", file.name)
    simulateDocumentProcessing()
  }

  const handleCreateNewStudy = () => {
    setIsNewStudy(true)
    setCurrentView("new-study")
  }

  const handleCreateUsingAI = () => {
    setIsNewStudy(true) // Indicate that this is for a new study creation flow
    setCurrentView("upload")
  }

  switch (currentView) {
    case "studies":
      return (
        <StudiesListView
          handleCreateNewStudy={handleCreateNewStudy}
          setSelectedStudy={setSelectedStudy}
          setCurrentView={setCurrentView}
        />
      )
    case "upload":
      return (
        <UploadView
          isNewStudy={isNewStudy}
          setCurrentView={setCurrentView}
          handleFileUpload={handleFileUpload}
          processingStatus={processingStatus}
          processingProgress={processingProgress}
          processingMessage={processingMessage}
        />
      )
    case "new-study":
      return (
        <NewStudyView
          setCurrentView={setCurrentView}
          handleCreateUsingAI={handleCreateUsingAI}
          handleFileUpload={handleFileUpload}
          processingStatus={processingStatus}
          processingProgress={processingProgress}
        />
      )
    case "study":
      return <StudyDetailsView selectedStudy={selectedStudy} setCurrentView={setCurrentView} />
    default:
      return (
        <StudiesListView
          handleCreateNewStudy={handleCreateNewStudy}
          setSelectedStudy={setSelectedStudy}
          setCurrentView={setCurrentView}
        />
      )
  }
}
