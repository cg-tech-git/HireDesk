#!/bin/bash

# HireDesk Cloud Run Deployment Script
# This script deploys both backend and frontend services to Google Cloud Run

set -e

# Configuration
PROJECT_ID="hiredesk"
REGION="us-central1"
ARTIFACT_REGISTRY_REPO="hiredesk-repo"
DB_INSTANCE="hiredesk-db"
DB_NAME="hiredesk_dev"
DB_USER="hiredesk_user"
DB_PASS="hiredesk_pass_123"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting HireDesk Cloud Run Deployment...${NC}"

# Build Docker images
echo -e "${BLUE}Building Docker images...${NC}"
echo "Building backend..."
docker build --platform linux/amd64 -f packages/backend/Dockerfile -t hiredesk-backend .
echo "Building frontend..."
docker build --platform linux/amd64 -f packages/frontend/Dockerfile -t hiredesk-frontend .

# Tag images for Artifact Registry
echo -e "${BLUE}Tagging images for Artifact Registry...${NC}"
docker tag hiredesk-backend ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/backend:latest
docker tag hiredesk-frontend ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/frontend:latest

# Push images to Artifact Registry
echo -e "${BLUE}Pushing images to Artifact Registry...${NC}"
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/backend:latest
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/frontend:latest

# Deploy backend to Cloud Run
echo -e "${BLUE}Deploying backend to Cloud Run...${NC}"
BACKEND_URL=$(gcloud run deploy hiredesk-backend \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/backend:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 3001 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars "NODE_ENV=production,DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@/${DB_NAME}?host=/cloudsql/${PROJECT_ID}:${REGION}:${DB_INSTANCE}" \
  --add-cloudsql-instances ${PROJECT_ID}:${REGION}:${DB_INSTANCE} \
  --format="value(status.url)")

echo -e "${GREEN}✅ Backend deployed at: ${BACKEND_URL}${NC}"

# Deploy frontend to Cloud Run
echo -e "${BLUE}Deploying frontend to Cloud Run...${NC}"
FRONTEND_URL=$(gcloud run deploy hiredesk-frontend \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/frontend:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars "NEXT_PUBLIC_API_URL=${BACKEND_URL}/api/v1" \
  --format="value(status.url)")

echo -e "${GREEN}✅ Frontend deployed at: ${FRONTEND_URL}${NC}"

# Test deployments
echo -e "${BLUE}Testing deployments...${NC}"
echo "Testing backend health..."
curl -s "${BACKEND_URL}/health" | jq

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${GREEN}Frontend: ${FRONTEND_URL}${NC}"
echo -e "${GREEN}Backend: ${BACKEND_URL}${NC}" 