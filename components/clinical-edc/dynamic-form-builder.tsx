"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from "lucide-react"

// Types for form specification
interface FormField {
  fieldId: string
  fieldName: string
  fieldLabel: string
  fieldType: 'TEXT' | 'NUMBER' | 'DATE' | 'TIME' | 'DATETIME' | 'SELECT' | 'MULTISELECT' | 'RADIO' | 'CHECKBOX' | 'TEXTAREA' | 'FILE'
  dataType: string
  format?: string
  length?: number
  precision?: number
  cdiscVariable: string
  cdashQuestion: string
  cdashQuestionNumber?: string
  required: boolean
  validationRules: Array<{
    ruleType: 'REQUIRED' | 'RANGE' | 'PATTERN' | 'LENGTH' | 'DEPENDENCY' | 'CROSS_FIELD'
    rule: string
    message: string
    severity: 'ERROR' | 'WARNING' | 'INFO'
  }>
  codeListId?: string
  codeListValues?: Array<{
    code: string
    label: string
    description?: string
    order: number
    active: boolean
  }>
  dependencies: Array<{
    dependentFieldId: string
    condition: string
    action: 'SHOW' | 'HIDE' | 'REQUIRE' | 'OPTIONAL' | 'ENABLE' | 'DISABLE'
    value?: any
  }>
  groupId?: string
  groupOrder: number
  rowOrder: number
  columnOrder: number
  displayProperties: {
    width?: string
    height?: string
    cssClass?: string
    tooltip?: string
    helpText?: string
    placeholder?: string
  }
  defaultValue?: any
  calculatedValue?: string
}

interface FormSection {
  sectionId: string
  sectionName: string
  sectionOrder: number
  fields: string[]
  collapsible: boolean
  collapsed: boolean
}

interface FormSpecification {
  formId: string
  formName: string
  formCode: string
  cdiscDomain: string
  cdashCategory: string
  description: string
  instructions: string
  fields: FormField[]
  layout: {
    sections: FormSection[]
    gridLayout: {
      columns: number
      responsive: boolean
    }
  }
  formValidation: {
    crossFieldValidation: Array<{
      ruleId: string
      ruleName: string
      ruleExpression: string
      errorMessage: string
      severity: 'ERROR' | 'WARNING' | 'INFO'
      fields: string[]
    }>
  }
}

interface DynamicFormBuilderProps {
  formSpecification: FormSpecification
  initialData?: Record<string, any>
  onSubmit?: (data: Record<string, any>) => void
  onValidationError?: (errors: Record<string, string[]>) => void
  readOnly?: boolean
  showCDISCInfo?: boolean
}

interface FieldState {
  value: any
  visible: boolean
  enabled: boolean
  required: boolean
  errors: string[]
  warnings: string[]
  touched: boolean
}

export function DynamicFormBuilder({
  formSpecification,
  initialData = {},
  onSubmit,
  onValidationError,
  readOnly = false,
  showCDISCInfo = false
}: DynamicFormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // Initialize field states
  useEffect(() => {
    const initialFieldStates: Record<string, FieldState> = {}
    
    formSpecification.fields.forEach(field => {
      initialFieldStates[field.fieldId] = {
        value: initialData[field.fieldId] || field.defaultValue || '',
        visible: true,
        enabled: !readOnly,
        required: field.required,
        errors: [],
        warnings: [],
        touched: false
      }
    })
    
    setFieldStates(initialFieldStates)
  }, [formSpecification, initialData, readOnly])

  // Evaluate field dependencies
  const evaluateDependencies = useCallback((fieldId: string, currentData: Record<string, any>) => {
    const field = formSpecification.fields.find(f => f.fieldId === fieldId)
    if (!field) return { visible: true, enabled: !readOnly, required: false }

    let visible = true
    let enabled = !readOnly
    let required = field.required

    field.dependencies.forEach(dependency => {
      const dependentValue = currentData[dependency.dependentFieldId]
      const conditionMet = evaluateCondition(dependency.condition, dependentValue, dependency.value)

      switch (dependency.action) {
        case 'SHOW':
          visible = visible && conditionMet
          break
        case 'HIDE':
          visible = visible && !conditionMet
          break
        case 'REQUIRE':
          required = required || conditionMet
          break
        case 'OPTIONAL':
          required = required && !conditionMet
          break
        case 'ENABLE':
          enabled = enabled && conditionMet
          break
        case 'DISABLE':
          enabled = enabled && !conditionMet
          break
      }
    })

    return { visible, enabled, required }
  }, [readOnly])

  // Evaluate condition expression
  const evaluateCondition = (condition: string, actualValue: any, expectedValue: any): boolean => {
    if (condition === 'EQUALS') {
      return actualValue === expectedValue
    }
    if (condition === 'NOT_EQUALS') {
      return actualValue !== expectedValue
    }
    if (condition === 'CONTAINS') {
      return String(actualValue).includes(String(expectedValue))
    }
    if (condition === 'GREATER_THAN') {
      return Number(actualValue) > Number(expectedValue)
    }
    if (condition === 'LESS_THAN') {
      return Number(actualValue) < Number(expectedValue)
    }
    if (condition === 'IS_EMPTY') {
      return !actualValue || actualValue === ''
    }
    if (condition === 'IS_NOT_EMPTY') {
      return actualValue && actualValue !== ''
    }
    return false
  }



  // Validate field
  const validateField = useCallback((field: FormField, value: any): string[] => {
    const errors: string[] = []
    
    field.validationRules.forEach(rule => {
      let isValid = true
      
      switch (rule.ruleType) {
        case 'REQUIRED':
          isValid = value !== null && value !== undefined && value !== ''
          break
        case 'RANGE':
          const numValue = Number(value)
          if (!isNaN(numValue)) {
            const [min, max] = rule.rule.split(',').map(Number)
            isValid = numValue >= min && numValue <= max
          }
          break
        case 'PATTERN':
          const regex = new RegExp(rule.rule)
          isValid = regex.test(String(value))
          break
        case 'LENGTH':
          const length = String(value).length
          const [minLength, maxLength] = rule.rule.split(',').map(Number)
          isValid = length >= minLength && length <= maxLength
          break
      }
      
      if (!isValid) {
        errors.push(rule.message)
      }
    })
    
    return errors
  }, [])

  // Handle field change
  const handleFieldChange = (fieldId: string, value: any) => {
    const field = formSpecification.fields.find(f => f.fieldId === fieldId)
    if (!field) return

    // Validate field
    const errors = validateField(field, value)
    
    // Update form data
    const newFormData = { ...formData, [fieldId]: value }
    setFormData(newFormData)
    
    // Update field state
    setFieldStates(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        value,
        errors,
        touched: true
      }
    }))
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [fieldId]: errors
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const allErrors: Record<string, string[]> = {}
    let hasErrors = false
    
    formSpecification.fields.forEach(field => {
      const fieldState = fieldStates[field.fieldId]
      if (fieldState.visible && fieldState.required) {
        const errors = validateField(field, fieldState.value)
        if (errors.length > 0) {
          allErrors[field.fieldId] = errors
          hasErrors = true
        }
      }
    })
    
    if (hasErrors) {
      onValidationError?.(allErrors)
      setValidationErrors(allErrors)
      return
    }
    
    onSubmit?.(formData)
  }

  // Render field based on type
  const renderField = (field: FormField) => {
    const fieldState = fieldStates[field.fieldId]
    const { visible, enabled, required } = evaluateDependencies(field.fieldId, formData)
    
    if (!visible) return null

    const commonProps = {
      id: field.fieldId,
      name: field.fieldName,
      value: fieldState?.value || '',
      onChange: (value: any) => handleFieldChange(field.fieldId, value),
      disabled: !enabled || readOnly,
      className: field.displayProperties.cssClass,
      placeholder: field.displayProperties.placeholder,
      style: {
        width: field.displayProperties.width,
        height: field.displayProperties.height
      }
    }

    const errorMessages = validationErrors[field.fieldId] || []
    const hasError = errorMessages.length > 0

    return (
      <div key={field.fieldId} className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={field.fieldId} className="text-sm font-medium">
            {field.fieldLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {field.displayProperties.tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{field.displayProperties.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {showCDISCInfo && (
            <Badge variant="outline" className="text-xs">
              {field.cdiscVariable}
            </Badge>
          )}
        </div>

        {field.displayProperties.helpText && (
          <p className="text-xs text-gray-600">{field.displayProperties.helpText}</p>
        )}

        <div className="relative">
          {field.fieldType === 'TEXT' && (
            <Input
              {...commonProps}
              type="text"
              maxLength={field.length}
            />
          )}
          
          {field.fieldType === 'NUMBER' && (
            <Input
              {...commonProps}
              type="number"
              step={field.precision ? `0.${'0'.repeat(field.precision - 1)}1` : undefined}
            />
          )}
          
          {field.fieldType === 'DATE' && (
            <Input
              {...commonProps}
              type="date"
            />
          )}
          
          {field.fieldType === 'TIME' && (
            <Input
              {...commonProps}
              type="time"
            />
          )}
          
          {field.fieldType === 'DATETIME' && (
            <Input
              {...commonProps}
              type="datetime-local"
            />
          )}
          
          {field.fieldType === 'SELECT' && (
            <Select
              value={fieldState?.value || ''}
              onValueChange={(value) => handleFieldChange(field.fieldId, value)}
              disabled={!enabled || readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.codeListValues?.map(option => (
                  <SelectItem key={option.code} value={option.code}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {field.fieldType === 'RADIO' && (
            <RadioGroup
              value={fieldState?.value || ''}
              onValueChange={(value) => handleFieldChange(field.fieldId, value)}
              disabled={!enabled || readOnly}
            >
              {field.codeListValues?.map(option => (
                <div key={option.code} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.code} id={`${field.fieldId}-${option.code}`} />
                  <Label htmlFor={`${field.fieldId}-${option.code}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {field.fieldType === 'CHECKBOX' && (
            <div className="space-y-2">
              {field.codeListValues?.map(option => (
                <div key={option.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.fieldId}-${option.code}`}
                    checked={Array.isArray(fieldState?.value) && fieldState.value.includes(option.code)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(fieldState.value) ? fieldState.value : []
                      const newValues = checked
                        ? [...currentValues, option.code]
                        : currentValues.filter(v => v !== option.code)
                      handleFieldChange(field.fieldId, newValues)
                    }}
                    disabled={!enabled || readOnly}
                  />
                  <Label htmlFor={`${field.fieldId}-${option.code}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}
          
          {field.fieldType === 'TEXTAREA' && (
            <Textarea
              {...commonProps}
              rows={4}
            />
          )}
          
          {field.fieldType === 'FILE' && (
            <Input
              {...commonProps}
              type="file"
            />
          )}

          {!enabled && (
            <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        {hasError && (
          <div className="space-y-1">
            {errorMessages.map((error, index) => (
              <Alert key={index} variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {showCDISCInfo && (
          <div className="text-xs text-gray-500">
            <p><strong>CDASH Question:</strong> {field.cdashQuestion}</p>
            {field.cdashQuestionNumber && (
              <p><strong>Question #:</strong> {field.cdashQuestionNumber}</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // Render section
  const renderSection = (section: FormSection) => {
    const sectionFields = formSpecification.fields.filter(field => 
      section.fields.includes(field.fieldId)
    ).sort((a, b) => a.rowOrder - b.rowOrder)

    const isCollapsed = collapsedSections.has(section.sectionId)

    if (section.collapsible) {
      return (
        <Collapsible key={section.sectionId} open={!isCollapsed} onOpenChange={(open) => {
          const newCollapsed = new Set(collapsedSections)
          if (open) {
            newCollapsed.delete(section.sectionId)
          } else {
            newCollapsed.add(section.sectionId)
          }
          setCollapsedSections(newCollapsed)
        }}>
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CardTitle className="text-lg">{section.sectionName}</CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CollapsibleContent>
              <CardContent>
                <div className={`grid gap-4 ${formSpecification.layout.gridLayout.responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-' + formSpecification.layout.gridLayout.columns : 'grid-cols-' + formSpecification.layout.gridLayout.columns}`}>
                  {sectionFields.map(field => renderField(field))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )
    }

    return (
      <Card key={section.sectionId} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{section.sectionName}</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className={`grid gap-4 ${formSpecification.layout.gridLayout.responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-' + formSpecification.layout.gridLayout.columns : 'grid-cols-' + formSpecification.layout.gridLayout.columns}`}>
            {sectionFields.map(field => renderField(field))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {formSpecification.formName}
            {showCDISCInfo && (
              <Badge variant="secondary">
                {formSpecification.cdiscDomain} - {formSpecification.cdashCategory}
              </Badge>
            )}
          </CardTitle>
          {formSpecification.description && (
            <CardDescription>{formSpecification.description}</CardDescription>
          )}
          {formSpecification.instructions && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{formSpecification.instructions}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
      </Card>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {formSpecification.layout.sections
          .sort((a, b) => a.sectionOrder - b.sectionOrder)
          .map(section => renderSection(section))
        }

        {/* Submit Button */}
        {!readOnly && (
          <div className="flex justify-end">
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Submit Form
            </Button>
          </div>
        )}
      </form>
    </div>
  )
} 