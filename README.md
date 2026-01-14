# Syntax 🎯

![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React Version](https://img.shields.io/badge/react-18.x-blue.svg)
![Firebase](https://img.shields.io/badge/firebase-10.x-orange.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**An enterprise-grade quiz and coding contest platform with advanced proctoring, real-time leaderboards, and comprehensive contest management for educational institutions.**

---

## 📋 Overview

**Syntax** is a production-ready, full-stack web application designed for educational institutions to conduct secure coding contests and quizzes. The platform features **real-time proctoring**, **encrypted submission handling**, **live code execution**, and a **comprehensive role-based access control system** with three distinct user hierarchies.

Built with security and scalability in mind, Syntax provides educators with powerful tools to create, monitor, and manage competitive programming contests while offering students a seamless and secure testing environment.

---

## 🌟 Key Highlights

- **🔐 Secure Contest Environment** - Military-grade encryption for submissions with anti-tampering measures
- **👁️ Real-time Proctoring** - Automated violation detection with tab switching, window blur, and fullscreen monitoring
- **⚡ Live Code Execution** - Support for Python, Java, C++, C, and JavaScript with Judge0 integration
- **📊 Real-time Leaderboards** - Dynamic participant rankings with advanced filtering and Excel export
- **🛡️ Exam Mode** - Strict proctoring with automatic submission on violations
- **🔄 Contest Failsafe** - Admin ability to reopen contests for students with network issues
- **📈 Advanced Analytics** - Comprehensive tracking of submissions, violations, and performance metrics

---

## ✨ Core Features

### 🎓 For Students

#### **Contest Participation**
- **Multi-language Support**: Write solutions in Python, Java, C++, C, or JavaScript
- **Real-time Code Execution**: Test code against sample test cases instantly
- **Secure Submission System**: Encrypted submissions with RSA asymmetric encryption
- **Auto-save Progress**: Automatic backup of code with resume capability
- **Timer Management**: Visual countdown with auto-submit on time expiration
- **Problem Navigation**: Easy switching between multiple contest problems
- **Syntax Highlighting**: Monaco Editor integration for professional coding experience

#### **Quiz System**
- **Interactive MCQ Interface**: Clean, intuitive multiple-choice question interface
- **Instant Feedback**: Immediate validation of answers
- **Progress Tracking**: Visual indicators for answered and pending questions
- **Time Warnings**: Alerts when time is running low
- **Result Dashboard**: Detailed score breakdown with correct/incorrect answers

#### **Educational Resources**
- **Practice Articles**: Browse curated programming tutorials and guides
- **Contest History**: View past performance and submission details
- **Skills Tracking**: Monitor progress across different programming topics
- **Leaderboard**: Global rankings and peer comparison

#### **Security Features**
- **Proctoring Compliance**: Real-time monitoring in strict exam mode
- **Violation Warnings**: Clear notifications for policy violations
- **Auto-submission**: Automatic submission on repeated violations or time expiration
- **Secure Session**: JWT-based authentication with session management

---

### 👨‍💼 For Admins

#### **Contest Management**
- **Contest Creation Wizard**: Step-by-step interface for creating quizzes and coding contests
- **Flexible Scheduling**: Queue contests for future dates or start immediately
- **Duration Control**: Set custom time limits from minutes to hours
- **Mode Selection**: Choose between Practice Mode and Strict Exam Mode
- **Department Filtering**: Restrict contests to specific departments
- **Topic Tagging**: Organize contests by programming topics
- **Bulk Import**: Import student data via Excel for quick onboarding

#### **Quiz Builder**
- **Custom Questions**: Create multiple-choice questions with 4 options
- **Point Assignment**: Set individual point values per question
- **Answer Key Management**: Define correct answers with validation
- **Question Bank**: Reuse and manage question templates
- **Preview Mode**: Test quiz flow before publishing

#### **Coding Contest Designer**
- **Problem Configuration**: Define problem statements with input/output formats
- **Test Case Management**: Add visible example cases and hidden test cases
- **Starter Code**: Provide language-specific boilerplate code
- **Point Distribution**: Assign different point values per problem
- **Multi-problem Contests**: Create contests with multiple coding challenges
- **Problem Code Assignment**: Unique identifiers for each problem (e.g., PROB1, PROB2)

#### **Live Contest Monitoring**
- **Real-time Dashboard**: View active contests with live participant counts
- **Status Tracking**: Monitor ongoing, queued, and completed events
- **Quick Actions**: Start, end, or modify contests with one click
- **Participant Insights**: See who's participating in real-time
- **Contest Search**: Filter contests by title, status, or type

#### **Participant Management**
- **Detailed Leaderboards**: View comprehensive participant data with scores
- **Advanced Filtering**: Filter by department, year, section, or search by name/email
- **Sortable Columns**: Sort by score, submission time, or any field
- **Excel Export**: Download complete participant data with one click
- **Proctoring Logs**: View violation history for each participant
- **Contest Reopening**: Failsafe to allow students to retake due to technical issues

#### **Proctoring Oversight**
- **Violation Dashboard**: View all proctoring violations for a contest
- **Student-specific Logs**: Track individual student violation patterns
- **Violation Details**: See timestamps, types, and severity of violations
- **Warning Count**: Track how many warnings each student received
- **Evidence Trail**: Complete audit log for academic integrity

#### **Student Administration**
- **User Management**: Create, edit, and delete student accounts
- **Account Status**: Ban or unban students as needed
- **Bulk Operations**: Import hundreds of students via Excel
- **Profile Management**: Update student information and departments
- **Activity Monitoring**: Track student participation history

#### **Content Management**
- **Article Creation**: Write and publish educational articles
- **Rich Text Editor**: Format articles with headings, lists, and code blocks
- **Content Organization**: Categorize articles by topics
- **Version Control**: Edit and update published articles
- **Delete Management**: Remove outdated or incorrect content

---

### 🔑 For Super Admins

#### **Admin Hierarchy Management**
- **Admin Creation**: Create new admin accounts with secure credentials
- **Admin Removal**: Delete admin accounts when access needs to be revoked
- **Role Verification**: View list of all admins with their details
- **Access Control**: Manage admin permissions and capabilities

#### **Database Operations**
- **Contest Deletion**: Permanently remove contests from the database
- **Data Cleanup**: Clean up old or test data
- **System Maintenance**: Perform database optimization tasks
- **Audit Trails**: View comprehensive logs of all admin actions

#### **Platform Oversight**
- **Global Dashboard**: View all contests across all admins
- **System Metrics**: Monitor platform usage and performance
- **Cross-admin Management**: Oversee contests created by any admin
- **Emergency Controls**: Take emergency actions when needed

---

## 🚀 Technology Stack

### **Frontend**
- **⚛️ React.js 18** - Modern UI with hooks and context API
- **🎨 CSS3** - Custom styling with responsive design
- **🖥️ Monaco Editor** - VSCode-powered code editor
- **📊 XLSX** - Excel file generation for exports
- **🔐 Crypto-JS** - Client-side encryption for submissions
- **🎯 Lucide React** - Modern icon library
- **🛣️ React Router** - Client-side routing
- **📡 Axios** - HTTP client for API calls

### **Backend**
- **🟢 Node.js** - JavaScript runtime
- **⚡ Express.js** - Web application framework
- **🔥 Firebase Admin SDK** - Database and authentication
- **🔐 JWT** - Secure token-based authentication
- **🍪 Cookie Parser** - Secure cookie handling
- **🔒 Bcrypt** - Password hashing
- **📦 Multer** - File upload handling
- **⚙️ CORS** - Cross-origin resource sharing

### **Database**
- **🔥 Firebase Firestore** - NoSQL cloud database with real-time capabilities
  - Collections: `users`, `events`, `eventAttempts`, `eventResults`, `userSubmissions`, `proctoringLogs`, `articles`
  - Subcollections: `users/{userId}/contestResults`, `users/{userId}/quizResults`
  - Indexes: Optimized queries for leaderboards and search

### **Code Execution**
- **⚖️ Judge0 CE** - Secure code compilation and execution
- **Languages**: Python, Java, C++, C, JavaScript
- **Sandboxing**: Isolated execution environment
- **Resource Limits**: CPU and memory constraints

### **Security**
- **🔐 RSA Encryption** - Asymmetric encryption for submissions
- **🔑 JWT Tokens** - Secure authentication with httpOnly cookies
- **🛡️ CORS Protection** - Whitelist-based origin validation
- **🔒 Password Hashing** - Bcrypt with salt rounds
- **🚫 XSS Prevention** - Input sanitization and validation

---

## 📊 Database Architecture

### **Collections**

#### **users**
- User profiles (students, admins, super admins)
- Fields: `userId`, `userName`, `email`, `department`, `year`, `section`, `totalScore`, `isAdmin`, `isSuperAdmin`, `isBanned`

#### **events**
- Contest and quiz definitions
- Fields: `eventId`, `eventTitle`, `eventType`, `eventMode`, `active`, `durationMinutes`, `questions/problems`, `participants`

#### **eventAttempts**
- Active contest sessions
- Fields: `userId`, `eventId`, `status`, `started_at`, `ends_at`, `encryptionKey`

#### **eventResults**
- Completed contest submissions
- Fields: `userId`, `eventId`, `points`, `submittedAt`, `results`

#### **proctoringLogs**
- Proctoring violation records
- Document ID: `{userId}_{eventId}`
- Fields: `violations` (array of violation events with timestamps)

#### **userSubmissions**
- Aggregate submission tracking
- Fields: `userId`, `totalScore`, `submissions`, `submissionCount`

---

## 🔒 Security Features

### **Authentication & Authorization**
- JWT-based authentication with httpOnly cookies
- Role-based access control (Student, Admin, Super Admin)
- Middleware protection on all sensitive routes
- Session timeout and automatic logout

### **Data Encryption**
- **RSA-2048 Encryption**: All contest submissions encrypted on client
- **Public/Private Key Pair**: Backend decrypts with private key
- **Key Exchange**: Secure key distribution per contest session
- **Anti-tampering**: Submissions verified against encrypted payload

### **Proctoring System**
- **Tab Switching Detection**: Alerts when user leaves the contest tab
- **Window Blur Detection**: Detects when contest window loses focus
- **Fullscreen Enforcement**: Requires fullscreen mode in strict contests
- **Violation Logging**: All violations stored with timestamps
- **Graduated Warnings**: Progressive warnings before auto-submission
- **Admin Visibility**: Complete violation audit trail for admins

### **Submission Integrity**
- **Idempotency Tokens**: Prevent duplicate submissions
- **Timestamp Verification**: Validate submission timing
- **Encrypted Storage**: Code stored encrypted until evaluation
- **Backend Validation**: All test case execution on secure backend

---

## 🎯 Contest Modes

### **Practice Mode**
- Relaxed environment for learning
- No proctoring enforcement
- Students can leave and return
- Flexible time management
- Ideal for homework and practice sessions

### **Strict Exam Mode**
- Full proctoring enforcement
- Fullscreen required
- Tab switch detection
- Automatic submission on violations (configurable threshold)
- Designed for formal assessments and exams
- Complete violation logging for academic integrity

---

## 📈 Features in Detail

### **Real-time Leaderboards**
- **Live Updates**: Participant list updates as submissions come in
- **Smart Filtering**: Filter by department, year, section
- **Search Capability**: Find specific students by name or email
- **Sortable Columns**: Sort by score, submission time, or any field
- **Participant Count**: See total participants at a glance
- **Excel Export**: Download complete data including:
  - Student names, emails, departments
  - Scores and submission timestamps
  - Violation counts (if applicable)

### **Contest Reopening (Failsafe)**
- **Admin Initiated**: Admins can reopen contests for individual students
- **Complete Reset**: Deletes previous submission and resets status to "not_started"
- **Score Reversion**: Automatically reverts the student's score
- **Clean Slate**: Clears all proctoring logs for the student
- **Confirmation Modal**: Clear warning about the action's consequences
- **Use Cases**:
  - Network disconnection during contest
  - Browser crash or technical issues
  - Accidental auto-submission
  - Hardware failure

### **Proctoring Dashboard**
- **View Logs**: Click on any participant to see their violation history
- **Violation Timeline**: Chronological list of all violations
- **Violation Types**:
  - Tab switch (severity level)
  - Window blur
  - Fullscreen exit
  - Copy attempt
  - Paste attempt
- **Timestamps**: Exact time of each violation
- **Warning Count**: Total warnings issued before auto-submission

### **Code Execution Engine**
- **Multi-language Support**: Python 3, Java, C++17, C11, JavaScript (Node.js)
- **Test Case Validation**: Run code against visible and hidden test cases
- **Performance Metrics**: Execution time and memory usage
- **Error Handling**: Compilation errors and runtime errors with stack traces
- **Resource Limits**: Prevent infinite loops and memory exhaustion
- **Secure Sandboxing**: Isolated execution environment

### **Submission Encryption Flow**
1. Student writes code and clicks "Submit"
2. Code is encrypted with RSA public key on client
3. Encrypted payload sent to backend with problem metadata
4. Backend decrypts with private key
5. Code executed against test cases
6. Results calculated and stored encrypted
7. Final submission stored in multiple locations for redundancy

---

## 🎨 User Interface

### **Student Dashboard**
- Clean, modern interface with card-based layout
- Active contests prominently displayed
- Quick access to practice articles
- Profile summary with statistics
- Responsive design for all screen sizes

### **Admin Dashboard**
- Comprehensive contest management interface
- Real-time statistics and participant counts
- Quick action buttons (Start, End, View, Participants)
- Search and filter capabilities
- Status badges (Live, Queue, Completed)

### **Contest Page**
- Split-screen layout: problem on left, code editor on right
- Problem selector for multi-problem contests
- Syntax highlighting in Monaco Editor
- Resizable panels for user preference
- Output console with test case results
- Timer with visual countdown
- Submit button with confirmation

### **Quiz Interface**
- Question-by-question navigation
- Progress indicator
- Clear answer selection
- Previous/Next navigation
- Submit confirmation modal

---

## 👥 User Roles & Permissions Matrix

| Feature | Student | Admin | Super Admin |
|---------|---------|-------|-------------|
| Take Quizzes | ✅ | ✅ | ✅ |
| Participate in Contests | ✅ | ✅ | ✅ |
| View Articles | ✅ | ✅ | ✅ |
| Create Contests/Quizzes | ❌ | ✅ | ✅ |
| Manage Students | ❌ | ✅ | ✅ |
| View Leaderboards | ❌ | ✅ | ✅ |
| View Proctoring Logs | ❌ | ✅ | ✅ |
| Reopen Contests | ❌ | ✅ | ✅ |
| Start/End Contests | ❌ | ✅ | ✅ |
| Create Articles | ❌ | ✅ | ✅ |
| Manage Admins | ❌ | ❌ | ✅ |
| Delete Contests (DB) | ❌ | ❌ | ✅ |
| Platform Oversight | ❌ | ❌ | ✅ |

---

## 🚀 Development Status

### ✅ **Production-Ready Features**

#### **Authentication & Authorization**
- ✔️ JWT-based authentication with secure cookie handling
- ✔️ Three-tier role-based access control
- ✔️ Password hashing with bcrypt
- ✔️ Session management and timeout
- ✔️ Middleware protection on all routes

#### **Contest System**
- ✔️ Complete quiz creation and management
- ✔️ Full coding contest functionality
- ✔️ Multi-language code execution (Python, Java, C++, C, JS)
- ✔️ Test case management (visible and hidden)
- ✔️ Real-time code execution with Judge0
- ✔️ Encrypted submission handling
- ✔️ Auto-save and resume functionality
- ✔️ Timer management with auto-submission

#### **Proctoring System**
- ✔️ Real-time violation detection
- ✔️ Tab switching monitoring
- ✔️ Fullscreen enforcement
- ✔️ Window blur detection
- ✔️ Comprehensive logging with timestamps
- ✔️ Admin violation dashboard
- ✔️ Graduated warning system

#### **Admin Features**
- ✔️ Contest creation wizard
- ✔️ Live contest monitoring
- ✔️ Start/End contest controls
- ✔️ Participant management dashboard
- ✔️ Real-time leaderboards with filtering
- ✔️ Excel export functionality
- ✔️ Proctoring log viewer
- ✔️ Contest reopening failsafe
- ✔️ Student account management
- ✔️ Bulk student import via Excel
- ✔️ Article management system

#### **Super Admin Features**
- ✔️ Admin account creation and management
- ✔️ Cross-admin contest visibility
- ✔️ Database-level contest deletion
- ✔️ Platform-wide oversight dashboard

#### **Security & Performance**
- ✔️ RSA-2048 encryption for submissions
- ✔️ Anti-tampering measures
- ✔️ CORS protection with whitelisting
- ✔️ Input validation and sanitization
- ✔️ Caching for improved performance
- ✔️ Optimized Firestore queries
- ✔️ Connection pooling

#### **User Experience**
- ✔️ Responsive design for all screen sizes
- ✔️ Monaco Editor integration
- ✔️ Syntax highlighting
- ✔️ Real-time error feedback
- ✔️ Toast notifications
- ✔️ Loading states and skeletons
- ✔️ Confirmation modals
- ✔️ Empty state designs

---

### 🔮 **Future Enhancements**

#### **Analytics & Reporting**
- 📊 Advanced performance analytics
- 📈 Student progress tracking over time
- 📉 Difficulty analysis per problem
- 📊 Department-wise statistics
- 📊 Topic-wise performance metrics

#### **Communication**
- 📧 Email notifications for contest start/end
- 📲 Contest reminders
- 💬 In-app announcements
- 📢 Broadcast messages to participants

#### **Advanced Features**
- 🏆 Badges and achievements system
- 🎖️ Global ranking system
- 👥 Team-based contests
- 🔄 Contest templates
- 📝 Automated grading with partial scoring
- 🔍 Plagiarism detection
- 💾 Contest cloning
- 📅 Recurring contest schedules

#### **Mobile Support**
- 📱 Progressive Web App (PWA)
- 📲 Native mobile app (React Native)
- 💾 Offline mode support

#### **Integration**
- 🔗 LMS integration (Moodle, Canvas)
- 📊 Google Classroom integration
- 🔐 OAuth support (Google, GitHub)
- 🌐 API for third-party integrations

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- Firebase account with Firestore enabled
- Judge0 CE API access
- npm or yarn package manager

### **Environment Variables**

Create `.env` files in both `backend` and `syntax` directories:

#### **Backend (.env)**
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
JUDGE0_API_URL=your_judge0_api_url
JUDGE0_API_KEY=your_judge0_api_key
```

#### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### **Installation Steps**

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd Syntax
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../syntax
   npm install
   ```

4. **Configure Firebase**
   - Place your Firebase service account key in `backend/`
   - Update `firebase.js` configuration files

5. **Start the development servers**

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   node server.js
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd syntax
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## 🏗️ Project Structure

```
Syntax/
├── backend/
│   ├── config/
│   │   └── firebase.js           # Firebase configuration
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication
│   │   ├── eventController.js    # Contest management
│   │   ├── judgeController.js    # Code execution
│   │   ├── proctoringController.js # Proctoring logs
│   │   ├── profileController.js  # User profiles
│   │   └── studentController.js  # Student operations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── judgeRoutes.js
│   │   ├── proctoringRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── studentRoutes.js
│   │   └── superRoutes.js
│   ├── services/
│   │   ├── authService.js        # Auth business logic
│   │   ├── eventService.js       # Event business logic
│   │   └── validationService.js  # Input validation
│   ├── utils/
│   │   ├── cache.js              # Caching utilities
│   │   ├── cryptoKeys.js         # Encryption keys
│   │   └── passwordUtil.js       # Password hashing
│   ├── server.js                 # Express server setup
│   └── package.json
│
├── syntax/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── StudentNavbar.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── CustomAlert.jsx
│   │   │   └── ProctoringWarning.jsx
│   │   ├── Pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageContest.jsx
│   │   │   ├── CreateContest.jsx
│   │   │   ├── CodingContestPage.jsx
│   │   │   ├── StudentQuiz.jsx
│   │   │   ├── StudentContests.jsx
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   ├── AlertContext.jsx  # Global alerts
│   │   │   └── ContestContext.jsx # Contest state
│   │   ├── hooks/
│   │   │   └── useProctoring.js  # Proctoring logic
│   │   ├── utils/
│   │   │   └── encryption.js     # Client-side encryption
│   │   ├── Styles/
│   │   │   └── PageStyles/       # CSS modules
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Coding Standards**
- Use ESLint and Prettier configurations
- Write descriptive commit messages
- Add comments for complex logic
- Follow existing code structure
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors & Contributors

Developed for educational institutions to conduct secure and fair programming contests and assessments.

---

## 🙏 Acknowledgments

- **Judge0 CE** - For the powerful code execution engine
- **Firebase** - For reliable backend infrastructure
- **Monaco Editor** - For the excellent code editing experience
- **React Community** - For the amazing ecosystem
- **Lucide** - For the beautiful icon set

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review closed issues for solutions

---

## 🔐 Security

- Found a security vulnerability? Please email security concerns directly
- Do not open public issues for security vulnerabilities
- Follow responsible disclosure practices

---

**Built with ❤️ for the education community**
