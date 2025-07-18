import { extractFileExtension, getFileTypeCategory } from './aws-s3';

export interface FileProcessingResult {
  success: boolean;
  content?: string;
  error?: string;
  fileType?: string;
  wordCount?: number;
  processingTime?: number;
}

export async function processFileContent(
  fileBuffer: Buffer,
  fileName: string
): Promise<FileProcessingResult> {
  const startTime = Date.now();
  
  try {
    const extension = extractFileExtension(fileName);
    const fileType = getFileTypeCategory(fileName);
    
    let content: string;
    
    switch (extension) {
      case 'txt':
      case 'md':
        content = fileBuffer.toString('utf-8');
        break;
        
      case 'json':
        const jsonData = JSON.parse(fileBuffer.toString('utf-8'));
        content = JSON.stringify(jsonData, null, 2);
        break;
        
      case 'csv':
        content = fileBuffer.toString('utf-8');
        // Convert CSV to more readable format for AI processing
        const lines = content.split('\n');
        const headers = lines[0]?.split(',') || [];
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj: any, header: string, index: number) => {
            obj[header.trim()] = values[index]?.trim() || '';
            return obj;
          }, {});
        });
        content = `CSV Headers: ${headers.join(', ')}\n\nData:\n${JSON.stringify(data, null, 2)}`;
        break;
        
      case 'pdf':
        // For PDF files, we'll need to extract text
        // This is a simplified version - in production, you'd use a PDF parsing library
        content = await extractTextFromPDF(fileBuffer);
        break;
        
      case 'docx':
        // For DOCX files, we'll need to extract text
        content = await extractTextFromDOCX(fileBuffer);
        break;
        
      case 'xlsx':
        // For XLSX files, we'll need to extract text
        content = await extractTextFromXLSX(fileBuffer);
        break;
        
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
    
    const processingTime = Date.now() - startTime;
    const wordCount = content.split(/\s+/).length;
    
    return {
      success: true,
      content,
      fileType,
      wordCount,
      processingTime,
    };
  } catch (error) {
    console.error('Error processing file content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processingTime: Date.now() - startTime,
    };
  }
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // For PDF files, we'll return a placeholder since we'll send the bytes directly to Claude
    const fileSize = buffer.length;
    const fileSizeKB = Math.round(fileSize / 1024);
    
    return `[PDF Document - ${fileSizeKB} KB - Will be processed directly by Claude]`;
  } catch (error) {
    console.error('Error processing PDF:', error);
    return `[PDF Document - Error processing: ${error}]`;
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  // This is a placeholder - in production, you'd use a library like mammoth
  // For now, we'll return a message indicating DOCX processing is needed
  return "DOCX content extraction requires additional processing. Please ensure the document contains extractable text.";
}

async function extractTextFromXLSX(buffer: Buffer): Promise<string> {
  // This is a placeholder - in production, you'd use a library like xlsx
  // For now, we'll return a message indicating XLSX processing is needed
  return "XLSX content extraction requires additional processing. Please ensure the spreadsheet contains extractable data.";
} 