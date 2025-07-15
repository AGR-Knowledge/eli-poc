import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Plus, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockAuditData } from "@/lib/mock-data"

interface AuditTabProps {
  editMode: boolean
}

export function AuditTab({ editMode }: AuditTabProps) {
  if (editMode) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-600" />
            Audit & Compliance Settings
          </CardTitle>
          <CardDescription className="text-gray-600">
            Configure audit trails, compliance requirements, and regulatory settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regulatory Compliance */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-blue-50/50 border-b border-gray-200">
                <CardTitle className="text-base font-semibold text-gray-900">Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-gray-900 font-medium">Regulatory Authority</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select authority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FDA">FDA</SelectItem>
                      <SelectItem value="EMA">EMA</SelectItem>
                      <SelectItem value="PMDA">PMDA</SelectItem>
                      <SelectItem value="MULTIPLE">Multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">GCP Compliance</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select GCP standard" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ICH_GCP">ICH GCP</SelectItem>
                      <SelectItem value="FDA_GCP">FDA GCP</SelectItem>
                      <SelectItem value="EMA_GCP">EMA GCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Data Integrity Level</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="ENHANCED">Enhanced</SelectItem>
                      <SelectItem value="MAXIMUM">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audit Trail Settings */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-green-50/50 border-b border-gray-200">
                <CardTitle className="text-base font-semibold text-gray-900">Audit Trail Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-gray-900 font-medium">Audit Level</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select audit level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="DETAILED">Detailed</SelectItem>
                      <SelectItem value="COMPREHENSIVE">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Retention Period</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select retention" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5_YEARS">5 Years</SelectItem>
                      <SelectItem value="10_YEARS">10 Years</SelectItem>
                      <SelectItem value="15_YEARS">15 Years</SelectItem>
                      <SelectItem value="PERMANENT">Permanent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Electronic Signature</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select e-signature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REQUIRED">Required</SelectItem>
                      <SelectItem value="OPTIONAL">Optional</SelectItem>
                      <SelectItem value="DISABLED">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Roles & Permissions */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-purple-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">User Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-gray-900 font-medium">Study Roles</Label>
                <Button size="sm" variant="outline" className="border-gray-300 bg-transparent">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Role
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="text-gray-700 text-sm">Role Name</Label>
                    <Input
                      placeholder="e.g., Principal Investigator"
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Permission Level</Label>
                    <Select>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="READ_ONLY">Read Only</SelectItem>
                        <SelectItem value="DATA_ENTRY">Data Entry</SelectItem>
                        <SelectItem value="REVIEW">Review</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Data Access</Label>
                    <Select>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OWN_SITE">Own Site Only</SelectItem>
                        <SelectItem value="ALL_SITES">All Sites</SelectItem>
                        <SelectItem value="SELECTED_SITES">Selected Sites</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-red-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Data Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900 font-medium">Encryption Level</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AES_128">AES-128</SelectItem>
                      <SelectItem value="AES_256">AES-256</SelectItem>
                      <SelectItem value="RSA_2048">RSA-2048</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900 font-medium">Backup Frequency</Label>
                  <Select>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REAL_TIME">Real-time</SelectItem>
                      <SelectItem value="HOURLY">Hourly</SelectItem>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Privacy Compliance</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="gdpr" className="rounded border-gray-300" />
                    <Label htmlFor="gdpr" className="text-sm text-gray-700">
                      GDPR Compliance
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="hipaa" className="rounded border-gray-300" />
                    <Label htmlFor="hipaa" className="text-sm text-gray-700">
                      HIPAA Compliance
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="iso27001" className="rounded border-gray-300" />
                    <Label htmlFor="iso27001" className="text-sm text-gray-700">
                      ISO 27001
                    </Label>
                  </div>
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
          <Shield className="h-5 w-5 mr-2 text-red-600" />
          Audit & Compliance Settings
        </CardTitle>
        <CardDescription className="text-gray-600">
          Configure audit trails, compliance requirements, and regulatory settings
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regulatory Compliance */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-blue-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-gray-700 text-sm font-medium">Regulatory Authority</Label>
                <p className="text-gray-900 font-semibold mt-1">{mockAuditData.regulatoryCompliance.authority}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">GCP Compliance</Label>
                <p className="text-gray-900 font-semibold mt-1">{mockAuditData.regulatoryCompliance.gcpStandard}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Data Integrity Level</Label>
                <p className="text-gray-900 font-semibold mt-1">
                  {mockAuditData.regulatoryCompliance.dataIntegrityLevel}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail Settings */}
          <Card className="border border-gray-200">
            <CardHeader className="bg-green-50/50 border-b border-gray-200">
              <CardTitle className="text-base font-semibold text-gray-900">Audit Trail Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-gray-700 text-sm font-medium">Audit Level</Label>
                <p className="text-gray-900 font-semibold mt-1">{mockAuditData.auditTrailSettings.auditLevel}</p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Retention Period</Label>
                <p className="text-gray-900 font-semibold mt-1">
                  {mockAuditData.auditTrailSettings.retentionPeriod.replace("_", " ")}
                </p>
              </div>
              <div>
                <Label className="text-gray-700 text-sm font-medium">Electronic Signature Required</Label>
                <p className="text-gray-900 font-semibold mt-1">
                  {mockAuditData.auditTrailSettings.electronicSignatureRequired ? "Yes" : "No"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Roles & Permissions */}
        <Card className="border border-gray-200">
          <CardHeader className="bg-purple-50/50 border-b border-gray-200">
            <CardTitle className="text-base font-semibold text-gray-900">User Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Label className="text-gray-700 text-sm font-medium">Study Roles</Label>
            <div className="space-y-3">
              {mockAuditData.userRoles.map((role) => (
                <div
                  key={role.roleName}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <Label className="text-gray-700 text-sm">Role Name</Label>
                    <p className="text-gray-900 text-sm font-medium">{role.roleName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Permission Level</Label>
                    <p className="text-gray-900 text-sm">{role.permissionLevel.replace("_", " ")}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Data Access</Label>
                    <p className="text-gray-900 text-sm">{role.dataAccess.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border border-gray-200">
          <CardHeader className="bg-red-50/50 border-b border-gray-200">
            <CardTitle className="text-base font-semibold text-gray-900">Data Security & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-900 font-medium">Encryption Level</Label>
                <p className="text-gray-900 font-semibold mt-1">{mockAuditData.dataSecurity.encryptionLevel}</p>
              </div>
              <div>
                <Label className="text-gray-900 font-medium">Backup Frequency</Label>
                <p className="text-gray-900 font-semibold mt-1">
                  {mockAuditData.dataSecurity.backupFrequency.replace("_", " ")}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-medium">Privacy Compliance</Label>
              <div className="mt-2 space-y-2">
                {mockAuditData.dataSecurity.privacyCompliance.map((compliance) => (
                  <div key={compliance} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{compliance} Compliance</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
