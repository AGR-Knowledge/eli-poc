"use client"

import { useState } from "react"
import { StudiesListView } from "./components/clinical-edc/studies-list-view"
import { UploadView } from "./components/clinical-edc/upload-view"
import { NewStudyView } from "./components/clinical-edc/new-study-view"
import { StudyDetailsView } from "./components/clinical-edc/study-details-view"
import { toast } from "sonner"

export default function ClinicalTrialEDC() {
  const [currentView, setCurrentView] = useState<"studies" | "study" | "upload" | "new-study">("studies")
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<"PROCESSING" | "SUCCESS" | "FAILED" | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingMessage, setProcessingMessage] = useState("")
  const [isNewStudy, setIsNewStudy] = useState(false)

  // Real API call for document processing
  const processDocumentUpload = async (file: File) => {
    setProcessingStatus("PROCESSING")
    setProcessingProgress(0)
    setProcessingMessage("Uploading file to S3...")

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      if (selectedStudy) {
        formData.append('studyId', selectedStudy)
      }

      // Update progress
      setProcessingProgress(20)
      setProcessingMessage("Processing file content...")

      // Upload and process file
      const response = await fetch('/api/studies/upload', {
        method: 'POST',
        body: formData,
      })

      setProcessingProgress(80)
      setProcessingMessage("Extracting study data with AI...")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      
      setProcessingProgress(100)
      setProcessingMessage("Document processed successfully!")

      if (result.success) {
        setProcessingStatus("SUCCESS")
        toast.success("Document uploaded and processed successfully!")
        
        setTimeout(() => {
          if (isNewStudy) {
            // For new study, after processing, go to study details in edit mode
            setCurrentView("study")
            setSelectedStudy(result.study.studyId)
          } else {
            // If it was just an upload for an existing study, go back to studies list
            setCurrentView("studies")
          }
          setProcessingStatus(null)
        }, 2000)
      } else {
        throw new Error(result.error || 'Processing failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setProcessingStatus("FAILED")
      setProcessingMessage(error instanceof Error ? error.message : 'Upload failed')
      toast.error("Failed to upload document. Please try again.")
    }
  }

  const handleFileUpload = (file: File) => {
    console.log("Uploading file:", file.name)
    processDocumentUpload(file)
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
          setEditMode={setEditMode}
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
      return <StudyDetailsView selectedStudy={selectedStudy} setCurrentView={setCurrentView} editMode={editMode} setEditMode={setEditMode} />
    default:
      return (
        <StudiesListView
          handleCreateNewStudy={handleCreateNewStudy}
          setSelectedStudy={setSelectedStudy}
          setCurrentView={setCurrentView}
          setEditMode={setEditMode}
        />
      )
  }
}
