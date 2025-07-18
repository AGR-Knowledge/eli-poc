"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  HardDrive, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Brain
} from "lucide-react"

interface UploadedFile {
  fileName: string
  originalName: string
  s3Uri: string
  fileSize: number
  contentType: string
  uploadDate: Date
  processingStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  extractedData?: any
  extractionConfidence?: number
  processingTime?: number
  errorMessage?: string
}

interface FileReferenceViewerProps {
  files: UploadedFile[]
  onDownloadFile: (fileName: string) => void
  onViewExtractedData: (file: UploadedFile) => void
}

export function FileReferenceViewer({ 
  files, 
  onDownloadFile, 
  onViewExtractedData 
}: FileReferenceViewerProps) {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeIcon = (contentType: string) => {
    if (contentType.includes('pdf')) return <FileText className="h-5 w-5" />
    if (contentType.includes('spreadsheet') || contentType.includes('csv')) return <FileText className="h-5 w-5" />
    if (contentType.includes('json')) return <FileText className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'FAILED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold">Uploaded Documents</h3>
        </div>
        <Badge variant="outline" className="text-sm">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-4">
        {files.map((file, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileTypeIcon(file.contentType)}
                  <div>
                    <CardTitle className="text-base">{file.originalName}</CardTitle>
                    <CardDescription className="text-sm">
                      Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(file.processingStatus)}>
                    {getStatusIcon(file.processingStatus)}
                    <span className="ml-1">{file.processingStatus}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-gray-500" />
                  <span>{formatFileSize(file.fileSize)}</span>
                </div>
                
                {file.extractionConfidence !== undefined && (
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-gray-500" />
                    <span>{Math.round(file.extractionConfidence * 100)}% confidence</span>
                  </div>
                )}
                
                {file.processingTime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{file.processingTime}ms</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(file.uploadDate).toLocaleTimeString()}</span>
                </div>
              </div>

              {file.extractionConfidence !== undefined && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Extraction Confidence</span>
                    <span>{Math.round(file.extractionConfidence * 100)}%</span>
                  </div>
                  <Progress value={file.extractionConfidence * 100} className="h-2" />
                </div>
              )}

              {file.errorMessage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{file.errorMessage}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadFile(file.fileName)}
                  className="flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                
                {file.processingStatus === 'COMPLETED' && file.extractedData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewExtractedData(file)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Data</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {files.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              No documents uploaded yet.<br />
              Upload a protocol document to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 