import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Activity, Building, FileText, Mail, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate, getStatusColor } from "@/lib/clinical-utils"
import { mockStudyData } from "@/lib/mock-data"

interface OverviewTabProps {
  editMode: boolean
}

export function OverviewTab({ editMode }: OverviewTabProps) {
  if (editMode) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Study Information */}
          <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-red-600" />
                Study Information
              </CardTitle>
              <CardDescription className="text-gray-600">Core study details and protocol information</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studyId" className="text-gray-900 font-medium">
                    Study ID *
                  </Label>
                  <Input
                    id="studyId"
                    placeholder="e.g., STUDY-2025-001"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="protocolNumber" className="text-gray-900 font-medium">
                    Protocol Number *
                  </Label>
                  <Input
                    id="protocolNumber"
                    placeholder="e.g., PROTO-001"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="studyTitle" className="text-gray-900 font-medium">
                  Study Title *
                </Label>
                <Textarea
                  id="studyTitle"
                  placeholder="Enter the full study title"
                  rows={3}
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phase" className="text-gray-900 font-medium">
                    Phase *
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHASE_1">Phase 1</SelectItem>
                      <SelectItem value="PHASE_2">Phase 2</SelectItem>
                      <SelectItem value="PHASE_3">Phase 3</SelectItem>
                      <SelectItem value="PHASE_4">Phase 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="indication" className="text-gray-900 font-medium">
                    Indication *
                  </Label>
                  <Input
                    id="indication"
                    placeholder="e.g., Type 1 Diabetes"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="therapeuticArea" className="text-gray-900 font-medium">
                    Therapeutic Area *
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIABETES">Diabetes</SelectItem>
                      <SelectItem value="ONCOLOGY">Oncology</SelectItem>
                      <SelectItem value="CARDIOLOGY">Cardiology</SelectItem>
                      <SelectItem value="NEUROLOGY">Neurology</SelectItem>
                      <SelectItem value="IMMUNOLOGY">Immunology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Timeline */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-red-600" />
                Status & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-gray-900 font-medium">Current Status</Label>
                <Select>
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNING">Planning</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="RECRUITING">Recruiting</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-700 text-sm">First Patient In</Label>
                  <Input type="date" className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500" />
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Last Patient In</Label>
                  <Input type="date" className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500" />
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Database Lock</Label>
                  <Input type="date" className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organization Information */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2 text-red-600" />
              Organization
            </CardTitle>
            <CardDescription className="text-gray-600">Sponsor, CRO, and investigator information</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Sponsor
                </h4>
                <div>
                  <Label className="text-gray-700">Company Name</Label>
                  <Input
                    placeholder="Enter sponsor name"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    type="email"
                    placeholder="sponsor@company.com"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Phone</Label>
                  <Input
                    placeholder="+1-555-0123"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  CRO
                </h4>
                <div>
                  <Label className="text-gray-700">Company Name</Label>
                  <Input
                    placeholder="Enter CRO name"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    type="email"
                    placeholder="operations@cro.com"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Phone</Label>
                  <Input
                    placeholder="+1-555-0456"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  Principal Investigator
                </h4>
                <div>
                  <Label className="text-gray-700">Name</Label>
                  <Input
                    placeholder="Dr. Principal Investigator"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Affiliation</Label>
                  <Input
                    placeholder="Medical Center"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    type="email"
                    placeholder="pi@medical.edu"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Information */}
        <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-red-600" />
              Study Information
            </CardTitle>
            <CardDescription className="text-gray-600">Core study details and protocol information</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 text-sm font-medium">Study ID</Label>
                <p className="text-gray-900 font-semibold mt-1">{mockStudyData.studyId}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Protocol Number</Label>
                <p className="text-gray-900 font-semibold mt-1">{mockStudyData.protocol.number}</p>
              </div>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">Study Title</Label>
              <p className="text-gray-900 font-semibold mt-1">{mockStudyData.protocol.title.full}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-700 text-sm font-medium">Phase</Label>
                <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200" variant="outline">
                  {mockStudyData.classification.phase.replace("_", " ")}
                </Badge>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Indication</Label>
                <p className="text-gray-900 mt-1">{mockStudyData.classification.indication}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Therapeutic Area</Label>
                <p className="text-gray-900 mt-1">{mockStudyData.classification.therapeuticArea}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Timeline */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-red-600" />
              Status & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-gray-700 text-sm font-medium">Current Status</Label>
              <Badge className={`mt-1 ${getStatusColor(mockStudyData.status.current)}`} variant="outline">
                {mockStudyData.status.current}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-3">
              <div>
                <Label className="text-gray-700 text-sm">First Patient In</Label>
                <p className="text-gray-900 text-sm mt-1">
                  {formatDate(mockStudyData.status.milestones.firstPatientIn)}
                </p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Last Patient In</Label>
                <p className="text-gray-900 text-sm mt-1">
                  {formatDate(mockStudyData.status.milestones.lastPatientIn)}
                </p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Database Lock</Label>
                <p className="text-gray-900 text-sm mt-1">{formatDate(mockStudyData.status.milestones.databaseLock)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Information */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2 text-red-600" />
            Organization
          </CardTitle>
          <CardDescription className="text-gray-600">Sponsor, CRO, and investigator information</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Sponsor
              </h4>
              <div>
                <Label className="text-gray-700 text-sm">Company Name</Label>
                <p className="text-gray-900 font-medium mt-1">{mockStudyData.organization.sponsor.name}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Email</Label>
                <p className="text-gray-900 mt-1 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {mockStudyData.organization.sponsor.contact.email}
                </p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Phone</Label>
                <p className="text-gray-900 mt-1">{mockStudyData.organization.sponsor.contact.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-500" />
                CRO
              </h4>
              <div>
                <Label className="text-gray-700 text-sm">Company Name</Label>
                <p className="text-gray-900 font-medium mt-1">{mockStudyData.organization.cro.name}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Email</Label>
                <p className="text-gray-900 mt-1 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {mockStudyData.organization.cro.contact.email}
                </p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Phone</Label>
                <p className="text-gray-900 mt-1">{mockStudyData.organization.cro.contact.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-500" />
                Principal Investigator
              </h4>
              <div>
                <Label className="text-gray-700 text-sm">Name</Label>
                <p className="text-gray-900 font-medium mt-1">{mockStudyData.organization.investigators[0].name}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Affiliation</Label>
                <p className="text-gray-900 mt-1">{mockStudyData.organization.investigators[0].affiliation}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm">Email</Label>
                <p className="text-gray-900 mt-1 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {mockStudyData.organization.investigators[0].contact.email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
