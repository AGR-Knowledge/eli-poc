import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface ProcessingStatusProps {
  status: "PROCESSING" | "SUCCESS" | "FAILED"
  progress: number
  message: string
}

export function ProcessingStatus({ status, progress, message }: ProcessingStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "PROCESSING":
        return (
          <div className="relative">
            <Loader2 className="h-6 w-6 text-red-500 animate-spin" />
            <div className="absolute inset-0 rounded-full bg-red-100 animate-pulse opacity-50"></div>
          </div>
        )
      case "SUCCESS":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "FAILED":
        return <AlertCircle className="h-6 w-6 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "PROCESSING":
        return "text-red-600"
      case "SUCCESS":
        return "text-green-600"
      case "FAILED":
        return "text-red-600"
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {getStatusIcon()}
          <div className="flex-1">
            <h3 className={`font-semibold ${getStatusColor()}`}>
              {status === "PROCESSING" && "Processing Protocol Document"}
              {status === "SUCCESS" && "Protocol Processing Complete"}
              {status === "FAILED" && "Protocol Processing Failed"}
            </h3>
            <p className="text-gray-600 mt-1">{message}</p>
            {status === "PROCESSING" && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium text-red-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
