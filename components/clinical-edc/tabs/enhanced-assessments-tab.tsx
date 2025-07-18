"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  FlaskConical, 
  Plus, 
  Edit, 
  Settings, 
  Database, 
  FileText,
  Code,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff
} from "lucide-react"
import { SimpleDynamicFormBuilder } from "@/components/clinical-edc/simple-dynamic-form-builder"

// Mock CDISC/CDASH form specifications
const mockFormSpecifications: Record<string, any> = {
  vitalSigns: {
    formId: "VS001",
    formName: "Vital Signs",
    formCode: "VS",
    cdiscDomain: "VS",
    cdashCategory: "Vital Signs",
    description: "Collection of vital signs measurements including blood pressure, heart rate, temperature, and respiratory rate",
    instructions: "Measure and record all vital signs according to standard procedures. Ensure proper calibration of equipment.",
    fields: [
      {
        fieldId: "vsdtc",
        fieldName: "VSDTC",
        fieldLabel: "Date/Time of Vital Signs",
        fieldType: "DATETIME",
        cdiscVariable: "VSDTC",
        cdashQuestion: "What is the date and time of the vital signs assessment?",
        cdashQuestionNumber: "VS001",
        required: true,
        validationRules: [
          {
            ruleType: "REQUIRED",
            rule: "required",
            message: "Date and time is required",
            severity: "ERROR"
          }
        ],
        dependencies: [],
        rowOrder: 0,
        displayProperties: {
          width: "100%",
          placeholder: "YYYY-MM-DDTHH:MM:SS"
        }
      },
      {
        fieldId: "vstest",
        fieldName: "VSTEST",
        fieldLabel: "Vital Signs Test Name",
        fieldType: "SELECT",
        cdiscVariable: "VSTEST",
        cdashQuestion: "What vital signs test was performed?",
        cdashQuestionNumber: "VS002",
        required: true,
        validationRules: [
          {
            ruleType: "REQUIRED",
            rule: "required",
            message: "Test name is required",
            severity: "ERROR"
          }
        ],
        codeListValues: [
          { code: "SYSBP", label: "Systolic Blood Pressure", order: 1, active: true },
          { code: "DIABP", label: "Diastolic Blood Pressure", order: 2, active: true },
          { code: "PULSE", label: "Pulse Rate", order: 3, active: true },
          { code: "TEMP", label: "Temperature", order: 4, active: true },
          { code: "RESP", label: "Respiratory Rate", order: 5, active: true },
          { code: "HEIGHT", label: "Height", order: 6, active: true },
          { code: "WEIGHT", label: "Weight", order: 7, active: true },
          { code: "BMI", label: "Body Mass Index", order: 8, active: true }
        ],
        dependencies: [],
        rowOrder: 1,
        displayProperties: {
          width: "100%"
        }
      },
      {
        fieldId: "vsorres",
        fieldName: "VSORRES",
        fieldLabel: "Vital Signs Result",
        fieldType: "NUMBER",
        cdiscVariable: "VSORRES",
        cdashQuestion: "What is the result of the vital signs test?",
        cdashQuestionNumber: "VS003",
        required: true,
        validationRules: [
          {
            ruleType: "REQUIRED",
            rule: "required",
            message: "Result is required",
            severity: "ERROR"
          },
          {
            ruleType: "RANGE",
            rule: "0,300",
            message: "Result must be between 0 and 300",
            severity: "ERROR"
          }
        ],
        dependencies: [
          {
            dependentFieldId: "vstest",
            condition: "EQUALS",
            action: "REQUIRE",
            value: "SYSBP"
          }
        ],
        rowOrder: 2,
        displayProperties: {
          width: "100%",
          placeholder: "Enter result"
        }
      },
      {
        fieldId: "vsorresu",
        fieldName: "VSORRESU",
        fieldLabel: "Vital Signs Result Unit",
        fieldType: "SELECT",
        cdiscVariable: "VSORRESU",
        cdashQuestion: "What is the unit of the vital signs result?",
        cdashQuestionNumber: "VS004",
        required: true,
        validationRules: [
          {
            ruleType: "REQUIRED",
            rule: "required",
            message: "Unit is required",
            severity: "ERROR"
          }
        ],
        codeListValues: [
          { code: "mmHg", label: "mmHg", order: 1, active: true },
          { code: "beats/min", label: "beats/min", order: 2, active: true },
          { code: "°C", label: "°C", order: 3, active: true },
          { code: "breaths/min", label: "breaths/min", order: 4, active: true },
          { code: "cm", label: "cm", order: 5, active: true },
          { code: "kg", label: "kg", order: 6, active: true },
          { code: "kg/m²", label: "kg/m²", order: 7, active: true }
        ],
        dependencies: [
          {
            dependentFieldId: "vstest",
            condition: "EQUALS",
            action: "REQUIRE",
            value: "SYSBP"
          }
        ],
        rowOrder: 3,
        displayProperties: {
          width: "100%"
        }
      },
      {
        fieldId: "vsstat",
        fieldName: "VSSTAT",
        fieldLabel: "Vital Signs Status",
        fieldType: "SELECT",
        cdiscVariable: "VSSTAT",
        cdashQuestion: "What is the status of the vital signs assessment?",
        cdashQuestionNumber: "VS005",
        required: false,
        validationRules: [],
        codeListValues: [
          { code: "NOT DONE", label: "Not Done", order: 1, active: true },
          { code: "NOT EVALUABLE", label: "Not Evaluable", order: 2, active: true },
          { code: "NOT AVAILABLE", label: "Not Available", order: 3, active: true }
        ],
        dependencies: [
          {
            dependentFieldId: "vsorres",
            condition: "IS_EMPTY",
            action: "REQUIRE",
            value: ""
          }
        ],
        rowOrder: 4,
        displayProperties: {
          width: "100%"
        }
      },
      {
        fieldId: "vsreasnd",
        fieldName: "VSREASND",
        fieldLabel: "Reason Vital Signs Not Done",
        fieldType: "TEXTAREA",
        cdiscVariable: "VSREASND",
        cdashQuestion: "What is the reason the vital signs assessment was not done?",
        cdashQuestionNumber: "VS006",
        required: false,
        validationRules: [],
        dependencies: [
          {
            dependentFieldId: "vsstat",
            condition: "EQUALS",
            action: "REQUIRE",
            value: "NOT DONE"
          }
        ],
        rowOrder: 5,
        displayProperties: {
          width: "100%",
          placeholder: "Please specify the reason"
        }
      }
    ]
  },
  laboratory: {
    formId: "LB001",
    formName: "Laboratory Tests",
    formCode: "LB",
    cdiscDomain: "LB",
    cdashCategory: "Laboratory",
    description: "Collection of laboratory test results including hematology, chemistry, and urinalysis",
    instructions: "Record laboratory test results according to standard procedures. Ensure proper specimen collection and handling.",
    fields: [
      {
        fieldId: "lbdtc",
        fieldName: "LBDTC",
        fieldLabel: "Date/Time of Lab Test",
        fieldType: "DATETIME",
        cdiscVariable: "LBDTC",
        cdashQuestion: "What is the date and time of the laboratory test?",
        cdashQuestionNumber: "LB001",
        required: true,
        validationRules: [
          {
            ruleType: "REQUIRED",
            rule: "required",
            message: "Date and time is required",
            severity: "ERROR"
          }
        ],
        dependencies: [],
        rowOrder: 0,
        displayProperties: {
          width: "100%",
          placeholder: "YYYY-MM-DDTHH:MM:SS"
        }
      },
      {
        fieldId: "lbtest",
        fieldName: "LBTEST",
        fieldLabel: "Laboratory Test Name",
        fieldType: "SELECT",
        cdiscVariable: "LBTEST",
        cdashQuestion: "What laboratory test was performed?",
        cdashQuestionNumber: "LB002",
        required: true,
        validationRules: [
          {
            ruleType: "REQUIRED",
            rule: "required",
            message: "Test name is required",
            severity: "ERROR"
          }
        ],
        codeListValues: [
          { code: "GLUCOSE", label: "Glucose", order: 1, active: true },
          { code: "HBA1C", label: "HbA1c", order: 2, active: true },
          { code: "CHOLESTEROL", label: "Total Cholesterol", order: 3, active: true },
          { code: "HDL", label: "HDL Cholesterol", order: 4, active: true },
          { code: "LDL", label: "LDL Cholesterol", order: 5, active: true },
          { code: "TRIGLYCERIDES", label: "Triglycerides", order: 6, active: true },
          { code: "CREATININE", label: "Creatinine", order: 7, active: true },
          { code: "ALT", label: "Alanine Aminotransferase (ALT)", order: 8, active: true },
          { code: "AST", label: "Aspartate Aminotransferase (AST)", order: 9, active: true }
        ],
        dependencies: [],
        rowOrder: 1,
        displayProperties: {
          width: "100%"
        }
      },
      {
        fieldId: "lborres",
        fieldName: "LBORRES",
        fieldLabel: "Laboratory Result",
        fieldType: "NUMBER",
        cdiscVariable: "LBORRES",
        cdashQuestion: "What is the result of the laboratory test?",
        cdashQuestionNumber: "LB003",
        required: true,
        validationRules: [
          {
            ruleType: "REQUIRED",
            rule: "required",
            message: "Result is required",
            severity: "ERROR"
          }
        ],
        dependencies: [
          {
            dependentFieldId: "lbtest",
            condition: "IS_NOT_EMPTY",
            action: "REQUIRE",
            value: ""
          }
        ],
        rowOrder: 2,
        displayProperties: {
          width: "100%",
          placeholder: "Enter result"
        }
      },
      {
        fieldId: "lborresu",
        fieldName: "LBORRESU",
        fieldLabel: "Laboratory Result Unit",
        fieldType: "SELECT",
        cdiscVariable: "LBORRESU",
        cdashQuestion: "What is the unit of the laboratory result?",
        cdashQuestionNumber: "LB004",
        required: true,
        validationRules: [
          {
            ruleType: "REQUIRED",
            rule: "required",
            message: "Unit is required",
            severity: "ERROR"
          }
        ],
        codeListValues: [
          { code: "mg/dL", label: "mg/dL", order: 1, active: true },
          { code: "mmol/L", label: "mmol/L", order: 2, active: true },
          { code: "%", label: "%", order: 3, active: true },
          { code: "U/L", label: "U/L", order: 4, active: true },
          { code: "g/dL", label: "g/dL", order: 5, active: true }
        ],
        dependencies: [
          {
            dependentFieldId: "lborres",
            condition: "IS_NOT_EMPTY",
            action: "REQUIRE",
            value: ""
          }
        ],
        rowOrder: 3,
        displayProperties: {
          width: "100%"
        }
      },
      {
        fieldId: "lbnrind",
        fieldName: "LBNRIND",
        fieldLabel: "Reference Range Indicator",
        fieldType: "SELECT",
        cdiscVariable: "LBNRIND",
        cdashQuestion: "Is the result within normal reference range?",
        cdashQuestionNumber: "LB005",
        required: false,
        validationRules: [],
        codeListValues: [
          { code: "NORMAL", label: "Normal", order: 1, active: true },
          { code: "LOW", label: "Low", order: 2, active: true },
          { code: "HIGH", label: "High", order: 3, active: true },
          { code: "ABNORMAL", label: "Abnormal", order: 4, active: true }
        ],
        dependencies: [
          {
            dependentFieldId: "lborres",
            condition: "IS_NOT_EMPTY",
            action: "SHOW",
            value: ""
          }
        ],
        rowOrder: 4,
        displayProperties: {
          width: "100%"
        }
              }
      ]
  }
}

interface EnhancedAssessmentsTabProps {
  editMode: boolean
  studyData: any
}

export function EnhancedAssessmentsTab({ editMode, studyData }: EnhancedAssessmentsTabProps) {
  const [selectedForm, setSelectedForm] = useState<string>("vitalSigns")
  const [showCDISCInfo, setShowCDISCInfo] = useState<boolean>(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data)
    // Here you would typically save the data to your backend
    setFormData(data)
  }

  const handleValidationError = (errors: Record<string, string[]>) => {
    console.log("Validation errors:", errors)
    setValidationErrors(errors)
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
                
                <Separator />
                
                <div className="space-y-2">
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
                      {mockFormSpecifications[selectedForm as keyof typeof mockFormSpecifications]?.formName}
                      <Badge variant="secondary">
                        {mockFormSpecifications[selectedForm as keyof typeof mockFormSpecifications]?.cdiscDomain}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {mockFormSpecifications[selectedForm as keyof typeof mockFormSpecifications]?.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SimpleDynamicFormBuilder
                  formSpecification={mockFormSpecifications[selectedForm as keyof typeof mockFormSpecifications]}
                  onSubmit={handleFormSubmit}
                  onValidationError={handleValidationError}
                  showCDISCInfo={showCDISCInfo}
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <Tabs defaultValue="forms" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forms" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vital Signs Form */}
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
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">VS001</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <span className="text-sm">Heart Rate</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">VS002</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <span className="text-sm">Temperature</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">VS003</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Laboratory Form */}
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
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">LB001</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <span className="text-sm">Chemistry</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">LB002</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <span className="text-sm">Urinalysis</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">LB003</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                CDISC/CDASH specifications define the structure, validation rules, and code lists for each form.
                These ensure regulatory compliance and data quality standards.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Field Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Blood Pressure Unit depends on Blood Pressure Type</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Lab Result Unit depends on Lab Test Type</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Reason field shows when Status is "Not Done"</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Validation Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Blood Pressure: 70-300 mmHg range</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Glucose: Critical values &gt; 400 mg/dL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Required fields validation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Form validation ensures data quality and regulatory compliance through real-time checks and cross-field validation.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Data Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <p className="text-xs text-gray-600">Overall data quality score</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Validation Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <p className="text-xs text-gray-600">Open validation issues</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <p className="text-xs text-gray-600">CDISC compliance rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 