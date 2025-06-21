#!/bin/bash

# Exit on error
set -e

echo "Building and deploying frontend with number formatting fix..."

# Build the frontend image from the root directory
docker build --platform linux/amd64 -t gcr.io/hiredesk/hiredesk-frontend:format-fix -f packages/frontend/Dockerfile .

# Push to GCR
docker push gcr.io/hiredesk/hiredesk-frontend:format-fix

# Deploy to Cloud Run
gcloud run deploy hiredesk-frontend \
  --image gcr.io/hiredesk/hiredesk-frontend:format-fix \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://hiredesk-backend-544256061771.us-central1.run.app/api

echo "Frontend deployed with number formatting fix!" 