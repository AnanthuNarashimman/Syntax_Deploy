# 🚀 GCP Deployment Guide for Syntax Backend

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Cold Start Information](#cold-start-information)
3. [Setup Instructions](#setup-instructions)
4. [Deployment Steps](#deployment-steps)
5. [Environment Variables](#environment-variables)
6. [Cost Optimization](#cost-optimization)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Prerequisites

### 1. Install Google Cloud SDK
```bash
# Windows (PowerShell)
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe

# Or use Chocolatey
choco install gcloudsdk

# After installation, initialize
gcloud init
```

### 2. Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop

### 3. Create GCP Project
1. Go to https://console.cloud.google.com
2. Create a new project (e.g., "syntax-backend")
3. Enable billing (required for Cloud Run)
4. Note your PROJECT_ID

### 4. Enable Required APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

---

## Cold Start Information

### What is a Cold Start?
When your Cloud Run service scales to zero (no traffic), the next request will trigger a "cold start" - spinning up a new container instance.

### Cold Start Metrics for Your App:
- **Expected Duration**: 2-5 seconds
- **Frequency**: After ~15 minutes of inactivity
- **Impact**: First request is slower; subsequent requests are fast

### Minimizing Cold Starts:

#### Option 1: Set Minimum Instances (Recommended for Production)
```bash
gcloud run services update syntax-backend \
  --min-instances 1 \
  --region us-central1
```
**Cost**: ~$5-10/month | **Benefit**: Zero cold starts

#### Option 2: Keep Container Warm (Free)
Use a cron job to ping your API every 5 minutes:
```bash
# Using Google Cloud Scheduler (free tier: 3 jobs)
gcloud scheduler jobs create http keep-warm \
  --schedule "*/5 * * * *" \
  --uri "https://your-service-url.run.app/health" \
  --http-method GET
```

#### Option 3: Optimize Dockerfile (Already Done)
- Using slim Node.js image (faster startup)
- Production-only dependencies
- Minimal layers

---

## Setup Instructions

### Step 1: Configure Environment Variables

#### Local Testing (Before Deployment)
```bash
# Test locally with Docker
docker build -t syntax-backend .
docker run -p 8080:8080 --env-file .env syntax-backend
```

#### GCP Secret Manager (Secure Production Secrets)
```bash
# Create secrets in GCP Secret Manager
echo -n "your-jwt-secret-here" | gcloud secrets create JWT_SECRET --data-file=-
echo -n "your-session-secret-here" | gcloud secrets create SESSION_SECRET --data-file=-
echo -n "your-rapidapi-key-here" | gcloud secrets create JUDGE0_RAPIDAPI_KEY --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding JWT_SECRET \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Repeat for other secrets...
```

### Step 2: Update Firebase Service Account Path
Your app currently uses a relative path for Firebase credentials. Update `config/firebase.js` to use environment variable:

```javascript
// Before
const serviceAccount = require("../syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json");

// After (recommended for Cloud Run)
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT || 
  require("fs").readFileSync("./syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json", "utf8")
);
```

Then store Firebase credentials as a secret:
```bash
gcloud secrets create FIREBASE_SERVICE_ACCOUNT --data-file=syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json
```

---

## Deployment Steps

### Method 1: Quick Deploy (Manual)
```bash
# 1. Authenticate
gcloud auth login

# 2. Set project
gcloud config set project YOUR_PROJECT_ID

# 3. Deploy directly (no build step needed)
gcloud run deploy syntax-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,FRONTEND_URL=https://your-frontend-url.com" \
  --set-secrets "JWT_SECRET=JWT_SECRET:latest,SESSION_SECRET=SESSION_SECRET:latest,JUDGE0_RAPIDAPI_KEY=JUDGE0_RAPIDAPI_KEY:latest,FIREBASE_SERVICE_ACCOUNT=FIREBASE_SERVICE_ACCOUNT:latest"

# 4. Get service URL
gcloud run services describe syntax-backend --region us-central1 --format 'value(status.url)'
```

### Method 2: Using Deploy Script (Automated)
```bash
# 1. Edit deploy.sh and set your PROJECT_ID
nano deploy.sh  # or code deploy.sh

# 2. Make script executable (Linux/Mac)
chmod +x deploy.sh

# 3. Run deployment
./deploy.sh

# Windows (PowerShell)
bash deploy.sh  # If Git Bash installed
# Or run commands manually from deploy.sh
```

### Method 3: CI/CD with Cloud Build (Production)
```bash
# 1. Connect your GitHub repo to Cloud Build
# 2. Push to main branch triggers auto-deployment via cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml
```

---

## Environment Variables

### Required Environment Variables:
| Variable | Description | Where to Set |
|----------|-------------|--------------|
| `JWT_SECRET` | JWT signing key | Secret Manager |
| `SESSION_SECRET` | Session encryption key | Secret Manager |
| `JUDGE0_RAPIDAPI_KEY` | Judge0 API key | Secret Manager |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase credentials JSON | Secret Manager |
| `FRONTEND_URL` | Your frontend URL | Cloud Run env var |
| `NODE_ENV` | production | Cloud Run env var |
| `PORT` | 8080 (auto-set by Cloud Run) | Auto-injected |

### Update CORS in server.js:
```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

---

## Cost Optimization

### Free Tier (Cloud Run)
- **2 million requests/month** (free)
- **360,000 GB-seconds/month** (free)
- **180,000 vCPU-seconds/month** (free)

### Your Estimated Costs:
**Scenario 1: Low Traffic (scales to zero)**
- 10,000 requests/month
- **Cost**: $0/month (within free tier)
- Cold starts: Yes (~2-5 seconds)

**Scenario 2: Medium Traffic (min-instances=1)**
- 100,000 requests/month
- 1 instance always running
- **Cost**: ~$5-7/month
- Cold starts: None

**Scenario 3: High Traffic**
- 1 million requests/month
- Auto-scaling 1-10 instances
- **Cost**: ~$15-25/month
- Cold starts: Rare

### Cost Optimization Tips:
1. **Start with min-instances=0** (free, accept cold starts)
2. **Monitor usage** in GCP Console
3. **Upgrade to min-instances=1** when traffic increases
4. **Set max-instances** to prevent runaway costs
5. **Use Cloud Scheduler** for free warming

---

## Monitoring & Troubleshooting

### View Logs:
```bash
# Real-time logs
gcloud run services logs tail syntax-backend --region us-central1

# Recent logs in console
# https://console.cloud.google.com/run/detail/REGION/SERVICE_NAME/logs
```

### Check Service Status:
```bash
gcloud run services describe syntax-backend --region us-central1
```

### Common Issues:

#### 1. Cold Start Too Slow (>5 seconds)
**Solution**: Enable min-instances=1
```bash
gcloud run services update syntax-backend --min-instances 1 --region us-central1
```

#### 2. Firebase Connection Errors
**Solution**: Ensure service account has proper permissions
```bash
# Check IAM roles in GCP Console
# Service account needs: Cloud Run Admin, Secret Manager Accessor
```

#### 3. CORS Errors
**Solution**: Update FRONTEND_URL environment variable
```bash
gcloud run services update syntax-backend \
  --update-env-vars FRONTEND_URL=https://your-actual-frontend.com \
  --region us-central1
```

#### 4. Memory Issues (OOM)
**Solution**: Increase memory allocation
```bash
gcloud run services update syntax-backend --memory 1Gi --region us-central1
```

#### 5. Timeout Errors
**Solution**: Increase timeout (default 300s)
```bash
gcloud run services update syntax-backend --timeout 600 --region us-central1
```

### Health Check Endpoint (Optional):
Add to `server.js`:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

---

## Post-Deployment Checklist

- [ ] Test all API endpoints with your frontend
- [ ] Configure custom domain (optional)
- [ ] Set up Cloud Monitoring alerts
- [ ] Configure Cloud Scheduler for warm-up (if not using min-instances)
- [ ] Update frontend API URL to Cloud Run URL
- [ ] Test proctoring features (fullscreen, violations)
- [ ] Verify Judge0 integration works
- [ ] Test quiz and contest submissions
- [ ] Monitor cold start times in Logs
- [ ] Review costs in Billing Console

---

## Custom Domain Setup (Optional)

```bash
# 1. Verify domain ownership in GCP
gcloud domains verify yourdomain.com

# 2. Map domain to Cloud Run
gcloud run domain-mappings create --service syntax-backend --domain api.yourdomain.com --region us-central1

# 3. Update DNS records (provided by GCP)
# Add the provided A and AAAA records to your DNS provider
```

---

## Useful Commands

```bash
# View all Cloud Run services
gcloud run services list

# Delete service
gcloud run services delete syntax-backend --region us-central1

# Update service configuration
gcloud run services update syntax-backend --memory 1Gi --region us-central1

# View service URL
gcloud run services describe syntax-backend --region us-central1 --format 'value(status.url)'

# Test deployment locally
docker build -t syntax-backend . && docker run -p 8080:8080 --env-file .env syntax-backend
```

---

## Support & Resources

- **GCP Cloud Run Docs**: https://cloud.google.com/run/docs
- **Pricing Calculator**: https://cloud.google.com/products/calculator
- **Cloud Run Quotas**: https://cloud.google.com/run/quotas
- **Secret Manager**: https://cloud.google.com/secret-manager/docs

---

## Security Best Practices

1. ✅ **Never commit `.env` file** (already in .gitignore)
2. ✅ **Use Secret Manager** for sensitive data (JWT, API keys)
3. ✅ **Enable Cloud Armor** for DDoS protection (optional, costs extra)
4. ✅ **Use IAM roles** for service-to-service auth
5. ✅ **Enable Cloud Audit Logs** for compliance
6. ✅ **Restrict `--allow-unauthenticated`** if API needs auth only

---

**Need help?** Check GCP Console logs or contact support.
