import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, AlertCircle, TrendingUp, Activity } from "lucide-react"
import { mockAiInsightsData } from "@/lib/mock-data"

interface AiInsightsTabProps {
  editMode: boolean
}

export function AiInsightsTab({ editMode }: AiInsightsTabProps) {
  if (editMode) {
    return (
      <Card className="bg-gray-100 border border-gray-200 shadow-sm opacity-50">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">AI Insights</h3>
          <p className="text-gray-500">
            AI insights will be available after study creation and data collection begins.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-red-600" />
          AI Insights
        </CardTitle>
        <CardDescription className="text-gray-600">Leverage AI to gain insights from study data</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Protocol Deviation Prediction */}
        <Card className="border border-gray-200">
          <CardHeader className="bg-red-50/50 border-b border-gray-200">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-700" />
              Protocol Deviation Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <p className="text-sm text-gray-700">
              Status: <span className="font-medium">{mockAiInsightsData.protocolDeviationPrediction.status}</span>
            </p>
            <p className="text-sm text-gray-700">
              Risk Score:{" "}
              <span className="font-medium">{mockAiInsightsData.protocolDeviationPrediction.riskScore}</span>
            </p>
            <p className="text-sm text-gray-700 font-medium mt-2">Predicted Deviations:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {mockAiInsightsData.protocolDeviationPrediction.predictedDeviations.map((dev, i) => (
                <li key={i}>
                  {dev.type} ({dev.likelihood}): {dev.details}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-700 font-medium mt-2">Recommendations:</p>
            <p className="text-sm text-gray-600">{mockAiInsightsData.protocolDeviationPrediction.recommendations}</p>
          </CardContent>
        </Card>

        {/* Enrollment Forecast */}
        <Card className="border border-gray-200">
          <CardHeader className="bg-blue-50/50 border-b border-gray-200">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-700" />
              Enrollment Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <p className="text-sm text-gray-700">
              Status: <span className="font-medium">{mockAiInsightsData.enrollmentForecast.status}</span>
            </p>
            <p className="text-sm text-gray-700">
              Current Enrollment:{" "}
              <span className="font-medium">{mockAiInsightsData.enrollmentForecast.currentEnrollment}</span> /{" "}
              {mockAiInsightsData.enrollmentForecast.targetEnrollment}
            </p>
            <p className="text-sm text-gray-700">
              Projected Completion:{" "}
              <span className="font-medium">
                {mockAiInsightsData.enrollmentForecast.projectedCompletionDate} (
                {mockAiInsightsData.enrollmentForecast.onTrack ? "On Track" : "Delayed"})
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Variance: <span className="font-medium">{mockAiInsightsData.enrollmentForecast.variance}</span>
            </p>
            <p className="text-sm text-gray-700 font-medium mt-2">Key Factors:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {mockAiInsightsData.enrollmentForecast.factors.map((factor, i) => (
                <li key={i}>{factor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Data Quality Anomalies */}
        <Card className="border border-gray-200">
          <CardHeader className="bg-green-50/50 border-b border-gray-200">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-700" />
              Data Quality Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <p className="text-sm text-gray-700">
              Status: <span className="font-medium">{mockAiInsightsData.dataQualityAnomalies.status}</span>
            </p>
            <p className="text-sm text-gray-700">
              Anomalies Detected:{" "}
              <span className="font-medium">{mockAiInsightsData.dataQualityAnomalies.anomaliesDetected}</span> (
              {mockAiInsightsData.dataQualityAnomalies.criticalAnomalies} critical)
            </p>
            <p className="text-sm text-gray-700 font-medium mt-2">Details:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {mockAiInsightsData.dataQualityAnomalies.details.map((anomaly, i) => (
                <li key={i}>
                  {anomaly.type} - Field: {anomaly.field}, Subject: {anomaly.subject}, Visit: {anomaly.visit}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-700 font-medium mt-2">Recommendations:</p>
            <p className="text-sm text-gray-600">{mockAiInsightsData.dataQualityAnomalies.recommendations}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
