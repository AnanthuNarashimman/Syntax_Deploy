#!/bin/bash

# Deployment script for GCP Cloud Run
# Usage: ./deploy.sh

set -e  # Exit on error

# Configuration
PROJECT_ID="your-gcp-project-id"  # CHANGE THIS
SERVICE_NAME="syntax-backend"
REGION="us-central1"  # Change to your preferred region
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting deployment to Google Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Authenticate (if needed)
# gcloud auth login

# Set project
gcloud config set project $PROJECT_ID

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME:latest .

echo "⬆️  Pushing image to Google Container Registry..."
docker push $IMAGE_NAME:latest

# Deploy to Cloud Run
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "JWT_SECRET=JWT_SECRET:latest,SESSION_SECRET=SESSION_SECRET:latest,JUDGE0_RAPIDAPI_KEY=JUDGE0_RAPIDAPI_KEY:latest"

echo ""
echo "✅ Deployment complete!"
echo "Your service is now running at:"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
