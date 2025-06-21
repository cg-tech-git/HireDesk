#!/bin/bash

# Exit on error
set -e

echo "Building and deploying backend with CORS fix..."

# Build the backend image from the backend directory
cd packages/backend
docker build -t gcr.io/hiredesk/hiredesk-backend:cors-fix .

# Push to GCR
docker push gcr.io/hiredesk/hiredesk-backend:cors-fix

# Deploy to Cloud Run
gcloud run deploy hiredesk-backend \
  --image gcr.io/hiredesk/hiredesk-backend:cors-fix \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances hiredesk:us-central1:hiredesk-db \
  --update-env-vars NODE_ENV=production,DATABASE_HOST=/cloudsql/hiredesk:us-central1:hiredesk-db,DATABASE_NAME=hiredesk_dev,DATABASE_USER=hiredesk_user,DATABASE_PASSWORD='secure_password_123!',DEMO_MODE=true

echo "Backend deployed with CORS fix!" 