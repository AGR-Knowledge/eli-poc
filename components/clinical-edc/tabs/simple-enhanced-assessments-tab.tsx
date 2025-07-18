"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FlaskConical, 
  Plus, 
  Edit, 
  Settings, 
  Database, 
  Code,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"

interface SimpleEnhancedAssessmentsTabProps {
  editMode: boolean
  studyData: any
}

export function SimpleEnhancedAssessmentsTab({ editMode, studyData }: SimpleEnhancedAssessmentsTabProps) {
  const [selectedForm, setSelectedForm] = useState<string>("vitalSigns")
  const [showCDISCInfo, setShowCDISCInfo] = useState<boolean>(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data)
    setFormData(data)
  }

  if (editMode) {
    return (
      <div className="space-y-6">
        {/* Form Builder Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-red-600" />
              CDISC/CDASH Form Builder
            </CardTitle>
            <CardDescription>
              Create and configure CDISC/CDASH compliant forms with field dependencies, validation rules, and code lists
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Form Selection and Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Form Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <Button
                    variant={selectedForm === "vitalSigns" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedForm("vitalSigns")}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Vital Signs (VS)
                  </Button>
                  <Button
                    variant={selectedForm === "laboratory" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedForm("laboratory")}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Laboratory (LB)
                  </Button>
                </div>
                
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowCDISCInfo(!showCDISCInfo)}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    {showCDISCInfo ? "Hide" : "Show"} CDISC Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Builder Main Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedForm === "vitalSigns" ? "Vital Signs" : "Laboratory Tests"}
                      <Badge variant="secondary">
                        {selectedForm === "vitalSigns" ? "VS" : "LB"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {selectedForm === "vitalSigns" 
                        ? "Collection of vital signs measurements including blood pressure, heart rate, temperature, and respiratory rate"
                        : "Collection of laboratory test results including hematology, chemistry, and urinalysis"
                      }
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Simple Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="testType" className="text-sm font-medium">
                        Test Type
                        {showCDISCInfo && <Badge variant="outline" className="ml-2 text-xs">VSTEST</Badge>}
                      </Label>
                      <Select value={formData.testType} onValueChange={(value) => setFormData({...formData, testType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SYSBP">Systolic Blood Pressure</SelectItem>
                          <SelectItem value="DIABP">Diastolic Blood Pressure</SelectItem>
                          <SelectItem value="PULSE">Pulse Rate</SelectItem>
                          <SelectItem value="TEMP">Temperature</SelectItem>
                        </SelectContent>
                      </Select>
                      {showCDISCInfo && (
                        <p className="text-xs text-gray-500 mt-1">
                          CDASH Question: What vital signs test was performed?
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="result" className="text-sm font-medium">
                        Result
                        {showCDISCInfo && <Badge variant="outline" className="ml-2 text-xs">VSORRES</Badge>}
                      </Label>
                      <Input
                        id="result"
                        type="number"
                        placeholder="Enter result"
                        value={formData.result || ""}
                        onChange={(e) => setFormData({...formData, result: e.target.value})}
                      />
                      {showCDISCInfo && (
                        <p className="text-xs text-gray-500 mt-1">
                          CDASH Question: What is the result of the vital signs test?
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unit" className="text-sm font-medium">
                        Unit
                        {showCDISCInfo && <Badge variant="outline" className="ml-2 text-xs">VSORRESU</Badge>}
                      </Label>
                      <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mmHg">mmHg</SelectItem>
                          <SelectItem value="beats/min">beats/min</SelectItem>
                          <SelectItem value="°C">°C</SelectItem>
                          <SelectItem value="breaths/min">breaths/min</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="status" className="text-sm font-medium">
                        Status
                        {showCDISCInfo && <Badge variant="outline" className="ml-2 text-xs">VSSTAT</Badge>}
                      </Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="ABNORMAL">Abnormal</SelectItem>
                          <SelectItem value="NOT_DONE">Not Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {formData.status === "NOT_DONE" && (
                    <div>
                      <Label htmlFor="reason" className="text-sm font-medium">
                        Reason Not Done
                        {showCDISCInfo && <Badge variant="outline" className="ml-2 text-xs">VSREASND</Badge>}
                      </Label>
                      <Textarea
                        id="reason"
                        placeholder="Please specify the reason"
                        value={formData.reason || ""}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleFormSubmit(formData)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Submit Form
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Form Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Form Type</Label>
                <Select defaultValue="eCRF">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRF">Paper CRF</SelectItem>
                    <SelectItem value="eCRF">Electronic CRF</SelectItem>
                    <SelectItem value="ePRO">ePRO</SelectItem>
                    <SelectItem value="LAB">Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Assessment Category</Label>
                <Select defaultValue="SAFETY">
                  <SelectTrigger>
                    <SelectValue />
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
                <Label>CDISC Standard Version</Label>
                <Select defaultValue="CDASH 2.1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDASH 2.1">CDASH 2.1</SelectItem>
                    <SelectItem value="CDASH 2.0">CDASH 2.0</SelectItem>
                    <SelectItem value="CDASH 1.1">CDASH 1.1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // View mode - display existing assessments
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <FlaskConical className="h-5 w-5 mr-2 text-red-600" />
          Study Assessments
        </CardTitle>
        <CardDescription className="text-gray-600">
          CDISC/CDASH compliant forms and assessments for the study
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This is the simplified CDISC/CDASH forms system. Switch to edit mode to see the full form builder.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-red-50/50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Vital Signs (VS)
                <Badge variant="secondary">CDISC</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span className="text-sm">Blood Pressure</span>
                  <Badge variant="outline" className="text-xs">VS001</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span className="text-sm">Heart Rate</span>
                  <Badge variant="outline" className="text-xs">VS002</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span className="text-sm">Temperature</span>
                  <Badge variant="outline" className="text-xs">VS003</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50/50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Laboratory (LB)
                <Badge variant="secondary">CDISC</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span className="text-sm">Hematology</span>
                  <Badge variant="outline" className="text-xs">LB001</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span className="text-sm">Chemistry</span>
                  <Badge variant="outline" className="text-xs">LB002</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span className="text-sm">Urinalysis</span>
                  <Badge variant="outline" className="text-xs">LB003</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
} 