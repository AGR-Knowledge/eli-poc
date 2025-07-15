import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Users, X, Plus, Trash2 } from "lucide-react"
import { mockDesignData } from "@/lib/mock-data"

interface DesignTabProps {
  editMode: boolean
}

export function DesignTab({ editMode }: DesignTabProps) {
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
                <Select>
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
                <Select>
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
                <Select>
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select blinding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN_LABEL">Open Label</SelectItem>
                    <SelectItem value="SINGLE_BLIND">Single Blind</SelectItem>
                    <SelectItem value="DOUBLE_BLIND">Double Blind</SelectItem>
                    <SelectItem value="TRIPLE_BLIND">Triple Blind</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Control Type</Label>
                <Select>
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select control" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLACEBO">Placebo</SelectItem>
                    <SelectItem value="ACTIVE_COMPARATOR">Active Comparator</SelectItem>
                    <SelectItem value="NO_INTERVENTION">No Intervention</SelectItem>
                    <SelectItem value="HISTORICAL_CONTROL">Historical Control</SelectItem>
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
                />
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Planned Sample Size</Label>
                <Input
                  type="number"
                  placeholder="e.g., 905"
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900 font-medium">Minimum Age</Label>
                  <Input
                    type="number"
                    placeholder="18"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Maximum Age</Label>
                  <Input
                    type="number"
                    placeholder="Leave blank for no limit"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Gender Eligibility</Label>
                <Select>
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
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter inclusion criterion"
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                      <Select>
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
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 ml-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
              <div className="flex justify-between items-center">
                <Label className="text-gray-900 font-medium">Criteria List</Label>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter exclusion criterion"
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                      <Select>
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
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 ml-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
              <p className="text-gray-900 font-semibold mt-1">{mockDesignData.design.type.replace("_", " ")}</p>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Allocation</Label>
              <p className="text-gray-900 font-semibold mt-1">{mockDesignData.design.allocation.replace("_", " ")}</p>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Blinding</Label>
              <p className="text-gray-900 font-semibold mt-1">
                {mockDesignData.design.blinding.type.replace("_", " ")}
              </p>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Control Type</Label>
              <p className="text-gray-900 font-semibold mt-1">{mockDesignData.design.control.type.replace("_", " ")}</p>
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
              <p className="text-gray-900 font-semibold mt-1">{mockDesignData.population.target}</p>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Planned Sample Size</Label>
              <p className="text-gray-900 font-semibold mt-1">{mockDesignData.population.plannedSize}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 text-sm">Minimum Age</Label>
                <p className="text-gray-900 text-sm">
                  {mockDesignData.population.ageRange.minimum} {mockDesignData.population.ageRange.unit}
                </p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Maximum Age</Label>
                <p className="text-gray-900 text-sm">
                  {mockDesignData.population.ageRange.maximum || "No Limit"} {mockDesignData.population.ageRange.unit}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Gender Eligibility</Label>
              <p className="text-gray-900 font-semibold mt-1">{mockDesignData.population.genderEligibility}</p>
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
              {mockDesignData.inclusionCriteria.map((criterion) => (
                <div key={criterion.id} className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-gray-900">{criterion.text}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Category: {criterion.category}, AI Confidence: {criterion.aiConfidence}
                  </p>
                </div>
              ))}
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
              {mockDesignData.exclusionCriteria.map((criterion) => (
                <div key={criterion.id} className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-gray-900">{criterion.text}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Category: {criterion.category}, AI Confidence: {criterion.aiConfidence}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
