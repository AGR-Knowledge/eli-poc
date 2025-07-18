import { BedrockRuntimeClient, InvokeModelCommand, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

// Claude model IDs for Bedrock - both support document input
const CLAUDE_MODELS = {
  CLAUDE_3_5_SONNET: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  CLAUDE_3_5_SONNET_LATEST: 'claude-3-5-sonnet-latest',
  CLAUDE_3_HAIKU: 'anthropic.claude-3-haiku-20240307-v1:0',
  CLAUDE_3_OPUS: 'anthropic.claude-3-opus-20240229-v1:0',
} as const;

// Default model - using Sonnet which has better document understanding
const CLAUDE_MODEL_ID = 'anthropic.claude-3-5-sonnet-20240620-v1:0';

// Validate required environment variables
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.warn('AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
}

export interface ClaudeExtractionResult {
  success: boolean;
  extractedData?: any;
  error?: string;
  confidence?: number;
  processingTime?: number;
}

export interface StudyFieldMapping {
  field: string;
  path: string;
  description: string;
  required: boolean;
  dataType: 'string' | 'number' | 'date' | 'array' | 'object' | 'boolean';
}

// Define the study field mappings for extraction
export const STUDY_FIELD_MAPPINGS: StudyFieldMapping[] = [
  // Overview Tab
  { field: 'studyName', path: 'studyName', description: 'Study name/title', required: false, dataType: 'string' },
  { field: 'studyDescription', path: 'studyDescription', description: 'Study description', required: false, dataType: 'string' },
  { field: 'protocolNumber', path: 'protocolNumber', description: 'Protocol number', required: false, dataType: 'string' },
  { field: 'protocolVersion', path: 'protocolVersion', description: 'Protocol version', required: false, dataType: 'string' },
  { field: 'protocolTitle', path: 'protocolTitle', description: 'Protocol title', required: false, dataType: 'string' },
  { field: 'protocolShortTitle', path: 'protocolShortTitle', description: 'Protocol short title', required: false, dataType: 'string' },
  { field: 'studyType', path: 'studyType', description: 'Study type (INTERVENTIONAL, OBSERVATIONAL, EXPANDED_ACCESS)', required: false, dataType: 'string' },
  { field: 'studyPhase', path: 'studyPhase', description: 'Study phase (I, II, III, IV, PILOT, FEASIBILITY)', required: false, dataType: 'string' },
  { field: 'therapeuticArea', path: 'therapeuticArea', description: 'Therapeutic area', required: false, dataType: 'string' },
  { field: 'indication', path: 'indication', description: 'Study indication', required: false, dataType: 'string' },
  { field: 'keywords', path: 'keywords', description: 'Study keywords', required: false, dataType: 'array' },
  
  // Sponsor & PI
  { field: 'sponsor', path: 'sponsor', description: 'Study sponsor information', required: false, dataType: 'object' },
  { field: 'principalInvestigator', path: 'principalInvestigator', description: 'Principal investigator information', required: false, dataType: 'object' },
  
  // Design Tab
  { field: 'plannedEnrollment', path: 'plannedEnrollment', description: 'Planned enrollment number', required: false, dataType: 'number' },
  { field: 'studyDesign', path: 'studyDesign', description: 'Study design details', required: false, dataType: 'object' },
  { field: 'population', path: 'population', description: 'Study population details', required: false, dataType: 'object' },
  
  // Inclusion/Exclusion Criteria
  { field: 'inclusionCriteria', path: 'inclusionCriteria', description: 'Inclusion criteria list', required: false, dataType: 'array' },
  { field: 'exclusionCriteria', path: 'exclusionCriteria', description: 'Exclusion criteria list', required: false, dataType: 'array' },
  
  // Timeline Tab
  { field: 'visits', path: 'visits', description: 'Study visits schedule', required: false, dataType: 'array' },
  { field: 'epochs', path: 'epochs', description: 'Study epochs', required: false, dataType: 'array' },
  
  // Arms Tab
  { field: 'treatmentArms', path: 'treatmentArms', description: 'Treatment arms', required: false, dataType: 'array' },
  
  // Objectives Tab
  { field: 'objectives', path: 'objectives', description: 'Study objectives', required: false, dataType: 'array' },
  
  // Assessments Tab
  { field: 'assessments.safetyAssessments', path: 'assessments.safetyAssessments', description: 'Safety assessments', required: false, dataType: 'array' },
  { field: 'assessments.efficacyAssessments', path: 'assessments.efficacyAssessments', description: 'Efficacy assessments', required: false, dataType: 'array' },
  { field: 'assessments.pkAssessments', path: 'assessments.pkAssessments', description: 'PK assessments', required: false, dataType: 'array' },
  { field: 'assessments.biomarkerAssessments', path: 'assessments.biomarkerAssessments', description: 'Biomarker assessments', required: false, dataType: 'array' },
];

export async function extractStudyDataFromFile(
  fileContent: string,
  fileName: string,
  fileType: string,
  modelId: string = CLAUDE_MODEL_ID
): Promise<ClaudeExtractionResult> {
  const startTime = Date.now();
  
  try {
    const systemPrompt = `You are an expert clinical trial data extraction specialist. Your task is to analyze clinical trial documents and extract structured data according to CDISC/SDTM standards.

IMPORTANT INSTRUCTIONS:
1. Extract ONLY the fields that are explicitly mentioned in the document
2. If a field is not found, return empty string "" for that field
3. DO NOT hallucinate or make up any data
4. Maintain the exact JSON structure as specified
5. For dates, use ISO format (YYYY-MM-DD) if found
6. For study phases, use: I, II, III, IV, PILOT, FEASIBILITY
7. For study types, use: INTERVENTIONAL, OBSERVATIONAL, EXPANDED_ACCESS
8. For study design types, use: PARALLEL_GROUP, CROSSOVER, FACTORIAL, SINGLE_GROUP
9. For allocation, use: RANDOMIZED, NON_RANDOMIZED
10. For blinding, use: OPEN, SINGLE_BLIND, DOUBLE_BLIND, TRIPLE_BLIND
11. For control types, use: PLACEBO, ACTIVE, NO_TREATMENT
12. For treatment arm types, use: EXPERIMENTAL, PLACEBO_COMPARATOR, ACTIVE_COMPARATOR
13. For objective types, use: PRIMARY, SECONDARY, EXPLORATORY

DOCUMENT ANALYSIS:
- Read through the entire document carefully
- Look for clinical trial information across all pages
- Pay attention to headers, tables, and structured sections
- Extract information from both text and any structured data

RESPONSE FORMAT:
Return a valid JSON object with the extracted data. Only include fields that were found in the document. If a field is not found, use empty string "".`;

    const userPrompt = `Please analyze the following ${fileType} file and extract clinical trial study data.

File name: ${fileName}
Document length: ${fileContent.length} characters

IMPORTANT: This is a clinical trial document. Please read through ALL content carefully and extract any clinical trial information you find.

Document content:
${fileContent}

Extract the following fields if they are mentioned in the document:
${STUDY_FIELD_MAPPINGS.map(mapping => 
  `- ${mapping.field}: ${mapping.description} (${mapping.dataType})`
).join('\n')}

ANALYSIS INSTRUCTIONS:
- Read through the entire document systematically
- Look for clinical trial information in headers, tables, and text
- Extract study details, protocol information, and trial parameters
- Pay attention to numbers, dates, and structured data
- If you find clinical trial data, extract it accurately

Return the extracted data as a valid JSON object. Only include fields that are explicitly mentioned in the document. If a field is not found, use empty string "".`;

    console.log('Sending request to Bedrock with model:', modelId);
    
    // Prepare the request for Bedrock
    const requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 8000, // Increased for larger documents
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    };

    const command = new InvokeModelCommand({
      modelId: modelId,
      contentType: 'application/json',
      body: JSON.stringify(requestBody),
    });

    const response = await bedrockClient.send(command);
    console.log('Received response from Bedrock');
    const processingTime = Date.now() - startTime;
    
    // Parse the response from Bedrock
    const responseText = new TextDecoder().decode(response.body);
    console.log('Bedrock response text:', responseText.substring(0, 200) + '...');
    
    const responseBody = JSON.parse(responseText);
    
    if (!responseBody.content || !Array.isArray(responseBody.content) || responseBody.content.length === 0) {
      throw new Error('Invalid response format from Bedrock');
    }
    
    const content = responseBody.content[0];
    
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    // Extract JSON from the response
    const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) || 
                     content.text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Claude response');
    }

    const extractedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    
    // Calculate confidence based on number of fields extracted
    const totalFields = STUDY_FIELD_MAPPINGS.length;
    const extractedFields = Object.keys(extractedData).length;
    const confidence = Math.min(extractedFields / totalFields, 1.0);

    return {
      success: true,
      extractedData,
      confidence,
      processingTime,
    };
  } catch (error) {
    console.error('Error extracting data with Claude:', error);
    
    // Try fallback model if the primary model fails
    if (modelId === CLAUDE_MODEL_ID && error instanceof Error && error.message.includes('ValidationException')) {
      console.log('Trying fallback model...');
      try {
        const fallbackResult = await extractStudyDataFromFile(
          fileContent,
          fileName,
          fileType,
          CLAUDE_MODELS.CLAUDE_3_HAIKU
        );
        return fallbackResult;
      } catch (fallbackError) {
        console.error('Fallback model also failed:', fallbackError);
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processingTime: Date.now() - startTime,
    };
  }
}

export function getAvailableClaudeModels() {
  return CLAUDE_MODELS;
}

export function getDefaultClaudeModel() {
  return CLAUDE_MODEL_ID;
}

// Function to extract data from document bytes (for PDF, DOCX, etc.)
export async function extractStudyDataFromDocumentBytes(
  documentBytes: Buffer,
  fileName: string,
  fileType: string,
  modelId: string = CLAUDE_MODEL_ID
): Promise<ClaudeExtractionResult> {
  const startTime = Date.now();
  try {
    console.log('Sending document to Bedrock with model:', modelId);

    // Sanitize fileName for Bedrock
    let safeFileName = fileName
      .replace(/[^\w\s\-\(\)\[\]]+/g, '') // allow only alphanumeric, whitespace, hyphens, parentheses, square brackets
      .replace(/\s{2,}/g, ' ')                 // collapse multiple spaces
      .trim();
    if (!safeFileName) safeFileName = 'document.pdf';

    const conversation: any = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please analyze this PDF document and extract clinical trial study data.\n\nFile name: ${safeFileName}\n\nExtract the following fields if they are mentioned in the document:\n${STUDY_FIELD_MAPPINGS.map(mapping => 
  `- ${mapping.field}: ${mapping.description} (${mapping.dataType})`
).join('\\n')}\n\nANALYSIS INSTRUCTIONS:\n- Read through the entire document systematically\n- Look for clinical trial information in headers, tables, and text\n- Extract study details, protocol information, and trial parameters\n- Pay attention to numbers, dates, and structured data\n- If you find clinical trial data, extract it accurately\n\nReturn the extracted data as a valid JSON object. Only include fields that are explicitly mentioned in the document. If a field is not found, use empty string "".`
          },
          {
            type: "document",
            document: {
              format: "pdf",
              name: safeFileName,
              source: { bytes: documentBytes }
            }
          }
        ]
      }
    ];

    const command = new ConverseCommand({
      modelId: modelId,
      messages: conversation,
      inferenceConfig: {
        maxTokens: 8000,
        temperature: 0.1
      }
    });
    const response = await bedrockClient.send(command);
    console.log('Received response from Bedrock');
    const processingTime = Date.now() - startTime;
    // Parse the response from Bedrock Converse API
    const responseText = (response as any).output?.message?.content?.[0]?.text;
    if (!responseText) {
      throw new Error('No response text received from Bedrock');
    }
    console.log('Bedrock response text:', responseText.substring(0, 200) + '...');
    // Extract JSON from the response
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                     responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Claude response');
    }
    const extractedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    // Calculate confidence based on number of fields extracted
    const totalFields = STUDY_FIELD_MAPPINGS.length;
    const extractedFields = Object.keys(extractedData).length;
    const confidence = Math.min(extractedFields / totalFields, 1.0);
    return {
      success: true,
      extractedData,
      confidence,
      processingTime,
    };
  } catch (error) {
    console.error('Error extracting data with Claude:', error);
    // Try fallback model if the primary model fails
    if (modelId === CLAUDE_MODEL_ID && error instanceof Error && error.message.includes('ValidationException')) {
      console.log('Trying fallback model...');
      try {
        const fallbackResult = await extractStudyDataFromDocumentBytes(
          documentBytes,
          fileName,
          fileType,
          CLAUDE_MODELS.CLAUDE_3_HAIKU
        );
        return fallbackResult;
      } catch (fallbackError) {
        console.error('Fallback model also failed:', fallbackError);
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processingTime: Date.now() - startTime,
    };
  }
}

function getDocumentFormat(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'docx':
    case 'doc':
      return 'doc';
    case 'xlsx':
    case 'xls':
      return 'xls';
    case 'csv':
      return 'csv';
    case 'txt':
      return 'txt';
    case 'md':
      return 'md';
    case 'json':
      return 'txt'; // JSON as text
    default:
      return 'txt';
  }
}



export async function validateExtractedData(extractedData: any): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!extractedData || typeof extractedData !== 'object') {
    errors.push('Extracted data is not a valid object');
    return { isValid: false, errors, warnings };
  }

  // Check for required fields (if any)
  const requiredFields = STUDY_FIELD_MAPPINGS.filter(field => field.required);
  for (const field of requiredFields) {
    if (!extractedData[field.field]) {
      errors.push(`Required field '${field.field}' is missing`);
    }
  }

  // Validate data types
  for (const mapping of STUDY_FIELD_MAPPINGS) {
    const value = getNestedValue(extractedData, mapping.field);
    if (value !== null && value !== undefined) {
      const isValidType = validateDataType(value, mapping.dataType);
      if (!isValidType) {
        warnings.push(`Field '${mapping.field}' has unexpected data type. Expected: ${mapping.dataType}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function validateDataType(value: any, expectedType: string): boolean {
  switch (expectedType) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    case 'date':
      return !isNaN(Date.parse(value));
    default:
      return true;
  }
} 