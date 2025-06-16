# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router architecture for an investor relations (IR) platform. The application serves three distinct user types: Administrators, Corporate users, and Investors.

## Essential Commands

### Development
```bash
# Initial setup
make setup                  # Install dependencies and configure .env.local

# Development workflow
make dev-start             # Start integrated development environment
make dev-stop              # Stop development environment
make dev-logs-follow       # Monitor logs in real-time

# Code quality
make lint                  # Run ESLint
make lint-fix              # Run ESLint with auto-fix
make test                  # Run tests
```

### Deployment (AWS)
```bash
# Infrastructure management
make tf-init               # Initialize Terraform
make tf-plan              # Plan infrastructure changes
make tf-apply             # Apply infrastructure changes
make tf-destroy           # Destroy infrastructure

# Application deployment
make deploy               # Deploy application to ECS
make deploy-full          # Full automated deployment
make aws-status           # Check AWS resource status
```

## Architecture Overview

### User Types & Authentication
- **Admin Users**: System administrators managing companies and users (path: `/admin/*`)
- **Corporate Users**: Company representatives managing Q&As and IR materials (path: `/corporate/*`)
- **Investor Users**: Investors accessing company information (path: `/investor/*`)
- **Guest Access**: Public access for investor features without login

Authentication is handled via Auth0 with role-based middleware protection. Roles are identified through custom Auth0 claims.

### API Integration Pattern
All API calls go through a centralized proxy at `/api/proxy/[...path]` which:
- Automatically attaches authentication tokens
- Handles guest access with special headers
- Supports streaming (SSE) for real-time features
- Manages file uploads with proper headers

Example API call:
```typescript
const response = await fetch('/api/proxy/companies', {
  headers: { 'Content-Type': 'application/json' }
});
```

### State Management
- **Server State**: React Query (TanStack Query) for API data caching
- **Client State**: React Context API for app config, favorites, and guest state
- **Form State**: React Hook Form with Zod validation

### Component Organization
```
/src/components/
├── common/        # Shared components (header, footer, sidebar)
├── features/      # Feature-specific components
│   ├── admin/    # Admin-only features
│   ├── corporate/# Corporate user features
│   └── investor/ # Investor features
└── ui/           # Base UI components (shadcn/ui)
```

### Key Features
1. **Q&A Management**: CRUD operations with AI-powered generation
2. **File Management**: PDF upload/download for IR documents
3. **Chat System**: Real-time communication via SSE
4. **Company Profiles**: Logo uploads and company information
5. **Dashboard Analytics**: Data visualization with Recharts

## Development Guidelines

### When Adding New Features
1. Place components in the appropriate `features/` subdirectory based on user type
2. Use the existing API proxy pattern for backend communication
3. Implement proper authentication checks using the middleware pattern
4. Use React Query for data fetching with the established query key patterns
5. Follow the existing TypeScript type definitions in `/src/types/`

### Testing Approach
- MSW (Mock Service Worker) is configured for API mocking
- Test files should be colocated with components
- Use the existing test utilities and mock data patterns

### Styling
- Use Tailwind CSS classes following the existing patterns
- Utilize shadcn/ui components from `/src/components/ui/`
- Follow the semantic color scheme defined in `tailwind.config.ts`

### Environment Variables
Required environment variables (configured in `.env.local`):
- `AUTH0_SECRET`, `AUTH0_BASE_URL`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_CLOUDFRONT_URL`: CDN URL for production assets