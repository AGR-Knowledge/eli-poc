"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Upload, FileUp, Loader2, FileText, FileSpreadsheet, FileCode } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
  acceptedFileTypes?: string[]
}

export function FileUpload({ 
  onFileUpload, 
  isProcessing, 
  acceptedFileTypes = ["pdf", "docx", "xlsx", "csv", "md", "txt", "json"] 
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0])
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
      "text/markdown": [".md"],
      "text/plain": [".txt"],
      "application/json": [".json"],
    },
    multiple: false,
    disabled: isProcessing,
  })

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
        isDragActive
          ? "border-red-400 bg-red-50/50 shadow-lg"
          : isProcessing
            ? "border-gray-300 bg-gray-50/50"
            : "border-gray-300 hover:border-red-400 hover:bg-red-50/30 hover:shadow-md"
      } ${isProcessing ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-6">
        {isProcessing ? (
          <div className="relative">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
            <div className="absolute inset-0 rounded-full bg-red-100 animate-pulse opacity-30"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="p-4 bg-gray-100 rounded-full">
              <FileUp className="h-8 w-8 text-gray-600" />
            </div>
            {isDragActive && <Sparkles className="h-5 w-5 text-red-500 absolute -top-1 -right-1 animate-bounce" />}
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isProcessing
              ? "Processing Document"
              : isDragActive
                ? "Drop Document Here"
                : "Upload Document"}
          </h3>
          <p className="text-gray-600">
            {isProcessing
              ? "AI is analyzing your document and extracting study data"
              : `Drag and drop your file or click to browse (${acceptedFileTypes.join(', ').toUpperCase()})`}
          </p>
        </div>
        {!isProcessing && (
          <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
            <Upload className="h-4 w-4 mr-2" />
            Select File
          </Button>
        )}
      </div>
    </div>
  )
}
