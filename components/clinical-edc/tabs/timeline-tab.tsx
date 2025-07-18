import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Plus } from "lucide-react"
import { mockTimelineData } from "@/lib/mock-data"

import { ComprehensiveStudy } from "@/hooks/useStudies"

interface TimelineTabProps {
  editMode: boolean
  studyData: ComprehensiveStudy
  onUpdateStudyData?: (updates: Partial<ComprehensiveStudy>) => void
  onAddEpoch?: () => void
  onUpdateEpoch?: (index: number, updates: any) => void
  onRemoveEpoch?: (index: number) => void
  onAddVisit?: () => void
  onUpdateVisit?: (index: number, updates: any) => void
  onRemoveVisit?: (index: number) => void
}

export function TimelineTab({ 
  editMode, 
  studyData, 
  onUpdateStudyData,
  onAddEpoch,
  onUpdateEpoch,
  onRemoveEpoch,
  onAddVisit,
  onUpdateVisit,
  onRemoveVisit
}: TimelineTabProps) {
  if (editMode) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Epochs */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-red-600" />
                Study Epochs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-gray-900 font-medium">Epochs</Label>
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={onAddEpoch}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Epoch
                </Button>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 text-sm">Epoch Code</Label>
                      <Input
                        placeholder="e.g., SCREENING"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Name</Label>
                      <Input
                        placeholder="e.g., Screening Period"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-gray-700 text-sm">Description</Label>
                    <Textarea
                      placeholder="Describe this epoch"
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <Label className="text-gray-700 text-sm">Duration</Label>
                      <Input
                        type="number"
                        placeholder="35"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Unit</Label>
                      <Select>
                        <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAYS">Days</SelectItem>
                          <SelectItem value="WEEKS">Weeks</SelectItem>
                          <SelectItem value="MONTHS">Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Order</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit Schedule */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-red-600" />
                Visit Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-gray-900 font-medium">Visits</Label>
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={onAddVisit}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Visit
                </Button>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 text-sm">Visit Number</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Visit Code</Label>
                      <Input
                        placeholder="e.g., VISIT_1"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-gray-700 text-sm">Visit Name</Label>
                    <Input
                      placeholder="e.g., Screening Visit 1"
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label className="text-gray-700 text-sm">Epoch</Label>
                      <Select>
                        <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select epoch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SCREENING">Screening</SelectItem>
                          <SelectItem value="TREATMENT">Treatment</SelectItem>
                          <SelectItem value="FOLLOWUP">Follow-up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Nominal Day</Label>
                      <Input
                        type="number"
                        placeholder="-35"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Epochs */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-red-600" />
              Study Epochs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Label className="text-gray-700 text-sm font-medium">Epochs</Label>
            <div className="space-y-3">
              {mockTimelineData.epochs.map((epoch) => (
                <div key={epoch.code} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-gray-900 font-semibold">{epoch.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{epoch.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label className="text-gray-700 text-sm">Duration</Label>
                      <p className="text-gray-900 text-sm">
                        {epoch.duration.value} {epoch.duration.unit}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Order</Label>
                      <p className="text-gray-900 text-sm">{epoch.order}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visit Schedule */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-red-600" />
              Visit Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Label className="text-gray-700 text-sm font-medium">Visits</Label>
            <div className="space-y-3">
              {mockTimelineData.visits.map((visit) => (
                <div key={visit.code} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-gray-900 font-semibold">{visit.name}</h4>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label className="text-gray-700 text-sm">Epoch</Label>
                      <p className="text-gray-900 text-sm">{visit.epoch}</p>
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Nominal Day</Label>
                      <p className="text-gray-900 text-sm">{visit.nominalDay}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
