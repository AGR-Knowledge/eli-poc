import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// Validate required environment variables
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
  console.error('Missing required AWS environment variables:');
  console.error('AWS_ACCESS_KEY_ID:', !!process.env.AWS_ACCESS_KEY_ID);
  console.error('AWS_SECRET_ACCESS_KEY:', !!process.env.AWS_SECRET_ACCESS_KEY);
  console.error('AWS_S3_BUCKET_NAME:', !!process.env.AWS_S3_BUCKET_NAME);
}

export interface UploadResult {
  success: boolean;
  s3Uri?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'clinical-edc/input'
): Promise<UploadResult> {
  try {
    console.log('Starting S3 upload for file:', fileName);
    console.log('Bucket name:', BUCKET_NAME);
    console.log('File size:', file.length, 'bytes');
    
    const key = `${folder}/${Date.now()}-${fileName}`;
    console.log('S3 key:', key);
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    console.log('Sending S3 command...');
    await s3Client.send(command);
    console.log('S3 upload completed successfully');

    return {
      success: true,
      s3Uri: `s3://${BUCKET_NAME}/${key}`,
      fileName,
      fileSize: file.length,
      contentType,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    console.error('Error details:', {
      bucketName: BUCKET_NAME,
      fileName,
      fileSize: file.length,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getSignedDownloadUrl(s3Uri: string, expiresIn: number = 3600): Promise<string> {
  try {
    const key = s3Uri.replace(`s3://${BUCKET_NAME}/`, '');
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

export async function deleteFileFromS3(s3Uri: string): Promise<boolean> {
  try {
    const key = s3Uri.replace(`s3://${BUCKET_NAME}/`, '');
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
}

export function extractFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function isValidFileType(fileName: string): boolean {
  const allowedExtensions = ['pdf', 'docx', 'xlsx', 'csv', 'md', 'txt', 'json'];
  const extension = extractFileExtension(fileName);
  return allowedExtensions.includes(extension);
}

export function getFileTypeCategory(fileName: string): 'document' | 'spreadsheet' | 'data' | 'text' {
  const extension = extractFileExtension(fileName);
  
  switch (extension) {
    case 'pdf':
    case 'docx':
    case 'md':
    case 'txt':
      return 'document';
    case 'xlsx':
    case 'csv':
      return 'spreadsheet';
    case 'json':
      return 'data';
    default:
      return 'text';
  }
} 