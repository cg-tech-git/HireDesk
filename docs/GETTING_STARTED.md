# HireDesk - Getting Started Guide

## Project Overview

HireDesk is a comprehensive equipment rental platform built with a modern tech stack:

- **Frontend**: Next.js 14 with TypeScript, Material-UI, and Firebase Auth
- **Backend**: Node.js/Express API with TypeScript and PostgreSQL
- **Infrastructure**: Google Cloud Platform (Cloud Run, Cloud SQL, Vertex AI)
- **Architecture**: Monorepo structure with shared types and utilities

## Project Structure

```
HireDesk/
├── packages/
│   ├── frontend/        # Next.js web application
│   ├── backend/         # Express API server
│   └── shared/          # Shared types, schemas, and constants
├── infrastructure/      # Terraform and deployment configurations
├── docs/               # Documentation
├── scripts/            # Utility scripts and database initialization
├── docker-compose.yml  # Local development setup
├── Makefile           # Common development commands
└── package.json       # Root workspace configuration
```

## Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (for local PostgreSQL)
- Google Cloud SDK (for deployment)
- Git

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/cg-tech-git/HireDesk.git
cd HireDesk

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your configuration
# Key variables to update:
# - Database credentials (if not using Docker defaults)
# - Firebase configuration
# - Google Cloud project ID
# - API keys and secrets
```

### 3. Database Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# The database will be automatically initialized with the schema
# Check logs to ensure it started correctly
docker-compose logs postgres
```

### 4. Google Cloud Setup (Required for full functionality)

1. Create a new Google Cloud project
2. Enable required APIs:
   - Cloud Run API
   - Cloud SQL Admin API
   - Vertex AI API
   - Cloud Storage API
   - BigQuery API

3. Set up Firebase:
   - Create a Firebase project linked to your GCP project
   - Enable Authentication
   - Download service account key

4. Configure Vertex AI Search:
   - Create a new search application
   - Note the datastore ID for your .env file

## Development Workflow

### Running the Application

```bash
# Start all services (frontend and backend)
npm run dev

# Or use the Makefile
make dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- pgAdmin: http://localhost:5050 (admin@hiredesk.com / admin)

### Common Commands

```bash
# Build all packages
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Next Steps for Implementation

### Phase 1: Core Backend Setup (Priority)

1. **Database Entities and Repositories**
   - Create TypeORM entities matching the database schema
   - Implement repository pattern for data access
   - Set up database connection configuration

2. **Authentication System**
   - Firebase Admin SDK integration
   - JWT middleware for API protection
   - Role-based access control (RBAC)

3. **Core API Endpoints**
   - User management and profiles
   - Equipment catalog CRUD
   - Rate card management

### Phase 2: Frontend Foundation

1. **Layout and Navigation**
   - App shell with collapsible sidebar
   - Responsive layout with Material-UI
   - Theme configuration

2. **Authentication Flow**
   - Login/Register pages
   - Firebase Auth integration
   - Protected route wrapper

3. **Equipment Catalog**
   - Category browsing
   - Equipment listing with search
   - Equipment detail pages

### Phase 3: Quoting System

1. **Backend Quote Engine**
   - Quote calculation logic
   - PDF generation service
   - Quote submission workflow

2. **Frontend Quote Flow**
   - RFQ basket functionality
   - Date selection per item
   - Quote review and submission

3. **Admin Dashboard**
   - Rate card management UI
   - Quote template configuration
   - Hire desk queue management

### Phase 4: AI and Cloud Integration

1. **Vertex AI Search**
   - Index equipment data
   - Implement natural language search
   - Search results API

2. **Cloud Storage**
   - Equipment image uploads
   - PDF quote storage
   - Asset management

3. **BigQuery Analytics**
   - Event streaming setup
   - Analytics dashboard
   - Business intelligence queries

### Phase 5: Production Readiness

1. **Testing**
   - Unit tests for business logic
   - Integration tests for APIs
   - E2E tests for critical flows

2. **Performance**
   - API response optimization
   - Frontend bundle optimization
   - Caching strategies

3. **Deployment**
   - Cloud Run deployment scripts
   - CI/CD pipeline setup
   - Environment management

## Development Tips

1. **Type Safety**: Leverage the shared package for consistent types across frontend and backend
2. **Validation**: Use Zod schemas for runtime validation at API boundaries
3. **Error Handling**: Implement consistent error responses using the ApiResponse type
4. **Logging**: Use structured logging with correlation IDs for debugging
5. **Security**: Always validate user permissions before data access

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart the database
docker-compose restart postgres
```

### Port Conflicts
- Frontend runs on port 3000
- Backend runs on port 3001
- PostgreSQL runs on port 5432
- pgAdmin runs on port 5050

Change ports in `.env.local` if needed.

### Build Errors
```bash
# Clean and rebuild
make clean
npm install
npm run build
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [Material-UI Documentation](https://mui.com/)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

## Support

For issues or questions:
1. Check the logs for error messages
2. Review the documentation
3. Create an issue in the GitHub repository

---

Ready to start building? Begin with Phase 1 and work through each phase systematically. Good luck! 