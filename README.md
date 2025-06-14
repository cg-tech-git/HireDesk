# HireDesk

Industry-leading digital platform for equipment rental, transforming manual processes into a seamless, self-service experience.

## Overview

HireDesk is a comprehensive equipment rental platform that enables customers to instantly configure, price, and request equipment rentals. The platform streamlines the validation and confirmation process for businesses while providing a modern, user-friendly interface for customers.

## Tech Stack

- **Frontend**: React/Next.js, Material-UI, Firebase Auth
- **Backend**: Node.js, Express, Google Cloud Run
- **Database**: Cloud SQL (PostgreSQL)
- **AI/ML**: Vertex AI Search
- **Infrastructure**: Google Cloud Platform

## Project Structure

```
HireDesk/
├── packages/
│   ├── frontend/        # Next.js web application
│   ├── backend/         # Node.js API server
│   └── shared/          # Shared utilities and types
├── infrastructure/      # Terraform configurations
├── docs/               # Documentation
└── scripts/            # Build and deployment scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud SDK
- PostgreSQL (for local development)

### Installation

```bash
# Clone the repository
git clone https://github.com/cg-tech-git/HireDesk.git
cd HireDesk

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Development

```bash
# Run the development servers
npm run dev
```

## Features

- 🔍 AI-powered equipment search with natural language queries
- 📊 Dynamic pricing calculator with tiered rates
- 📄 Automated PDF quote generation
- 👥 Role-based access (Customers, Hire Desk, Administrators)
- 📧 Gmail integration for quote submissions
- 📈 Comprehensive analytics with BigQuery

## License

Copyright © 2025 HireDesk. All rights reserved. 