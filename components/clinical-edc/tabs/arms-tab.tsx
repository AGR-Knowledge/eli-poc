import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Pill, Plus, Trash2 } from "lucide-react"
import { mockTreatmentArms } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

import { ComprehensiveStudy } from "@/hooks/useStudies"

interface ArmsTabProps {
  editMode: boolean
  studyData: ComprehensiveStudy
  onUpdateStudyData?: (updates: Partial<ComprehensiveStudy>) => void
  onAddTreatmentArm?: () => void
  onUpdateTreatmentArm?: (index: number, updates: any) => void
  onRemoveTreatmentArm?: (index: number) => void
  onAddIntervention?: (armIndex: number) => void
  onUpdateIntervention?: (armIndex: number, interventionIndex: number, updates: any) => void
  onRemoveIntervention?: (armIndex: number, interventionIndex: number) => void
}

export function ArmsTab({ 
  editMode, 
  studyData, 
  onAddTreatmentArm, 
  onUpdateTreatmentArm, 
  onRemoveTreatmentArm,
  onAddIntervention,
  onUpdateIntervention,
  onRemoveIntervention
}: ArmsTabProps) {
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
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onAddTreatmentArm}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Arm
            </Button>
          </div>
          
          {studyData.treatmentArms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No treatment arms defined yet.</p>
              <p className="text-sm">Click "Add Arm" to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {studyData.treatmentArms.map((arm, armIndex) => (
                <div key={arm.code} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-gray-900 font-semibold">Arm {armIndex + 1}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onRemoveTreatmentArm?.(armIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-900 font-medium">Arm Code</Label>
                        <Input
                          placeholder="e.g., ARM_A"
                          className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                          value={arm.code}
                          onChange={(e) => onUpdateTreatmentArm?.(armIndex, { code: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 font-medium">Arm Name</Label>
                        <Input
                          placeholder="e.g., Tirzepatide"
                          className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                          value={arm.name}
                          onChange={(e) => onUpdateTreatmentArm?.(armIndex, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 font-medium">Description</Label>
                        <Textarea
                          placeholder="Describe the treatment arm"
                          className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                          rows={3}
                          value={arm.description}
                          onChange={(e) => onUpdateTreatmentArm?.(armIndex, { description: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-900 font-medium">Arm Type</Label>
                        <Select 
                          value={arm.type} 
                          onValueChange={(value) => onUpdateTreatmentArm?.(armIndex, { type: value })}
                        >
                          <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                            <SelectValue placeholder="Select arm type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EXPERIMENTAL">Experimental</SelectItem>
                            <SelectItem value="ACTIVE_COMPARATOR">Active Comparator</SelectItem>
                            <SelectItem value="PLACEBO_COMPARATOR">Placebo Comparator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-900 font-medium">Planned Subjects</Label>
                        <Input
                          type="number"
                          placeholder="453"
                          className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                          value={arm.plannedSubjects}
                          onChange={(e) => onUpdateTreatmentArm?.(armIndex, { plannedSubjects: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interventions */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-gray-900 font-medium">Interventions</Label>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-gray-300 bg-transparent"
                        onClick={() => onAddIntervention?.(armIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Intervention
                      </Button>
                    </div>
                    
                    {arm.interventions.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                        <p className="text-sm">No interventions defined for this arm.</p>
                        <p className="text-xs">Click "Add Intervention" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {arm.interventions.map((intervention, interventionIndex) => (
                          <div key={intervention.code} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="text-gray-900 font-medium">Intervention {interventionIndex + 1}</h5>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => onRemoveIntervention?.(armIndex, interventionIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-gray-700 text-sm">Intervention Code</Label>
                                <Input
                                  placeholder="e.g., TIRZE_15MG"
                                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                  value={intervention.code}
                                  onChange={(e) => onUpdateIntervention?.(armIndex, interventionIndex, { code: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label className="text-gray-700 text-sm">Intervention Name</Label>
                                <Input
                                  placeholder="e.g., Tirzepatide 15mg"
                                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                  value={intervention.name}
                                  onChange={(e) => onUpdateIntervention?.(armIndex, interventionIndex, { name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label className="text-gray-700 text-sm">Type</Label>
                                <Select 
                                  value={intervention.type}
                                  onValueChange={(value) => onUpdateIntervention?.(armIndex, interventionIndex, { type: value })}
                                >
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
                                <Select 
                                  value={intervention.dosing.route}
                                  onValueChange={(value) => onUpdateIntervention?.(armIndex, interventionIndex, { 
                                    dosing: { ...intervention.dosing, route: value }
                                  })}
                                >
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
                              <div>
                                <Label className="text-gray-700 text-sm">Form</Label>
                                <Input
                                  placeholder="e.g., TABLET"
                                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                  value={intervention.dosing.form}
                                  onChange={(e) => onUpdateIntervention?.(armIndex, interventionIndex, { 
                                    dosing: { ...intervention.dosing, form: e.target.value }
                                  })}
                                />
                              </div>
                              <div>
                                <Label className="text-gray-700 text-sm">Strength</Label>
                                <Input
                                  placeholder="e.g., 15MG"
                                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                  value={intervention.dosing.strength}
                                  onChange={(e) => onUpdateIntervention?.(armIndex, interventionIndex, { 
                                    dosing: { ...intervention.dosing, strength: e.target.value }
                                  })}
                                />
                              </div>
                              <div>
                                <Label className="text-gray-700 text-sm">Frequency</Label>
                                <Input
                                  placeholder="e.g., ONCE_DAILY"
                                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                  value={intervention.dosing.frequency}
                                  onChange={(e) => onUpdateIntervention?.(armIndex, interventionIndex, { 
                                    dosing: { ...intervention.dosing, frequency: e.target.value }
                                  })}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
          {studyData.treatmentArms.length > 0 ? (
            studyData.treatmentArms.map((arm) => (
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
                
                {arm.interventions.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-gray-700 text-sm font-medium">Interventions</Label>
                    <div className="space-y-2 mt-2">
                      {arm.interventions.map((intervention) => (
                        <div key={intervention.code} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="text-gray-900 font-medium">{intervention.name}</h5>
                          <p className="text-gray-600 text-sm">{intervention.code}</p>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <Label className="text-gray-700 text-xs">Type</Label>
                              <p className="text-gray-900 text-sm">{intervention.type}</p>
                            </div>
                            <div>
                              <Label className="text-gray-700 text-xs">Route</Label>
                              <p className="text-gray-900 text-sm">{intervention.dosing.route}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No treatment arms defined.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
