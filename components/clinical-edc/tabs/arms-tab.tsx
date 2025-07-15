import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Pill, Plus } from "lucide-react"
import { mockTreatmentArms } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

interface ArmsTabProps {
  editMode: boolean
}

export function ArmsTab({ editMode }: ArmsTabProps) {
  if (editMode) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Pill className="h-5 w-5 mr-2 text-red-600" />
            Treatment Arms
          </CardTitle>
          <CardDescription className="text-gray-600">Define treatment arms and interventions</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Label className="text-gray-900 font-medium">Treatment Arms</Label>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-1" />
              Add Arm
            </Button>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-900 font-medium">Arm Code</Label>
                    <Input
                      placeholder="e.g., ARM_A"
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 font-medium">Arm Name</Label>
                    <Input
                      placeholder="e.g., Tirzepatide"
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 font-medium">Description</Label>
                    <Textarea
                      placeholder="Describe the treatment arm"
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-900 font-medium">Arm Type</Label>
                    <Select>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select arm type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXPERIMENTAL">Experimental</SelectItem>
                        <SelectItem value="ACTIVE_COMPARATOR">Active Comparator</SelectItem>
                        <SelectItem value="PLACEBO_COMPARATOR">Placebo Comparator</SelectItem>
                        <SelectItem value="NO_INTERVENTION">No Intervention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-900 font-medium">Planned Subjects</Label>
                    <Input
                      type="number"
                      placeholder="453"
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Interventions */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-gray-900 font-medium">Interventions</Label>
                  <Button size="sm" variant="outline" className="border-gray-300 bg-transparent">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Intervention
                  </Button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 text-sm">Intervention Code</Label>
                      <Input
                        placeholder="e.g., TIRZE_15MG"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Intervention Name</Label>
                      <Input
                        placeholder="e.g., Tirzepatide 15mg"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Type</Label>
                      <Select>
                        <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRUG">Drug</SelectItem>
                          <SelectItem value="DEVICE">Device</SelectItem>
                          <SelectItem value="PROCEDURE">Procedure</SelectItem>
                          <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm">Route</Label>
                      <Select>
                        <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ORAL">Oral</SelectItem>
                          <SelectItem value="SUBCUTANEOUS">Subcutaneous</SelectItem>
                          <SelectItem value="INTRAVENOUS">Intravenous</SelectItem>
                          <SelectItem value="INTRAMUSCULAR">Intramuscular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Pill className="h-5 w-5 mr-2 text-red-600" />
          Treatment Arms
        </CardTitle>
        <CardDescription className="text-gray-600">Define treatment arms and interventions</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Label className="text-gray-700 text-sm font-medium">Treatment Arms</Label>
        <div className="space-y-6">
          {mockTreatmentArms.map((arm) => (
            <div key={arm.code} className="p-6 border border-gray-200 rounded-lg">
              <h4 className="text-gray-900 font-semibold">{arm.name}</h4>
              <p className="text-gray-600 text-sm mt-1">{arm.description}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label className="text-gray-700 text-sm">Arm Code</Label>
                  <p className="text-gray-900 text-sm">{arm.code}</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Arm Type</Label>
                  <p className="text-gray-900 text-sm">{arm.type}</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Planned Subjects</Label>
                  <p className="text-gray-900 text-sm">{arm.plannedSubjects}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
