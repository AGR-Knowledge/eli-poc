import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Activity, Building, FileText, Mail, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate, getStatusColor, formatDateForInput } from "@/lib/clinical-utils"
import { ComprehensiveStudy } from "@/hooks/useStudies"

interface OverviewTabProps {
  editMode: boolean
  studyData: ComprehensiveStudy
  onUpdateStudyData?: (updates: Partial<ComprehensiveStudy>) => void
}

export function OverviewTab({ editMode, studyData, onUpdateStudyData }: OverviewTabProps) {
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
                    value={studyData.studyId || ''}
                    onChange={(e) => onUpdateStudyData?.({ studyId: e.target.value })}
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
                    value={studyData.protocolNumber || ''}
                    onChange={(e) => onUpdateStudyData?.({ protocolNumber: e.target.value })}
                    placeholder="e.g., PROTO-001"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="studyName" className="text-gray-900 font-medium">
                  Study Name *
                </Label>
                <Input
                  id="studyName"
                  value={studyData.studyName || ''}
                  onChange={(e) => onUpdateStudyData?.({ studyName: e.target.value })}
                  placeholder="Enter study name"
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-900 font-medium">
                  Study Description *
                </Label>
                <Textarea
                  id="description"
                  value={studyData.studyDescription || ''}
                  onChange={(e) => onUpdateStudyData?.({ studyDescription: e.target.value })}
                  placeholder="Enter study description"
                  rows={4}
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phase" className="text-gray-900 font-medium">
                    Study Phase *
                  </Label>
                  <Select value={studyData.studyPhase || ''} onValueChange={(value) => onUpdateStudyData?.({ studyPhase: value as any })}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I">Phase I</SelectItem>
                      <SelectItem value="II">Phase II</SelectItem>
                      <SelectItem value="III">Phase III</SelectItem>
                      <SelectItem value="IV">Phase IV</SelectItem>
                      <SelectItem value="PILOT">Pilot</SelectItem>
                      <SelectItem value="FEASIBILITY">Feasibility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type" className="text-gray-900 font-medium">
                    Study Type *
                  </Label>
                  <Select value={studyData.studyType || ''} onValueChange={(value) => onUpdateStudyData?.({ studyType: value as any })}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INTERVENTIONAL">Interventional</SelectItem>
                      <SelectItem value="OBSERVATIONAL">Observational</SelectItem>
                      <SelectItem value="EXPANDED_ACCESS">Expanded Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="therapeuticArea" className="text-gray-900 font-medium">
                    Therapeutic Area *
                  </Label>
                  <Input
                    id="therapeuticArea"
                    value={studyData.therapeuticArea || ''}
                    onChange={(e) => onUpdateStudyData?.({ therapeuticArea: e.target.value })}
                    placeholder="e.g., Endocrinology"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="indication" className="text-gray-900 font-medium">
                    Indication *
                  </Label>
                  <Input
                    id="indication"
                    value={studyData.indication || ''}
                    onChange={(e) => onUpdateStudyData?.({ indication: e.target.value })}
                    placeholder="e.g., Type 1 Diabetes"
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
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
                <Select value={studyData.studyStatus || ''} onValueChange={(value) => onUpdateStudyData?.({ studyStatus: value as any })}>
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
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
                  <Input
                    type="date"
                    defaultValue={formatDateForInput(studyData.milestones?.firstPatientIn)}
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Last Patient In</Label>
                  <Input
                    type="date"
                    defaultValue={formatDateForInput(studyData.milestones?.lastPatientIn)}
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Database Lock</Label>
                  <Input
                    type="date"
                    defaultValue={formatDateForInput(studyData.milestones?.databaseLock)}
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
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
              Organization Information
            </CardTitle>
            <CardDescription className="text-gray-600">Sponsor, CRO, and investigator details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sponsor */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Sponsor</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="sponsorName" className="text-gray-700 text-sm">Name</Label>
                    <Input
                      id="sponsorName"
                      value={studyData.sponsor?.name || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        sponsor: { ...studyData.sponsor, name: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsorEmail" className="text-gray-700 text-sm">Email</Label>
                    <Input
                      id="sponsorEmail"
                      type="email"
                      value={studyData.sponsor?.email || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        sponsor: { ...studyData.sponsor, email: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsorPhone" className="text-gray-700 text-sm">Phone</Label>
                    <Input
                      id="sponsorPhone"
                      value={studyData.sponsor?.phone || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        sponsor: { ...studyData.sponsor, phone: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* CRO */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">CRO</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="croName" className="text-gray-700 text-sm">Name</Label>
                    <Input
                      id="croName"
                      value={studyData.cro?.name || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        cro: { ...studyData.cro, name: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="croEmail" className="text-gray-700 text-sm">Email</Label>
                    <Input
                      id="croEmail"
                      type="email"
                      value={studyData.cro?.email || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        cro: { ...studyData.cro, email: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="croPhone" className="text-gray-700 text-sm">Phone</Label>
                    <Input
                      id="croPhone"
                      value={studyData.cro?.phone || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        cro: { ...studyData.cro, phone: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Principal Investigator */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Principal Investigator</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="piName" className="text-gray-700 text-sm">Name</Label>
                    <Input
                      id="piName"
                      value={studyData.principalInvestigator?.name || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        principalInvestigator: { ...studyData.principalInvestigator, name: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="piAffiliation" className="text-gray-700 text-sm">Affiliation</Label>
                    <Input
                      id="piAffiliation"
                      value={studyData.principalInvestigator?.affiliation || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        principalInvestigator: { ...studyData.principalInvestigator, affiliation: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="piEmail" className="text-gray-700 text-sm">Email</Label>
                    <Input
                      id="piEmail"
                      type="email"
                      value={studyData.principalInvestigator?.email || ''}
                      onChange={(e) => onUpdateStudyData?.({ 
                        principalInvestigator: { ...studyData.principalInvestigator, email: e.target.value }
                      })}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // View mode - display data from database
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
                <p className="text-gray-900 text-sm mt-1">{studyData.studyId}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Protocol Number</Label>
                <p className="text-gray-900 text-sm mt-1">{studyData.protocolNumber}</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 text-sm font-medium">Study Name</Label>
              <p className="text-gray-900 text-sm mt-1">{studyData.studyName}</p>
            </div>

            <div>
              <Label className="text-gray-700 text-sm font-medium">Study Description</Label>
              <p className="text-gray-900 text-sm mt-1">{studyData.studyDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 text-sm font-medium">Study Phase</Label>
                <p className="text-gray-900 text-sm mt-1">{studyData.studyPhase}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Study Type</Label>
                <p className="text-gray-900 text-sm mt-1">{studyData.studyType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 text-sm font-medium">Therapeutic Area</Label>
                <p className="text-gray-900 text-sm mt-1">{studyData.therapeuticArea}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Indication</Label>
                <p className="text-gray-900 text-sm mt-1">{studyData.indication}</p>
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
              <Badge className={`mt-1 ${getStatusColor(studyData.studyStatus)}`} variant="outline">
                {studyData.studyStatus}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-3">
                              <div>
                  <Label className="text-gray-700 text-sm">First Patient In</Label>
                  <p className="text-gray-900 text-sm mt-1">
                    {studyData.milestones?.firstPatientIn ? formatDate(studyData.milestones.firstPatientIn) : 'Not set'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Last Patient In</Label>
                  <p className="text-gray-900 text-sm mt-1">
                    {studyData.milestones?.lastPatientIn ? formatDate(studyData.milestones.lastPatientIn) : 'Not set'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Database Lock</Label>
                  <p className="text-gray-900 text-sm mt-1">
                    {studyData.milestones?.databaseLock ? formatDate(studyData.milestones.databaseLock) : 'Not set'}
                  </p>
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
            Organization Information
          </CardTitle>
          <CardDescription className="text-gray-600">Sponsor, CRO, and investigator details</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sponsor */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Sponsor</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-700 text-sm">Name</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.sponsor?.name || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Email</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.sponsor?.email || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Phone</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.sponsor?.phone || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* CRO */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">CRO</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-700 text-sm">Name</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.cro?.name || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Email</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.cro?.email || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Phone</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.cro?.phone || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Principal Investigator */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Principal Investigator</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-700 text-sm">Name</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.principalInvestigator?.name || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Affiliation</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.principalInvestigator?.affiliation || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-gray-700 text-sm">Email</Label>
                  <p className="text-gray-900 text-sm mt-1">{studyData.principalInvestigator?.email || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
