import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FlaskConical, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockAssessmentsData } from "@/lib/mock-data"

interface AssessmentsTabProps {
  editMode: boolean
}

export function AssessmentsTab({ editMode }: AssessmentsTabProps) {
  if (editMode) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <FlaskConical className="h-5 w-5 mr-2 text-red-600" />
            Study Assessments
          </CardTitle>
          <CardDescription className="text-gray-600">
            Define procedures, forms, and assessments for the study
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Label className="text-gray-900 font-medium">Assessment Categories</Label>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-1" />
              Add Assessment
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Safety Assessments */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-red-50/50 border-b border-gray-200">
                <CardTitle className="text-base font-semibold text-gray-900">Safety Assessments</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span className="text-sm">Vital Signs</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span className="text-sm">Laboratory Tests</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span className="text-sm">Adverse Events</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full border-gray-300 bg-transparent">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Safety Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Efficacy Assessments */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-blue-50/50 border-b border-gray-200">
                <CardTitle className="text-base font-semibold text-gray-900">Efficacy Assessments</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span className="text-sm">HbA1c</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span className="text-sm">Body Weight</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span className="text-sm">CGM Data</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full border-gray-300 bg-transparent">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Efficacy Assessment
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Details Form */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-gray-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-900 font-medium">Assessment Name</Label>
                  <Input
                    placeholder="e.g., Vital Signs"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Category</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAFETY">Safety</SelectItem>
                      <SelectItem value="EFFICACY">Efficacy</SelectItem>
                      <SelectItem value="PHARMACOKINETIC">Pharmacokinetic</SelectItem>
                      <SelectItem value="BIOMARKER">Biomarker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Frequency</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONCE">Once</SelectItem>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="AS_NEEDED">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Description</Label>
                <Textarea
                  placeholder="Describe the assessment procedure"
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900 font-medium">Visit Schedule</Label>
                  <Input
                    placeholder="e.g., All visits"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Required</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Required</SelectItem>
                      <SelectItem value="false">Optional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <FlaskConical className="h-5 w-5 mr-2 text-red-600" />
          Study Assessments
        </CardTitle>
        <CardDescription className="text-gray-600">
          Define procedures, forms, and assessments for the study
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Assessments */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-red-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Safety Assessments</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockAssessmentsData.safetyAssessments.map((assessment) => (
                <div key={assessment.id} className="p-2 border border-gray-200 rounded">
                  <h5 className="text-sm font-medium text-gray-900">{assessment.name}</h5>
                  <p className="text-xs text-gray-600">{assessment.description}</p>
                  <p className="text-xs text-gray-500">Frequency: {assessment.frequency}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Efficacy Assessments */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-blue-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Efficacy Assessments</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockAssessmentsData.efficacyAssessments.map((assessment) => (
                <div key={assessment.id} className="p-2 border border-gray-200 rounded">
                  <h5 className="text-sm font-medium text-gray-900">{assessment.name}</h5>
                  <p className="text-xs text-gray-600">{assessment.description}</p>
                  <p className="text-xs text-gray-500">Frequency: {assessment.frequency}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Other Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-gray-200">
            <CardHeader className="bg-purple-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">PK Assessments</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockAssessmentsData.pkAssessments.map((assessment) => (
                <div key={assessment.id} className="p-2 border border-gray-200 rounded">
                  <h5 className="text-sm font-medium text-gray-900">{assessment.name}</h5>
                  <p className="text-xs text-gray-600">{assessment.description}</p>
                  <p className="text-xs text-gray-500">Frequency: {assessment.frequency}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardHeader className="bg-orange-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Biomarker Assessments</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mockAssessmentsData.biomarkerAssessments.map((assessment) => (
                <div key={assessment.id} className="p-2 border border-gray-200 rounded">
                  <h5 className="text-sm font-medium text-gray-900">{assessment.name}</h5>
                  <p className="text-xs text-gray-600">{assessment.description}</p>
                  <p className="text-xs text-gray-500">Frequency: {assessment.frequency}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
