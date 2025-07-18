"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  CheckCircle, 
  Info
} from "lucide-react"

// Simplified types
interface SimpleFormField {
  fieldId: string
  fieldName: string
  fieldLabel: string
  fieldType: 'TEXT' | 'NUMBER' | 'DATE' | 'TIME' | 'DATETIME' | 'SELECT' | 'MULTISELECT' | 'RADIO' | 'CHECKBOX' | 'TEXTAREA' | 'FILE'
  cdiscVariable: string
  cdashQuestion: string
  cdashQuestionNumber?: string
  required: boolean
  validationRules: Array<{
    ruleType: 'REQUIRED' | 'RANGE' | 'PATTERN' | 'LENGTH'
    rule: string
    message: string
    severity: 'ERROR' | 'WARNING' | 'INFO'
  }>
  codeListValues?: Array<{
    code: string
    label: string
    order: number
    active: boolean
  }>
  dependencies: Array<{
    dependentFieldId: string
    condition: string
    action: 'SHOW' | 'HIDE' | 'REQUIRE' | 'OPTIONAL'
    value?: any
  }>
  displayProperties: {
    width?: string
    placeholder?: string
    helpText?: string
  }
}

interface SimpleFormSpecification {
  formId: string
  formName: string
  formCode: string
  cdiscDomain: string
  cdashCategory: string
  description: string
  instructions: string
  fields: SimpleFormField[]
}

interface SimpleDynamicFormBuilderProps {
  formSpecification: SimpleFormSpecification
  initialData?: Record<string, any>
  onSubmit?: (data: Record<string, any>) => void
  onValidationError?: (errors: Record<string, string[]>) => void
  readOnly?: boolean
  showCDISCInfo?: boolean
}

export function SimpleDynamicFormBuilder({
  formSpecification,
  initialData = {},
  onSubmit,
  onValidationError,
  readOnly = false,
  showCDISCInfo = false
}: SimpleDynamicFormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  // Simple dependency evaluation
  const evaluateDependencies = useCallback((field: SimpleFormField, currentData: Record<string, any>) => {
    let visible = true
    let required = field.required

    field.dependencies.forEach(dependency => {
      const dependentValue = currentData[dependency.dependentFieldId]
      let conditionMet = false

      // Simple condition evaluation
      if (dependency.condition === 'EQUALS') {
        conditionMet = dependentValue === dependency.value
      } else if (dependency.condition === 'NOT_EQUALS') {
        conditionMet = dependentValue !== dependency.value
      } else if (dependency.condition === 'IS_EMPTY') {
        conditionMet = !dependentValue || dependentValue === ''
      } else if (dependency.condition === 'IS_NOT_EMPTY') {
        conditionMet = dependentValue && dependentValue !== ''
      }

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
      }
    })

    return { visible, required }
  }, [])

  // Simple validation
  const validateField = useCallback((field: SimpleFormField, value: any): string[] => {
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
  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    const field = formSpecification.fields.find(f => f.fieldId === fieldId)
    if (!field) return

    // Validate field
    const errors = validateField(field, value)
    
    // Update form data
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [fieldId]: errors
    }))
  }, [formSpecification.fields, validateField])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const allErrors: Record<string, string[]> = {}
    let hasErrors = false
    
    formSpecification.fields.forEach(field => {
      const { required } = evaluateDependencies(field, formData)
      if (required) {
        const errors = validateField(field, formData[field.fieldId])
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
  }, [formData, formSpecification.fields, evaluateDependencies, validateField, onSubmit, onValidationError])

  // Render field
  const renderField = useCallback((field: SimpleFormField) => {
    const { visible, required } = evaluateDependencies(field, formData)
    
    if (!visible) return null

    const value = formData[field.fieldId] || ''
    const errorMessages = validationErrors[field.fieldId] || []
    const hasError = errorMessages.length > 0

    return (
      <div key={field.fieldId} className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={field.fieldId} className="text-sm font-medium">
            {field.fieldLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
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
              id={field.fieldId}
              name={field.fieldName}
              value={value}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              disabled={readOnly}
              placeholder={field.displayProperties.placeholder}
              style={{ width: field.displayProperties.width }}
            />
          )}
          
          {field.fieldType === 'NUMBER' && (
            <Input
              id={field.fieldId}
              name={field.fieldName}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              disabled={readOnly}
              placeholder={field.displayProperties.placeholder}
              style={{ width: field.displayProperties.width }}
            />
          )}
          
          {field.fieldType === 'DATE' && (
            <Input
              id={field.fieldId}
              name={field.fieldName}
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              disabled={readOnly}
              style={{ width: field.displayProperties.width }}
            />
          )}
          
          {field.fieldType === 'TIME' && (
            <Input
              id={field.fieldId}
              name={field.fieldName}
              type="time"
              value={value}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              disabled={readOnly}
              style={{ width: field.displayProperties.width }}
            />
          )}
          
          {field.fieldType === 'DATETIME' && (
            <Input
              id={field.fieldId}
              name={field.fieldName}
              type="datetime-local"
              value={value}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              disabled={readOnly}
              placeholder={field.displayProperties.placeholder}
              style={{ width: field.displayProperties.width }}
            />
          )}
          
          {field.fieldType === 'SELECT' && (
            <Select
              value={value}
              onValueChange={(newValue) => handleFieldChange(field.fieldId, newValue)}
              disabled={readOnly}
            >
              <SelectTrigger style={{ width: field.displayProperties.width }}>
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
              value={value}
              onValueChange={(newValue) => handleFieldChange(field.fieldId, newValue)}
              disabled={readOnly}
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
                    checked={Array.isArray(value) && value.includes(option.code)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : []
                      const newValues = checked
                        ? [...currentValues, option.code]
                        : currentValues.filter(v => v !== option.code)
                      handleFieldChange(field.fieldId, newValues)
                    }}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`${field.fieldId}-${option.code}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}
          
          {field.fieldType === 'TEXTAREA' && (
            <Textarea
              id={field.fieldId}
              name={field.fieldName}
              value={value}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              disabled={readOnly}
              placeholder={field.displayProperties.placeholder}
              rows={4}
              style={{ width: field.displayProperties.width }}
            />
          )}
          
          {field.fieldType === 'FILE' && (
            <Input
              id={field.fieldId}
              name={field.fieldName}
              type="file"
              onChange={(e) => handleFieldChange(field.fieldId, e.target.files?.[0])}
              disabled={readOnly}
              style={{ width: field.displayProperties.width }}
            />
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
  }, [formData, validationErrors, evaluateDependencies, handleFieldChange, readOnly, showCDISCInfo])

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
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formSpecification.fields
                .sort((a, b) => {
                  // Sort by field order if available, otherwise by fieldId
                  const aOrder = (a as any).rowOrder || 0
                  const bOrder = (b as any).rowOrder || 0
                  return aOrder - bOrder
                })
                .map(field => renderField(field))
              }
            </div>
          </CardContent>
        </Card>

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