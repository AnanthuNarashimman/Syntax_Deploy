# Firebase Credentials Configuration

## How It Works

### Local Development (Your Computer)
```
.env file contains:
SECURITY_KEY="../syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json"

→ Firebase config loads credentials from file
→ Works as before, no changes needed
```

### Production (Google Cloud Run)
```
Secret Manager contains:
FIREBASE_SERVICE_ACCOUNT = <entire JSON content>

→ Cloud Run injects JSON content as environment variable
→ Firebase config parses JSON from environment variable
→ No file needed in container
```

---

## How You Already Set This Up

### Step 1: Created Secret in Secret Manager ✓
You uploaded the JSON file to Secret Manager:
```
Name: FIREBASE_SERVICE_ACCOUNT
Content: <entire syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json>
```

### Step 2: Configured Cloud Run to Inject Secret ✓
In Cloud Run deployment settings:
```
Secrets → Reference a Secret:
- Secret: FIREBASE_SERVICE_ACCOUNT
- Version: latest
- Mount as: Environment variable
- Variable name: FIREBASE_SERVICE_ACCOUNT
```

### Step 3: Updated Firebase Config ✓ (Just Now)
The code now checks:
1. If `FIREBASE_SERVICE_ACCOUNT` env var exists → Use it (production)
2. Else if `SECURITY_KEY` env var exists → Load from file (local)
3. Else → Exit with error

---

## Testing

### Test Locally (No Changes)
```bash
# Your .env file still has:
SECURITY_KEY="../syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json"

# Run as usual:
node server.js

# Should see:
✓ Firebase credentials loaded from file (local development)
```

### Test on Cloud Run
```bash
# After deployment, check logs
# Should see:
✓ Firebase credentials loaded from environment variable (production)
```

---

## What Happens During Deployment

### GitHub → Cloud Run Deployment:
```
1. GitHub has your code (NO JSON file - it's in .gitignore)
2. Cloud Build builds Docker image from GitHub code
3. Docker image does NOT contain JSON file
4. Cloud Run starts container
5. Cloud Run injects FIREBASE_SERVICE_ACCOUNT from Secret Manager
6. Your app parses JSON from environment variable
7. Firebase connects successfully ✓
```

### Security Benefits:
- ✅ JSON file never in Git history
- ✅ JSON file never in Docker image
- ✅ Credentials stored securely in Secret Manager
- ✅ Only authorized services can access secrets
- ✅ Can rotate credentials without rebuilding app

---

## Verification Checklist

Before deploying, verify:

1. **Secret Manager has the JSON content:**
   - Go to Secret Manager in GCP Console
   - Click `FIREBASE_SERVICE_ACCOUNT`
   - Click "VERSIONS" tab
   - Verify "latest" version exists

2. **Cloud Run is configured to inject the secret:**
   - During deployment (Step 8 in my guide)
   - Under "Variables & Secrets" tab
   - Add secret reference: `FIREBASE_SERVICE_ACCOUNT`

3. **Local .env still works:**
   ```bash
   # .env file contains:
   SECURITY_KEY="../syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json"
   
   # Test:
   node server.js
   ```

4. **JSON file is in .gitignore:**
   ```bash
   # Check .gitignore contains:
   syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json
   ```

---

## Troubleshooting

### Error: "No Firebase credentials found"
**Cause**: Neither environment variable nor file path is set
**Solution**: 
- Local: Check `.env` has `SECURITY_KEY`
- Cloud Run: Check secret is referenced in deployment settings

### Error: "Failed to parse FIREBASE_SERVICE_ACCOUNT"
**Cause**: Secret content is not valid JSON
**Solution**: Re-create secret with correct JSON file

### Error: "ENOENT: no such file or directory"
**Cause**: Local file path is wrong
**Solution**: Check path in `.env` is correct relative to backend folder

---

## Alternative: Local File Method (Not Recommended)

If you want to include the JSON file in Docker (less secure):

```dockerfile
# In Dockerfile (NOT RECOMMENDED for Git-based deployments)
COPY syntax-477e1-firebase-adminsdk-fbsvc-808b90a2ab.json ./
```

**Problems:**
- ❌ File must be in Git repo (security risk)
- ❌ File baked into Docker image (harder to rotate)
- ❌ Less secure than Secret Manager

**When to use:**
- Only for manual local Docker builds
- Never for Git-based CI/CD

---

## Summary

**Before my fix:**
- Dockerfile tried to COPY JSON file
- File doesn't exist in Git
- Build would fail ❌

**After my fix:**
- Dockerfile doesn't copy JSON file
- JSON content comes from Secret Manager environment variable
- Works with Git-based deployments ✓
- More secure ✓
- Local development still works ✓
