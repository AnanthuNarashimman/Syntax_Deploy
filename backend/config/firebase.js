const admin = require("firebase-admin");
require("dotenv").config();

// Load service account credentials
// Priority: 1. Environment variable (Cloud Run), 2. File path (local development)
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production: Secret Manager injects JSON as environment variable
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("✓ Firebase credentials loaded from environment variable (production)");
  } catch (error) {
    console.error("✗ Failed to parse FIREBASE_SERVICE_ACCOUNT:", error.message);
    process.exit(1);
  }
} else if (process.env.SECURITY_KEY) {
  // Local development: Load from file path
  try {
    serviceAccount = require(process.env.SECURITY_KEY);
    console.log("✓ Firebase credentials loaded from file (local development)");
  } catch (error) {
    console.error("✗ Failed to load Firebase credentials from file:", error.message);
    process.exit(1);
  }
} else {
  console.error("✗ No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT or SECURITY_KEY");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db, admin }; 