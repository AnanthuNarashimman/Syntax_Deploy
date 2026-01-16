# 🚀 Quick Start: Deploy to GCP in 10 Minutes

## Prerequisites (5 minutes)
1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Install Docker Desktop: https://www.docker.com/products/docker-desktop
3. Create GCP account and project

## Deployment (5 minutes)

### Step 1: Install and Authenticate
```powershell
# Install gcloud CLI (if not already installed)
# Download from: https://cloud.google.com/sdk/docs/install-sdk#windows

# Authenticate
gcloud auth login

# Set your project (replace with your PROJECT_ID)
gcloud config set project YOUR_PROJECT_ID

# Enable required services
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 2: Create Secrets
```powershell
# Create secrets from your .env file
echo -n "YOUR_JWT_SECRET" | gcloud secrets create JWT_SECRET --data-file=-
echo -n "YOUR_SESSION_SECRET" | gcloud secrets create SESSION_SECRET --data-file=-
echo -n "YOUR_RAPIDAPI_KEY" | gcloud secrets create JUDGE0_RAPIDAPI_KEY --data-file=-

# Upload Firebase service account
gcloud secrets create FIREBASE_SERVICE_ACCOUNT --data-file=syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json
```

### Step 3: Deploy
```powershell
# Deploy to Cloud Run (ONE COMMAND!)
gcloud run deploy syntax-backend `
  --source . `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10 `
  --min-instances 0 `
  --timeout 300 `
  --set-env-vars "NODE_ENV=production,FRONTEND_URL=https://your-frontend-url.com" `
  --set-secrets "JWT_SECRET=JWT_SECRET:latest,SESSION_SECRET=SESSION_SECRET:latest,JUDGE0_RAPIDAPI_KEY=JUDGE0_RAPIDAPI_KEY:latest,FIREBASE_SERVICE_ACCOUNT=FIREBASE_SERVICE_ACCOUNT:latest"

# Get your service URL
gcloud run services describe syntax-backend --region us-central1 --format 'value(status.url)'
```

### Step 4: Test
```powershell
# Test health endpoint
curl https://YOUR-SERVICE-URL.run.app/health

# Test API endpoint
curl https://YOUR-SERVICE-URL.run.app/api/auth/login
```

---

## Cold Start Solution (Choose One)

### Option 1: Set Minimum Instances (No Cold Starts)
**Cost**: ~$5-7/month | **Cold Start**: 0 seconds
```powershell
gcloud run services update syntax-backend --min-instances 1 --region us-central1
```

### Option 2: Cloud Scheduler Warm-Up (Free)
**Cost**: $0 | **Cold Start**: 2-5 seconds (first request only)
```powershell
# Create a job that pings your API every 5 minutes
gcloud scheduler jobs create http keep-warm `
  --schedule "*/5 * * * *" `
  --uri "https://YOUR-SERVICE-URL.run.app/health" `
  --http-method GET `
  --location us-central1
```

### Option 3: Accept Cold Starts (Free)
**Cost**: $0 | **Cold Start**: 2-5 seconds (after 15 min inactivity)
- Do nothing - Cloud Run scales to zero
- First request after idle wakes up container (2-5 sec delay)
- Subsequent requests are instant

---

## Update Frontend

In your React frontend, update the API base URL:

```javascript
// Before (local)
const API_URL = 'http://localhost:5000';

// After (production)
const API_URL = 'https://YOUR-SERVICE-URL.run.app';
```

Or use environment variables:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

Then set `REACT_APP_API_URL=https://YOUR-SERVICE-URL.run.app` in Vercel/Netlify.

---

## Monitoring

View logs in real-time:
```powershell
gcloud run services logs tail syntax-backend --region us-central1
```

View in GCP Console:
https://console.cloud.google.com/run

---

## Troubleshooting

### Issue: Deployment fails
```powershell
# Check logs
gcloud run services logs read syntax-backend --region us-central1 --limit 50

# Rebuild with verbose output
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/syntax-backend
```

### Issue: CORS errors
Update FRONTEND_URL:
```powershell
gcloud run services update syntax-backend `
  --update-env-vars FRONTEND_URL=https://your-actual-frontend.com `
  --region us-central1
```

### Issue: Cold starts too slow
Enable minimum instances:
```powershell
gcloud run services update syntax-backend --min-instances 1 --region us-central1
```

---

## Cost Estimates

| Setup | Monthly Cost | Cold Start |
|-------|-------------|------------|
| Free Tier (scales to zero) | $0 | 2-5 sec |
| Min Instances = 1 | $5-7 | 0 sec |
| High Traffic (auto-scale) | $15-25 | Rare |

**Recommendation**: Start with free tier, upgrade to min-instances=1 when traffic increases.

---

## Next Steps

1. ✅ Deploy backend to Cloud Run
2. ✅ Test all API endpoints
3. ✅ Update frontend API URL
4. ✅ Choose cold start strategy
5. ✅ Set up monitoring alerts
6. ⬜ Configure custom domain (optional)

---

**Full documentation**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
