# ELI-POC: Clinical Trial EDC System

A modern, AI-powered Electronic Data Capture (EDC) system for clinical trials, built with Next.js, TypeScript, and Tailwind CSS. This project replicates Langflow's low-code approach for building AI agents and workflows, specifically tailored for clinical trial management.

## 🚀 Features

### Core Functionality
- **Study Management**: Create, view, and manage clinical trial studies
- **AI-Powered Document Processing**: Upload protocol documents and automatically extract study information
- **Interactive Workflows**: Drag-and-drop interface for building clinical trial workflows
- **Real-time Processing**: Live progress tracking for document analysis and data extraction
- **Modern UI/UX**: Beautiful, responsive interface built with shadcn/ui components

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality, accessible UI components
- **React Hook Form**: Performant forms with validation
- **Zod**: TypeScript-first schema validation
- **Lucide React**: Beautiful, customizable icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

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
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   # Add other environment variables as needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
eli-poc/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── clinical-edc/      # Clinical trial EDC components
│   │   ├── studies-list-view.tsx
│   │   ├── upload-view.tsx
│   │   ├── new-study-view.tsx
│   │   └── study-details-view.tsx
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
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

### Study Management

- **View Studies**: Browse all studies with search and filtering
- **Study Details**: View comprehensive study information
- **Edit Studies**: Modify study data and configurations
- **Upload Documents**: Add supporting documents to studies

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

### Adding New Components

This project uses shadcn/ui for components. To add a new component:

```bash
npx shadcn@latest add [component-name]
```

### Styling

The project uses Tailwind CSS with a custom design system. Key files:
- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles
- `components.json` - shadcn/ui configuration

## 🔧 Configuration

### Tailwind CSS
Customize the design system in `tailwind.config.ts`:
- Colors and themes
- Typography scales
- Spacing and sizing
- Animation configurations

### shadcn/ui
Configure component library in `components.json`:
- Component paths
- Style preferences
- TypeScript settings

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Write meaningful component and function names
- Add proper error handling
- Include TypeScript types for all functions
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first styling approach
- **Next.js** team for the amazing React framework
- **Langflow** for inspiration on low-code AI workflows

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** in this README
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information
4. **Contact the development team**

## 🔮 Roadmap

### Upcoming Features
- [ ] Advanced workflow builder with drag-and-drop interface
- [ ] Integration with external clinical trial databases
- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Advanced security features

### Version History
- **v1.0.0** - Initial release with basic EDC functionality
- **v1.1.0** - AI-powered document processing
- **v1.2.0** - Enhanced UI/UX with shadcn/ui components

---

**Built with ❤️ for the clinical research community** 