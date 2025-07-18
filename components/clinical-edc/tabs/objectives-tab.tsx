import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Target, Plus, Trash2 } from "lucide-react"
import { mockObjectives } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

import { ComprehensiveStudy } from "@/hooks/useStudies"

interface ObjectivesTabProps {
  editMode: boolean
  studyData: ComprehensiveStudy
  onUpdateStudyData?: (updates: Partial<ComprehensiveStudy>) => void
  onAddObjective?: () => void
  onUpdateObjective?: (index: number, updates: any) => void
  onRemoveObjective?: (index: number) => void
  onAddEndpoint?: (objectiveIndex: number) => void
  onUpdateEndpoint?: (objectiveIndex: number, endpointIndex: number, updates: any) => void
  onRemoveEndpoint?: (objectiveIndex: number, endpointIndex: number) => void
}

export function ObjectivesTab({ 
  editMode, 
  studyData, 
  onAddObjective, 
  onUpdateObjective, 
  onRemoveObjective,
  onAddEndpoint,
  onUpdateEndpoint,
  onRemoveEndpoint
}: ObjectivesTabProps) {
  if (editMode) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2 text-red-600" />
            Study Objectives & Endpoints
          </CardTitle>
          <CardDescription className="text-gray-600">
            Define primary and secondary objectives with their endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Label className="text-gray-900 font-medium">Objectives</Label>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onAddObjective}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Objective
            </Button>
          </div>
          
          {studyData.objectives.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No objectives defined yet.</p>
              <p className="text-sm">Click "Add Objective" to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {studyData.objectives.map((objective, objectiveIndex) => (
                <div key={objective.number} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-gray-900 font-semibold">Objective {objective.number}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onRemoveObjective?.(objectiveIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-gray-900 font-medium">Objective Type</Label>
                      <Select 
                        value={objective.type}
                        onValueChange={(value) => onUpdateObjective?.(objectiveIndex, { type: value })}
                      >
                        <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRIMARY">Primary</SelectItem>
                          <SelectItem value="SECONDARY">Secondary</SelectItem>
                          <SelectItem value="EXPLORATORY">Exploratory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-900 font-medium">Objective Number</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                        value={objective.number}
                        onChange={(e) => onUpdateObjective?.(objectiveIndex, { number: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-gray-900 font-medium">Objective Description</Label>
                    <Textarea
                      placeholder="Describe the study objective"
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      rows={3}
                      value={objective.description}
                      onChange={(e) => onUpdateObjective?.(objectiveIndex, { description: e.target.value })}
                    />
                  </div>

                  {/* Endpoints */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-gray-900 font-medium">Endpoints</Label>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-gray-300 bg-transparent"
                        onClick={() => onAddEndpoint?.(objectiveIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Endpoint
                      </Button>
                    </div>
                    
                    {objective.endpoints.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                        <p className="text-sm">No endpoints defined for this objective.</p>
                        <p className="text-xs">Click "Add Endpoint" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {objective.endpoints.map((endpoint, endpointIndex) => (
                          <div key={endpointIndex} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="text-gray-900 font-medium">Endpoint {endpointIndex + 1}</h5>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => onRemoveEndpoint?.(objectiveIndex, endpointIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-gray-700 text-sm">Endpoint Type</Label>
                                <Select 
                                  value={endpoint.type}
                                  onValueChange={(value) => onUpdateEndpoint?.(objectiveIndex, endpointIndex, { type: value })}
                                >
                                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PRIMARY">Primary</SelectItem>
                                    <SelectItem value="SECONDARY">Secondary</SelectItem>
                                    <SelectItem value="SAFETY">Safety</SelectItem>
                                    <SelectItem value="EXPLORATORY">Exploratory</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-gray-700 text-sm">Parameter</Label>
                                <Input
                                  placeholder="e.g., HBA1C"
                                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                  value={endpoint.measurement.parameter}
                                  onChange={(e) => onUpdateEndpoint?.(objectiveIndex, endpointIndex, { 
                                    measurement: { ...endpoint.measurement, parameter: e.target.value }
                                  })}
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-gray-700 text-sm">Endpoint Title</Label>
                              <Input
                                placeholder="e.g., Change from baseline in HbA1c"
                                className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                value={endpoint.title}
                                onChange={(e) => onUpdateEndpoint?.(objectiveIndex, endpointIndex, { title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700 text-sm">Endpoint Description</Label>
                              <Textarea
                                placeholder="Detailed description of the endpoint"
                                className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                rows={2}
                                value={endpoint.description}
                                onChange={(e) => onUpdateEndpoint?.(objectiveIndex, endpointIndex, { description: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-gray-700 text-sm">Measurement Method</Label>
                                <Select 
                                  value={endpoint.measurement.method}
                                  onValueChange={(value) => onUpdateEndpoint?.(objectiveIndex, endpointIndex, { 
                                    measurement: { ...endpoint.measurement, method: value }
                                  })}
                                >
                                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                                    <SelectValue placeholder="Select method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="CENTRAL_LAB">Central Lab</SelectItem>
                                    <SelectItem value="LOCAL_LAB">Local Lab</SelectItem>
                                    <SelectItem value="CALIBRATED_SCALE">Calibrated Scale</SelectItem>
                                    <SelectItem value="QUESTIONNAIRE">Questionnaire</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-gray-700 text-sm">Units</Label>
                                <Input
                                  placeholder="e.g., PERCENT"
                                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                  value={endpoint.measurement.units}
                                  onChange={(e) => onUpdateEndpoint?.(objectiveIndex, endpointIndex, { 
                                    measurement: { ...endpoint.measurement, units: e.target.value }
                                  })}
                                />
                              </div>
                              <div>
                                <Label className="text-gray-700 text-sm">Timepoints</Label>
                                <Input
                                  placeholder="e.g., BASELINE, WEEK_40"
                                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                  value={endpoint.measurement.timepoints.join(', ')}
                                  onChange={(e) => onUpdateEndpoint?.(objectiveIndex, endpointIndex, { 
                                    measurement: { ...endpoint.measurement, timepoints: e.target.value.split(',').map(t => t.trim()) }
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
          <Target className="h-5 w-5 mr-2 text-red-600" />
          Study Objectives & Endpoints
        </CardTitle>
        <CardDescription className="text-gray-600">
          Define primary and secondary objectives with their endpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Label className="text-gray-700 text-sm font-medium">Objectives</Label>
        <div className="space-y-6">
          {studyData.objectives.length > 0 ? (
            studyData.objectives.map((objective) => (
              <div key={objective.number} className="p-6 border border-gray-200 rounded-lg">
                <h4 className="text-gray-900 font-semibold">
                  Objective {objective.number} ({objective.type})
                </h4>
                <p className="text-gray-600 text-sm mt-1">{objective.description}</p>
                <div className="mt-4">
                  <Label className="text-gray-700 text-sm">Endpoints</Label>
                  <div className="space-y-3">
                    {objective.endpoints.map((endpoint, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <h5 className="text-gray-900 font-medium">{endpoint.title}</h5>
                        <p className="text-gray-600 text-sm mt-1">{endpoint.description}</p>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
                          <div>
                            <Label className="text-gray-700 text-xs">Parameter</Label>
                            <p className="text-gray-900 text-sm">{endpoint.measurement.parameter}</p>
                          </div>
                          <div>
                            <Label className="text-gray-700 text-xs">Method</Label>
                            <p className="text-gray-900 text-sm">{endpoint.measurement.method}</p>
                          </div>
                          <div>
                            <Label className="text-gray-700 text-xs">Units</Label>
                            <p className="text-gray-900 text-sm">{endpoint.measurement.units}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No objectives defined.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
