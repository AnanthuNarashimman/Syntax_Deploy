const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");


// Express App Setup and Middleware Configuration
const app = express();

// Trust proxy - required for Cloud Run to correctly detect HTTPS
// Cloud Run's load balancer terminates HTTPS and forwards HTTP to container
// This tells Express to trust X-Forwarded-* headers from the load balancer
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const profileRoutes = require('./routes/profileRoutes');
const studentRoutes = require('./routes/studentRoutes');
const superRoutes = require('./routes/superRoutes');
const validationRoutes = require('./routes/validationRoutes');
const judgeRoutes = require('./routes/judgeRoutes');
const proctoringRoutes = require('./routes/proctoringRoutes');


app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/super-admin', superRoutes);
app.use('/api/student', validationRoutes);
app.use('/api/judge', judgeRoutes);
app.use('/api/proctoring', proctoringRoutes);

// Health check endpoint (for Cloud Run probes and warming)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Syntax Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

// Starting up Express Server
// Cloud Run injects PORT=8080, fallback to 5000 for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access your API at http://localhost:${PORT}`);
  console.log(
    `Current time (IST): ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}`
  );
  console.log("\n--- IMPORTANT CHECKLIST ---");
  console.log(
    "1. Ensure your Firebase `serviceAccountKey.json` is correctly placed or configured."
  );
  console.log(
    "2. Ensure your `.env` file is present and correctly configured with `JWT_SECRET` AND `FRONTEND_URL`."
  );
  console.log(
    "3. Ensure your Firestore `users` collection has test admin/student data with `hashedPassword` and `isAdmin` flags (`isAdmin: true`)."
  );
  console.log(
    "4. Remember to configure your FRONTEND DEVELOPMENT PROXY if your frontend is not on the same port!"
  );
});