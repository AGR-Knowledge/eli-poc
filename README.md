# Clinical Trial EDC System

A modern, AI-powered Electronic Data Capture (EDC) system for clinical trials, built with Next.js, TypeScript, and Tailwind CSS. This project replicates Langflow's low-code approach for building AI agents and workflows, specifically tailored for clinical trial management.

## 🚀 Features

### Core Functionality
- **Study Management**: Create, view, and manage clinical trial studies
- **AI-Powered Document Processing**: Upload protocol documents and automatically extract study information using Amazon Bedrock (Claude AI)
- **Interactive Workflows**: Drag-and-drop interface for building clinical trial workflows
- **Real-time Processing**: Live progress tracking for document analysis and data extraction
- **Modern UI/UX**: Beautiful, responsive interface built with shadcn/ui components
- **File Management**: Secure file storage on AWS S3 with AI-powered data extraction

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality, accessible UI components
- **React Hook Form**: Performant forms with validation
- **Zod**: TypeScript-first schema validation
- **Lucide React**: Beautiful, customizable icons
- **AWS S3**: Secure file storage and management
- **Amazon Bedrock**: AI-powered document processing with Claude
- **MongoDB**: Document database for study data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**
- **AWS Account** with S3 and Bedrock access
- **MongoDB** (local or cloud instance)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd eli-poc
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27024/clinical-edc
   
   # AWS Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # JWT Configuration (if using JWT auth)
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

4. **Configure AWS Services**
   - **S3 Bucket**: Create a bucket for file storage
   - **IAM Permissions**: Ensure your AWS credentials have S3 and Bedrock access
   - **Bedrock Access**: Enable Claude model access in your AWS Bedrock console

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
eli-poc/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── studies/       # Study management APIs
│   │   │   ├── upload/    # File upload and AI processing
│   │   │   └── files/     # File download APIs
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── clinical-edc/      # Clinical trial EDC components
│   │   ├── studies-list-view.tsx
│   │   ├── upload-view.tsx
│   │   ├── new-study-view.tsx
│   │   ├── study-details-view.tsx
│   │   ├── file-upload.tsx
│   │   └── file-reference-viewer.tsx
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── aws-s3.ts         # AWS S3 utilities
│   ├── claude-api.ts     # Amazon Bedrock/Claude integration
│   ├── file-processor.ts # File processing utilities
│   ├── models/           # Database models
│   └── db.ts             # Database connection
├── public/               # Static assets
├── styles/               # Additional styles
├── clinical-trial-edc.tsx # Main EDC component
├── components.json       # shadcn/ui configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Usage

### Creating a New Study

1. **Navigate to Studies List**: View all existing studies
2. **Click "Create New Study"**: Choose between manual creation or AI-assisted setup
3. **AI-Assisted Setup**: Upload a protocol document for automatic data extraction
4. **Manual Setup**: Fill out study details manually
5. **Review and Save**: Verify extracted data and save the study

### Document Processing

The system can automatically process protocol documents to extract:
- Study information and metadata
- Inclusion/exclusion criteria
- Visit schedules
- Endpoints and assessments
- Study procedures

**Supported File Types:**
- PDF, DOCX, XLSX, CSV, MD, TXT, JSON

### Study Management

- **View Studies**: Browse all studies with search and filtering
- **Edit Studies**: Modify study details and configurations
- **File Management**: Upload, download, and view reference documents
- **AI Insights**: Get AI-powered recommendations and analysis

## 🔧 AWS Configuration

### S3 Bucket Setup
1. Create an S3 bucket in your AWS region
2. Configure CORS if needed for direct uploads
3. Set up appropriate IAM permissions

### Bedrock Access
1. Enable Claude model access in AWS Bedrock console
2. Ensure your IAM user/role has Bedrock permissions
3. The system uses `anthropic.claude-3-5-sonnet-20241022-v1:0` model

### IAM Permissions
Your AWS credentials need the following permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20241022-v1:0"
    }
  ]
}
```

## 🚨 Important Notes

1. **Environment Variables**: Ensure all required environment variables are set
2. **AWS Credentials**: Use IAM users or roles with minimal required permissions
3. **File Size Limits**: Consider implementing file size limits for uploads
4. **Cost Management**: Monitor AWS usage for S3 storage and Bedrock API calls
5. **Security**: Implement proper authentication and authorization

## 🎉 Benefits

- ✅ **AI-powered data extraction** using Amazon Bedrock
- ✅ **Secure file storage** on AWS S3
- ✅ **Regulatory compliant** data structure
- ✅ **Standardized terminology** across the industry
- ✅ **Scalable architecture** for large clinical trials
- ✅ **Audit trail** for data integrity
- ✅ **Interoperable** with other clinical systems

Your Clinical EDC now follows industry standards with AI-powered document processing! 🚀 