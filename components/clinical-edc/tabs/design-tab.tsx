import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Users, X, Plus, Trash2 } from "lucide-react"
import { mockDesignData } from "@/lib/mock-data"

import { ComprehensiveStudy } from "@/hooks/useStudies"

interface DesignTabProps {
  editMode: boolean
  studyData: ComprehensiveStudy
  onUpdateStudyData?: (updates: Partial<ComprehensiveStudy>) => void
  onAddInclusionCriterion?: () => void
  onUpdateInclusionCriterion?: (index: number, updates: any) => void
  onRemoveInclusionCriterion?: (index: number) => void
  onAddExclusionCriterion?: () => void
  onUpdateExclusionCriterion?: (index: number, updates: any) => void
  onRemoveExclusionCriterion?: (index: number) => void
}

export function DesignTab({ 
  editMode, 
  studyData, 
  onUpdateStudyData,
  onAddInclusionCriterion,
  onUpdateInclusionCriterion,
  onRemoveInclusionCriterion,
  onAddExclusionCriterion,
  onUpdateExclusionCriterion,
  onRemoveExclusionCriterion
}: DesignTabProps) {
  if (editMode) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Design */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-red-600" />
                Study Design
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-gray-900 font-medium">Design Type</Label>
                <Select 
                  value={studyData.studyDesign?.type}
                  onValueChange={(value) => onUpdateStudyData?.({ 
                    studyDesign: { ...studyData.studyDesign, type: value as any }
                  })}
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select design type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PARALLEL_GROUP">Parallel Group</SelectItem>
                    <SelectItem value="CROSSOVER">Crossover</SelectItem>
                    <SelectItem value="FACTORIAL">Factorial</SelectItem>
                    <SelectItem value="SINGLE_GROUP">Single Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Allocation</Label>
                <Select 
                  value={studyData.studyDesign?.allocation}
                  onValueChange={(value) => onUpdateStudyData?.({ 
                    studyDesign: { ...studyData.studyDesign, allocation: value as any }
                  })}
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select allocation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RANDOMIZED">Randomized</SelectItem>
                    <SelectItem value="NON_RANDOMIZED">Non-Randomized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Blinding</Label>
                <Select 
                  value={studyData.studyDesign?.blinding?.type}
                  onValueChange={(value) => onUpdateStudyData?.({ 
                    studyDesign: { 
                      ...studyData.studyDesign, 
                      blinding: { ...studyData.studyDesign?.blinding, type: value as any }
                    }
                  })}
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select blinding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open Label</SelectItem>
                    <SelectItem value="SINGLE_BLIND">Single Blind</SelectItem>
                    <SelectItem value="DOUBLE_BLIND">Double Blind</SelectItem>
                    <SelectItem value="TRIPLE_BLIND">Triple Blind</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Control Type</Label>
                <Select 
                  value={studyData.studyDesign?.control?.type}
                  onValueChange={(value) => onUpdateStudyData?.({ 
                    studyDesign: { 
                      ...studyData.studyDesign, 
                      control: { ...studyData.studyDesign?.control, type: value as any }
                    }
                  })}
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select control" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLACEBO">Placebo</SelectItem>
                    <SelectItem value="ACTIVE">Active Comparator</SelectItem>
                    <SelectItem value="NO_TREATMENT">No Intervention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Population */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-red-600" />
                Target Population
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-gray-900 font-medium">Target Population</Label>
                <Textarea
                  placeholder="Describe the target population"
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  rows={3}
                  value={studyData.population?.target}
                  onChange={(e) => onUpdateStudyData?.({ 
                    population: { ...studyData.population, target: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Planned Sample Size</Label>
                <Input
                  type="number"
                  placeholder="e.g., 905"
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  value={studyData.population?.plannedSize}
                  onChange={(e) => onUpdateStudyData?.({ 
                    population: { ...studyData.population, plannedSize: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900 font-medium">Minimum Age</Label>
                  <Input
                    type="number"
                    placeholder="18"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    value={studyData.population?.ageRange?.minimum}
                    onChange={(e) => onUpdateStudyData?.({ 
                      population: { 
                        ...studyData.population, 
                        ageRange: { ...studyData.population?.ageRange, minimum: parseInt(e.target.value) || 0 }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Maximum Age</Label>
                  <Input
                    type="number"
                    placeholder="Leave blank for no limit"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    value={studyData.population?.ageRange?.maximum || ''}
                    onChange={(e) => onUpdateStudyData?.({ 
                      population: { 
                        ...studyData.population, 
                        ageRange: { ...studyData.population?.ageRange, maximum: e.target.value ? parseInt(e.target.value) : undefined }
                      }
                    })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Gender Eligibility</Label>
                <Select 
                  value={studyData.population?.genderEligibility}
                  onValueChange={(value) => onUpdateStudyData?.({ 
                    population: { ...studyData.population, genderEligibility: value }
                  })}
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select gender eligibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inclusion/Exclusion Criteria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Inclusion Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-gray-900 font-medium">Criteria List</Label>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={onAddInclusionCriterion}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {studyData.inclusionCriteria.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="text-sm">No inclusion criteria defined yet.</p>
                  <p className="text-xs">Click "Add" to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studyData.inclusionCriteria.map((criterion, index) => (
                    <div key={criterion.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="Enter inclusion criterion"
                            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            value={criterion.text}
                            onChange={(e) => onUpdateInclusionCriterion?.(index, { text: e.target.value })}
                          />
                          <Select 
                            value={criterion.category}
                            onValueChange={(value) => onUpdateInclusionCriterion?.(index, { category: value })}
                          >
                            <SelectTrigger className="mt-2 border-gray-300 focus:border-red-500 focus:ring-red-500">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DEMOGRAPHICS">Demographics</SelectItem>
                              <SelectItem value="MEDICAL_HISTORY">Medical History</SelectItem>
                              <SelectItem value="ANTHROPOMETRIC">Anthropometric</SelectItem>
                              <SelectItem value="LABORATORY">Laboratory</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 ml-2"
                          onClick={() => onRemoveInclusionCriterion?.(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <X className="h-5 w-5 mr-2 text-red-600" />
                Exclusion Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-gray-900 font-medium">Criteria List</Label>
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={onAddExclusionCriterion}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {studyData.exclusionCriteria.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="text-sm">No exclusion criteria defined yet.</p>
                  <p className="text-xs">Click "Add" to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studyData.exclusionCriteria.map((criterion, index) => (
                    <div key={criterion.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="Enter exclusion criterion"
                            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            value={criterion.text}
                            onChange={(e) => onUpdateExclusionCriterion?.(index, { text: e.target.value })}
                          />
                          <Select 
                            value={criterion.category}
                            onValueChange={(value) => onUpdateExclusionCriterion?.(index, { category: value })}
                          >
                            <SelectTrigger className="mt-2 border-gray-300 focus:border-red-500 focus:ring-red-500">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DEMOGRAPHICS">Demographics</SelectItem>
                              <SelectItem value="MEDICAL_HISTORY">Medical History</SelectItem>
                              <SelectItem value="ANTHROPOMETRIC">Anthropometric</SelectItem>
                              <SelectItem value="LABORATORY">Laboratory</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 ml-2"
                          onClick={() => onRemoveExclusionCriterion?.(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Design */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-red-600" />
              Study Design
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-gray-700 text-sm font-medium">Design Type</Label>
              <p className="text-gray-900 font-semibold mt-1">{studyData.studyDesign?.type?.replace("_", " ")}</p>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Allocation</Label>
              <p className="text-gray-900 font-semibold mt-1">{studyData.studyDesign?.allocation?.replace("_", " ")}</p>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Blinding</Label>
              <p className="text-gray-900 font-semibold mt-1">
                {studyData.studyDesign?.blinding?.type?.replace("_", " ")}
              </p>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Control Type</Label>
              <p className="text-gray-900 font-semibold mt-1">{studyData.studyDesign?.control?.type?.replace("_", " ")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Population */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-red-600" />
              Target Population
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-gray-700 text-sm font-medium">Target Population</Label>
              <p className="text-gray-900 font-semibold mt-1">{studyData.population?.target}</p>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Planned Sample Size</Label>
              <p className="text-gray-900 font-semibold mt-1">{studyData.population?.plannedSize}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 text-sm">Minimum Age</Label>
                <p className="text-gray-900 text-sm">
                  {studyData.population?.ageRange?.minimum} {studyData.population?.ageRange?.unit}
                </p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Maximum Age</Label>
                <p className="text-gray-900 text-sm">
                  {studyData.population?.ageRange?.maximum || "No Limit"} {studyData.population?.ageRange?.unit}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Gender Eligibility</Label>
              <p className="text-gray-900 font-semibold mt-1">{studyData.population?.genderEligibility}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inclusion/Exclusion Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Inclusion Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Label className="text-gray-700 text-sm font-medium">Criteria List</Label>
            <div className="space-y-3">
              {studyData.inclusionCriteria.length > 0 ? (
                studyData.inclusionCriteria.map((criterion) => (
                  <div key={criterion.id} className="p-3 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{criterion.text}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Category: {criterion.category}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No inclusion criteria defined.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <X className="h-5 w-5 mr-2 text-red-600" />
              Exclusion Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Label className="text-gray-700 text-sm font-medium">Criteria List</Label>
            <div className="space-y-3">
              {studyData.exclusionCriteria.length > 0 ? (
                studyData.exclusionCriteria.map((criterion) => (
                  <div key={criterion.id} className="p-3 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{criterion.text}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Category: {criterion.category}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No exclusion criteria defined.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
