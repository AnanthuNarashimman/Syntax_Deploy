from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

doc = Document()

# ── Page margins ──────────────────────────────────────────────────────────────
for section in doc.sections:
    section.top_margin    = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin   = Inches(1.15)
    section.right_margin  = Inches(1.15)

BLACK  = RGBColor(0x00, 0x00, 0x00)
DGRAY  = RGBColor(0x22, 0x22, 0x22)
MGRAY  = RGBColor(0x55, 0x55, 0x55)
LGRAY  = RGBColor(0xCC, 0xCC, 0xCC)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
CHBLK  = RGBColor(0x1A, 0x1A, 0x1A)  # near-black for table headers

def set_run_font(run, name="Calibri", size=11, bold=False, color=BLACK, italic=False):
    run.font.name   = name
    run.font.size   = Pt(size)
    run.font.bold   = bold
    run.font.color.rgb = color
    run.font.italic = italic

def para_space(para, before=0, after=0, line=None):
    pf = para.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after  = Pt(after)
    if line:
        pf.line_spacing = Pt(line)

def add_para(text, style="Normal", align=WD_ALIGN_PARAGRAPH.LEFT):
    p = doc.add_paragraph(style=style)
    p.alignment = align
    return p

def h1(text):
    p = add_para("", align=WD_ALIGN_PARAGRAPH.LEFT)
    para_space(p, before=18, after=6)
    run = p.add_run(text.upper())
    set_run_font(run, size=13, bold=True, color=BLACK)
    # bottom border
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "4")
    bottom.set(qn("w:color"), "000000")
    pBdr.append(bottom)
    pPr.append(pBdr)
    return p

def h2(text):
    p = add_para("")
    para_space(p, before=10, after=3)
    run = p.add_run(text)
    set_run_font(run, size=11, bold=True, color=BLACK)
    return p

def h3(text):
    p = add_para("")
    para_space(p, before=6, after=2)
    run = p.add_run(text)
    set_run_font(run, size=10.5, bold=True, color=DGRAY, italic=True)
    return p

def body(text, indent=False):
    p = add_para("")
    para_space(p, before=2, after=4, line=13)
    if indent:
        p.paragraph_format.left_indent = Inches(0.25)
    run = p.add_run(text)
    set_run_font(run, size=10.5, color=DGRAY)
    return p

def bullet(text, level=0):
    p = add_para("", style="Normal")
    para_space(p, before=1, after=1, line=13)
    p.paragraph_format.left_indent   = Inches(0.25 + level * 0.2)
    p.paragraph_format.first_line_indent = Inches(-0.18)
    marker = p.add_run("•  ")
    set_run_font(marker, size=10.5, color=DGRAY)
    content = p.add_run(text)
    set_run_font(content, size=10.5, color=DGRAY)
    return p

def code_block(lines):
    """Render a monospace code/snippet block."""
    for line in lines:
        p = add_para("")
        para_space(p, before=0, after=0, line=11)
        p.paragraph_format.left_indent = Inches(0.3)
        run = p.add_run(line if line else " ")
        set_run_font(run, name="Courier New", size=9, color=RGBColor(0x33,0x33,0x33))
    # trailing space
    sp = add_para("")
    para_space(sp, before=2, after=4)

def shade_row(row, hex_color="EFEFEF"):
    for cell in row.cells:
        tc = cell._tc
        tcPr = tc.get_or_add_tcPr()
        shd = OxmlElement("w:shd")
        shd.set(qn("w:val"), "clear")
        shd.set(qn("w:color"), "auto")
        shd.set(qn("w:fill"), hex_color)
        tcPr.append(shd)

def add_table(headers, rows, col_widths=None):
    """Black-and-white clean table."""
    n_cols = len(headers)
    tbl = doc.add_table(rows=1+len(rows), cols=n_cols)
    tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl.style = "Table Grid"

    # header row
    hdr = tbl.rows[0]
    shade_row(hdr, "1A1A1A")
    for i, h in enumerate(headers):
        cell = hdr.cells[i]
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        run = p.add_run(h)
        set_run_font(run, size=10, bold=True, color=WHITE)
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after  = Pt(3)

    # data rows
    for ri, row_data in enumerate(rows):
        row = tbl.rows[ri + 1]
        fill = "F9F9F9" if ri % 2 == 0 else "FFFFFF"
        shade_row(row, fill)
        for ci, val in enumerate(row_data):
            cell = row.cells[ci]
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(str(val))
            set_run_font(run, size=10, color=DGRAY)
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after  = Pt(2)

    # column widths
    if col_widths:
        for ri2, row2 in enumerate(tbl.rows):
            for ci2, w in enumerate(col_widths):
                row2.cells[ci2].width = Inches(w)

    sp = add_para("")
    para_space(sp, before=4, after=8)
    return tbl

# ══════════════════════════════════════════════════════════════════════════════
#  COVER
# ══════════════════════════════════════════════════════════════════════════════
cover_title = doc.add_paragraph()
cover_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
para_space(cover_title, before=60, after=6)
r = cover_title.add_run("SYNTAX")
set_run_font(r, size=36, bold=True, color=BLACK)

cover_sub = doc.add_paragraph()
cover_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
para_space(cover_sub, before=0, after=4)
r2 = cover_sub.add_run("Technical Architecture & Internal Design Document")
set_run_font(r2, size=14, color=MGRAY)

cover_line = doc.add_paragraph()
cover_line.alignment = WD_ALIGN_PARAGRAPH.CENTER
para_space(cover_line, before=0, after=60)
r3 = cover_line.add_run("Prepared for Technical Review  ·  June 2026")
set_run_font(r3, size=10, color=MGRAY, italic=True)

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
#  1. OVERVIEW
# ══════════════════════════════════════════════════════════════════════════════
h1("1. Overview")
body(
    "Syntax is a full-stack web application built for educational institutions to conduct "
    "coding contests and quizzes with real-time proctoring, multi-language code execution, "
    "and role-based access control. The platform targets the workflow of a typical college "
    "placement or curriculum assessment cycle: an admin creates a contest, students attempt "
    "it under monitored conditions, and results flow automatically into a leaderboard."
)
body(
    "At its core Syntax is an exam engine. It handles secure authentication, time-bound "
    "assessments, isolated code evaluation via a sandboxed judge, active anti-cheating "
    "controls during the contest, and a structured result pipeline that feeds analytics for "
    "administrators. The design deliberately separates these concerns into layered services "
    "so each piece can evolve independently."
)

h2("High-Level Capabilities")
for cap in [
    "Quiz module — MCQ contests with per-question scoring and answer shuffling.",
    "Coding contest module — multi-language problems with visible and hidden test cases.",
    "Proctoring layer — fullscreen enforcement, tab-switch detection, clipboard blocking, "
      "keystroke interception, and auto-submission on repeated violations.",
    "Admin dashboard — contest lifecycle management, bulk student import, violation log viewer, "
      "and exportable leaderboards.",
    "Super-admin tier — cross-admin governance, admin account management, and global data operations.",
    "Practice environment — a free-run code playground (Codeground) and a browsable article library.",
]:
    bullet(cap)

# ══════════════════════════════════════════════════════════════════════════════
#  2. TECHNOLOGY STACK & DECISIONS
# ══════════════════════════════════════════════════════════════════════════════
h1("2. Technology Stack and Decision Rationale")
body(
    "Every layer of the stack was chosen to serve a specific operational constraint of an "
    "assessment platform: high-concurrency I/O, flexible data shapes, predictable infrastructure "
    "cost under load, and stateless scalability. The sections below walk through each choice "
    "alongside the alternative that was evaluated and why it was ruled out."
)

# 2.1 Backend Runtime
h2("2.1  Backend Runtime — Node.js over Python")
body(
    "An assessment platform is overwhelmingly I/O-bound. At peak, the server juggles hundreds "
    "of simultaneous requests: contest submissions landing at the same second, Judge0 polling "
    "calls, proctoring violation logs, and leaderboard reads. Node.js handles this workload "
    "through its event-driven, non-blocking I/O model powered by the libuv library. A single "
    "thread dispatches work onto the OS event loop; while one request waits on a Firestore "
    "response, the thread is free to begin the next."
)
body(
    "Python frameworks such as Flask or Django rely on synchronous execution or WSGI-level "
    "threading. Under concurrent load this introduces thread contention and higher memory "
    "overhead per request. For an application where 100+ students may submit code within the "
    "same minute, Node's concurrency model is a structural advantage, not just a performance "
    "preference."
)

# 2.2 Database
h2("2.2  Database — Firebase Firestore over Relational SQL")
body(
    "Assessment data is heterogeneous. A quiz event stores MCQ questions with four options and "
    "a correct-answer key. A coding contest stores problem statements, example I/O, open test "
    "cases, hidden test cases, per-language starter code, point values, and constraint text. "
    "A proctoring log is a timestamped array of typed violations. Forcing all of this into a "
    "fixed relational schema produces either a heavily normalised model with costly joins or a "
    "wide table with many nullable columns."
)
body(
    "Firestore's document model accommodates these variable shapes naturally. Each event document "
    "holds whatever fields its type needs; the application code, not the database schema, enforces "
    "structure. Firestore also functions as a backend-as-a-service, bundling real-time listeners, "
    "horizontal scaling, and integrated hosting under a single managed offering, which removes the "
    "operational overhead of running and patching a database server."
)

# 2.3 Code Execution
h2("2.3  Code Execution Engine — Self-Hosted Judge0 over Managed API")
body(
    "Code execution was the most cost-sensitive decision. A managed Judge0 instance on RapidAPI "
    "bills per submission. For an assessment where each student may run dozens of test executions "
    "across five problems before a final submission, per-request costs compound quickly and become "
    "unpredictable at scale."
)
body(
    "The alternative is self-hosting the open-source Judge0 CE engine on a Hostinger VPS. This "
    "converts variable per-execution cost into a flat monthly infrastructure fee regardless of "
    "submission volume. The trade-off is an initial setup overhead, but for a platform designed "
    "to grow, the economics strongly favour the fixed-cost model. The self-hosted instance also "
    "gives full control over resource limits, supported language versions, and uptime SLAs."
)
body(
    "Note: the current deployment uses Judge0 via RapidAPI as a starting configuration. The "
    "architecture is designed so the JUDGE0_HOST environment variable can be switched to a "
    "self-hosted endpoint without touching application code."
)

# 2.4 Auth
h2("2.4  Authentication — JWT over Server-Side Sessions")
body(
    "Authentication happens on every protected request. During an active contest, a student's "
    "browser fires requests for test execution, proctoring logs, and submission saves in rapid "
    "succession. A session-based approach would require a database lookup on each of these to "
    "validate the session ID."
)
body(
    "JWT eliminates that lookup. The server signs a compact token at login, and every subsequent "
    "request is verified by checking the HMAC signature locally — a pure CPU operation with no "
    "I/O. For a time-sensitive exam environment, this reduces per-request latency in the critical "
    "path. Tokens are stored in httpOnly cookies (not localStorage) so they are invisible to "
    "JavaScript, which removes the XSS attack surface entirely."
)

# 2.5 Frontend
h2("2.5  Frontend Framework — React over Vanilla JS")
body(
    "The assessment UI requires managing several live states concurrently: a countdown timer, "
    "the active Monaco editor buffer, real-time test case result panels, a proctoring violation "
    "counter, and problem navigation state. Coordinating this in vanilla JS or server-rendered "
    "templates would require careful manual DOM management."
)
body(
    "React's component model and declarative rendering let each piece of UI own its state and "
    "re-render in isolation when that state changes. The virtual DOM reconciliation ensures that "
    "updating a test result panel does not re-paint the editor or the timer. Context API handles "
    "cross-component state (contest data, auth, alerts) without introducing a heavier state "
    "management library."
)

# Summary table
h2("Stack at a Glance")
add_table(
    ["Layer", "Chosen Technology", "Alternative Evaluated", "Deciding Factor"],
    [
        ["Backend Runtime",   "Node.js (Express 5)",       "Python / Flask / Django",    "Non-blocking I/O via libuv for concurrent requests"],
        ["Database",          "Firebase Firestore (NoSQL)", "PostgreSQL / Relational SQL", "Schema flexibility and bundled BaaS hosting"],
        ["Code Execution",    "Judge0 CE (self-hostable)",  "Judge0 via RapidAPI",         "Fixed infrastructure cost vs. variable per-call billing"],
        ["Authentication",    "JWT in httpOnly cookies",    "Server-side session storage", "Stateless verification; no DB round-trip per request"],
        ["Frontend",          "React 19 + Vite 6",          "Vanilla JS / Templating",     "Component model for concurrent timer + editor + result states"],
        ["Cloud Hosting",     "Google Cloud Run",           "VM / bare server",            "Auto-scaling, pay-per-use, zero server ops overhead"],
        ["Frontend Hosting",  "Vercel CDN",                 "Self-hosted Nginx",           "Zero-config deploys, global CDN, automatic HTTPS"],
    ],
    col_widths=[1.3, 1.6, 1.7, 2.5]
)

# ══════════════════════════════════════════════════════════════════════════════
#  3. SYSTEM ARCHITECTURE
# ══════════════════════════════════════════════════════════════════════════════
h1("3. System Architecture")
body(
    "Syntax follows a classical client-server separation with a thin service layer between the "
    "HTTP boundary and the database. The frontend is a React single-page application deployed "
    "on Vercel. The backend is an Express.js API deployed as a Docker container on Google Cloud "
    "Run. Firebase Firestore provides persistent storage. Judge0 CE handles sandboxed code "
    "evaluation. There are no tight couplings between these four components; each communicates "
    "through a well-defined interface."
)

h2("Request Flow")
code_block([
    "  Browser (React SPA on Vercel)",
    "    │",
    "    │  HTTPS + httpOnly cookie (auth_token)",
    "    ▼",
    "  Express.js API  (Google Cloud Run, asia-south1)",
    "    │",
    "    ├── Middleware: CORS whitelist → cookie-parser → JWT verify → RBAC guard",
    "    │",
    "    ├── Routes  (/api/auth, /api/admin, /api/student, /api/judge, ...)",
    "    │",
    "    ├── Controllers  (parse request → call service → format response)",
    "    │",
    "    └── Services  (business logic, Firestore queries, JWT signing)",
    "          │                              │",
    "          ▼                              ▼",
    "  Firebase Firestore              Judge0 CE API",
    "  (document store)               (code execution sandbox)",
])

h2("Folder Structure (Backend)")
code_block([
    "  server.js              ← entry point, middleware stack, route mount",
    "  routes/",
    "    authRoutes.js",
    "    adminRoutes.js        ← student CRUD, bulk import",
    "    eventRoutes.js        ← contest lifecycle",
    "    studentRoutes.js      ← contest attempt, submit",
    "    judgeRoutes.js        ← run code, run tests, contest submit",
    "    proctoringRoutes.js   ← log violations, fetch logs",
    "    profileRoutes.js      ← profile, password, skills",
    "    superRoutes.js        ← super-admin operations",
    "    problemBankRoutes.js  ← reusable problem templates",
    "    validationRoutes.js",
    "  controllers/            ← 10 files, one per route module",
    "  services/",
    "    authService.js        ← login, bcrypt compare, JWT sign",
    "    eventService.js       ← quiz/contest creation, status transitions",
    "    validationService.js",
    "  middleware/",
    "    requireAdminAuth.js",
    "    requireStudentAuth.js",
    "    requireSuperAdminAuth.js",
    "  utils/                  ← cache helpers, encryption keys",
    "  Dockerfile",
    "  cloudbuild.yaml",
])

h2("Folder Structure (Frontend)")
code_block([
    "  src/",
    "    pages/",
    "      Landing, RoleSelect                    (public)",
    "      Admin*   (Dashboard, CreateContest, ManageContest, ...)",
    "      Student* (Home, Contests, Quiz, CodingContest, Leaderboard, ...)",
    "      Super*   (Dashboard, ManageUsers, ManageContests)",
    "    components/",
    "      Navbars, Modals, Alerts, Loader, MobileBlocker, ProblemBankSelector",
    "    context/",
    "      ContestContext.jsx   ← shared contest and auth state",
    "      AlertContext.jsx     ← global toast notifications",
    "    hooks/",
    "      useProctoring.js    ← all anti-cheating logic",
    "    App.jsx               ← route definitions",
])

# ══════════════════════════════════════════════════════════════════════════════
#  4. AUTHENTICATION & AUTHORISATION
# ══════════════════════════════════════════════════════════════════════════════
h1("4. Authentication and Authorisation")

h2("JWT Implementation")
body(
    "On successful login the server calls jwt.sign() with a payload containing the user's ID, "
    "name, email, and role flags. The token is placed in an httpOnly cookie with Secure and "
    "SameSite=None attributes. Every subsequent request to a protected endpoint passes through "
    "a middleware that extracts this cookie, calls jwt.verify(), and attaches the decoded claims "
    "to req.user. No database round-trip is involved in this step."
)
body("Token lifetimes are intentionally short given the sensitivity of assessment data:")
bullet("Students and admins: 3 hours (covers the duration of the longest expected session).")
bullet("Super admins: 1 hour (shorter window for a higher-privilege account).")
body("Token payload structure:")
code_block([
    "  {",
    "    userId, userName, email,",
    "    isAdmin:   boolean,",
    "    isStudent: boolean,",
    "    isSuper:   boolean,",
    "    // students additionally carry:",
    "    department, year, section, semester, batch",
    "  }",
])

h2("Three-Role RBAC")
add_table(
    ["Role", "Token Flag", "Capabilities"],
    [
        ["Student",     "isStudent: true", "Participate in contests and quizzes, view articles, check leaderboard, manage own profile."],
        ["Admin",       "isAdmin: true",   "Create and schedule contests, manage students (add/ban/bulk-import), view proctoring logs, reopen contests."],
        ["Super Admin", "isSuper: true",   "Manage admin accounts, global contest oversight, database-level delete operations."],
    ],
    col_widths=[1.2, 1.5, 4.4]
)

h2("Password Security")
body(
    "Passwords are hashed with bcryptjs at 10 salt rounds before storage. The plaintext password "
    "never leaves the controller layer. On login, bcrypt.compare() validates the credential "
    "asynchronously. Bulk-imported student accounts are assigned a default password in the format "
    "Name@YearSection, which students are expected to change on first login."
)

# ══════════════════════════════════════════════════════════════════════════════
#  5. DATABASE SCHEMA
# ══════════════════════════════════════════════════════════════════════════════
h1("5. Database Schema (Firebase Firestore)")
body(
    "Firestore organises data as collections of documents. Each document is a flexible JSON-like "
    "object. Syntax uses six top-level collections and two subcollection paths."
)

h2("users")
code_block([
    "  {",
    "    userName, email, hashedPassword,",
    "    isStudent, isAdmin, isSuper,",
    "    department, year, section, semester, batch,",
    "    status: 'active' | 'banned',  banReason,",
    "    totalScore, contestsParticipated, quizzesAttended,",
    "    languages[], skills[],",
    "    createdAt: timestamp",
    "  }",
    "  Subcollections:",
    "    users/{userId}/contestResults/{eventId}",
    "    users/{userId}/quizResults/{eventId}",
])

h2("events")
code_block([
    "  {",
    "    eventTitle, eventDescription,",
    "    eventType: 'quiz' | 'contest',",
    "    eventMode: 'strict' | 'practice',",
    "    status: 'queue' | 'active' | 'ended',",
    "    durationMinutes, numberOfQuestions | numberOfPrograms,",
    "    questions[]: { text, options[], correctAnswer, points },",
    "    problems[]: {",
    "      title, description, inputFormat, outputFormat, constraints,",
    "      exampleIO[], openTestCases[], hiddenTestCases[],   // hidden never sent to frontend",
    "      points, starterCode: { python, java, cpp, c, js }",
    "    },",
    "    totalScore, topicsCovered[], allowedDepartments[],",
    "    createdBy (adminUserId), selectedLanguage,",
    "    createdAt: timestamp",
    "  }",
])

h2("eventAttempts / eventResults")
code_block([
    "  eventAttempts: {",
    "    userId, userName, eventId, eventTitle,",
    "    status: 'in-progress' | 'completed',",
    "    code, language, testResults[], score,",
    "    started_at, completed_at",
    "  }",
    "",
    "  eventResults: {",
    "    userId, userName, department,",
    "    eventId, eventTitle,",
    "    points, maxPoints,",
    "    problemsAttempted, totalProblems,",
    "    submittedAt: timestamp,",
    "    questionDetails[]   // per-question breakdown",
    "  }",
])

h2("proctoringLogs / articles / problemBank")
code_block([
    "  proctoringLogs: {",
    "    userId, userName, contestId,",
    "    violations[]: { type, timestamp, count },",
    "    totalViolations, createdAt",
    "  }",
    "",
    "  articles: {",
    "    title, description,",
    "    type: 'file' | 'link',",
    "    fileUrl | articleLink | articleText,",
    "    createdBy (adminId), createdAt",
    "  }",
    "",
    "  problemBank: {",
    "    title, description, difficulty,",
    "    inputFormat, outputFormat, constraints,",
    "    exampleIO[], openTestCases[], hiddenTestCases[],",
    "    starterCode: { python, java, js, ... }",
    "  }",
])

# ══════════════════════════════════════════════════════════════════════════════
#  6. SECURITY ARCHITECTURE
# ══════════════════════════════════════════════════════════════════════════════
h1("6. Security Architecture")
body(
    "Security in an assessment platform has an unusual threat model. Cheating — not external "
    "attackers — is the primary adversary. The system is hardened against both."
)

h2("Transport and Cookie Security")
bullet("All traffic runs over HTTPS (Cloud Run enforces TLS; Vercel enforces TLS).")
bullet("auth_token cookie is httpOnly, Secure, SameSite=None.")
bullet("JavaScript cannot read or modify the auth token, eliminating XSS token theft.")

h2("Asymmetric Encryption for Contest Submissions")
body(
    "When a student finalises a coding submission, the frontend encrypts the submission payload "
    "using RSA-OAEP with the backend's public key. The private key exists only on the server. "
    "This means that even if a student intercepts the network traffic or injects code into the "
    "page, they cannot forge or tamper with a submission — only the server can decrypt it."
)
body(
    "For large payloads a hybrid approach is used: AES encrypts the data (fast), then RSA "
    "encrypts the AES session key (secure). This keeps the RSA operation small while maintaining "
    "the integrity guarantee."
)

h2("AES Encryption for localStorage Persistence")
body(
    "Contest state (time remaining, problem navigation) is persisted in localStorage so the "
    "student can recover from an accidental page refresh. This data is AES-256 encrypted with "
    "a key derived from SHA-256(contestId + sessionToken). An HMAC-SHA-256 signature detects "
    "tampering. Code content is never stored in localStorage; only display-safe metadata is."
)

h2("Hidden Test Cases")
body(
    "The events collection stores two categories of test cases for coding problems: open test "
    "cases (visible to the student during the contest) and hidden test cases (used for final "
    "scoring). The backend API that delivers problem data to the frontend strips the hidden "
    "test cases entirely from the response. A student inspecting browser DevTools sees only "
    "visible test cases. Scoring against hidden cases happens server-side on submission."
)

h2("Rate Limiting and Input Validation")
bullet("express-rate-limit is applied to login and sensitive endpoints to prevent brute-force attacks.")
bullet("express-validator validates all inbound data at the route layer before controllers execute.")
bullet("Multer restricts bulk import uploads to Excel files with a 5 MB ceiling.")
bullet("CORS is configured with an origin whitelist (FRONTEND_URL env variable); arbitrary origins are rejected.")

h2("Idempotency and Submission Integrity")
body(
    "Idempotency tokens prevent double submissions. Server-side timestamp verification ensures "
    "that submissions arriving after the contest deadline are rejected. The combination of "
    "RSA-signed payloads and server-side validation means neither the submission content nor "
    "its timing can be manipulated from the client."
)

# ══════════════════════════════════════════════════════════════════════════════
#  7. PROCTORING SYSTEM
# ══════════════════════════════════════════════════════════════════════════════
h1("7. Proctoring System")
body(
    "Proctoring logic lives entirely in a custom React hook, useProctoring.js. The hook "
    "attaches event listeners to the document and window on mount and re-attaches them every "
    "three seconds. The re-attachment loop is intentional: it counters simple bypass scripts "
    "that attempt to remove event listeners after page load. Violations are tracked in React "
    "state and mirrored to localStorage so they survive an accidental page reload."
)

h2("Detection Mechanisms")
add_table(
    ["Violation Type", "Detection Method", "Notes"],
    [
        ["Fullscreen exit",    "Fullscreen change event",               "2-second grace period before recording; re-entry is automatically attempted."],
        ["Tab switch",         "document visibilitychange event",       "Triggers when browser tab loses focus."],
        ["Window blur",        "window blur event",                     "Detects switching to another application window."],
        ["Mouse outside page", "mouseleave on document",                "3-second grace before recording. Flags DevTools or secondary windows."],
        ["Clipboard actions",  "copy / paste / cut events",             "All three are blocked and logged."],
        ["DevTools shortcuts", "keydown listener",                      "F12, Ctrl+Shift+I/J/C are intercepted."],
        ["Right-click",        "contextmenu event",                     "Disabled during contest."],
        ["Drag and drop",      "dragover / drop events",                "Blocked to prevent external content drops."],
        ["Navigation",         "beforeunload + popstate listeners",     "Prevents back/forward browser navigation."],
    ],
    col_widths=[1.5, 1.8, 3.8]
)

h2("Violation Flow")
code_block([
    "  1.  Event fires (e.g. tab switch detected)",
    "  2.  recordViolation(type) called",
    "  3.  Violation count incremented in React state",
    "  4.  Saved to localStorage: proctoring_violations_{contestId}",
    "  5.  POST /api/proctoring/log-violation  →  Firestore proctoringLogs document updated",
    "  6.  ProctoringWarning modal displayed to student",
    "  7.  If totalViolations >= 10  →  onAutoSubmit() callback fires",
])

h2("Admin Visibility")
body(
    "Admins can open the violation log for any student from the ManageContest page. The log "
    "shows each violation type, its timestamp, and a cumulative count. This audit trail is "
    "stored server-side and cannot be modified by the student."
)

# ══════════════════════════════════════════════════════════════════════════════
#  8. CODE EXECUTION ENGINE
# ══════════════════════════════════════════════════════════════════════════════
h1("8. Code Execution Engine")

h2("Judge0 Integration")
body(
    "All code execution is delegated to Judge0 CE, an open-source online judge engine that "
    "runs submissions in isolated Docker containers. Syntax communicates with Judge0 via its "
    "REST API. The backend assembles a batch of submissions (one per test case), sends them "
    "in a single POST request, then polls the batch endpoint until all tokens return a terminal "
    "status (not queued or processing)."
)

h2("Supported Languages")
add_table(
    ["Language", "Judge0 Language ID", "Version"],
    [
        ["Python",          "71", "Python 3"],
        ["Java",            "62", "Java 11+"],
        ["C++ (GCC)",       "54", "C++17"],
        ["C (GCC)",         "50", "C11"],
        ["JavaScript",      "63", "Node.js"],
    ],
    col_widths=[2.0, 2.0, 3.1]
)

h2("Three Execution Modes")
h3("1. Free Run  (/api/judge/run)")
body(
    "Available from the Codeground playground. Accepts arbitrary code, a language ID, and "
    "custom stdin. Returns stdout, stderr, execution time, and memory usage. No test case "
    "framework is applied.", indent=True
)

h3("2. Open Test Run  (/api/judge/run-open-tests)")
body(
    "Used during a contest for practice runs. Fetches the problem's exampleIO and openTestCases "
    "from Firestore, builds a batch submission, runs it through Judge0, and returns per-test "
    "results with input/output visible. Hidden test cases are never included.", indent=True
)

h3("3. Contest Submit  (/api/judge/contest-submit)")
body(
    "The final submission endpoint. Combines exampleIO + openTestCases + hiddenTestCases into "
    "the batch. Results for hidden tests are returned with the input/output fields redacted. "
    "Scoring: Math.round((passedCount / totalTestCases) * problem.points). The response marks "
    "each result as visible or hidden so the frontend can display them appropriately.", indent=True
)

h2("Polling Logic")
code_block([
    "  1. POST /submissions/batch  → returns token[]",
    "  2. Loop (max 30 attempts, 1-second interval):",
    "       GET /submissions/batch?tokens=...&fields=...",
    "       if all status.id not in {1 (queued), 2 (processing)} → break",
    "  3. Process results:",
    "       status.id == 3 → compare actual output with expected output",
    "       status.id != 3 → Compilation Error / Runtime Error / TLE",
    "  4. Build per-test verdict; aggregate total passed count",
])

# ══════════════════════════════════════════════════════════════════════════════
#  9. CONTEST LIFECYCLE
# ══════════════════════════════════════════════════════════════════════════════
h1("9. Contest Lifecycle")

h2("Creation (Admin)")
code_block([
    "  Admin → CreateContest.jsx (4-step wizard)",
    "    Step 1: Event type (Quiz / Coding) and mode (Strict / Practice)",
    "    Step 2: Metadata — title, description, duration, topics, departments",
    "    Step 3: Add questions (MCQ with 4 options) or problems (statement + test cases)",
    "    Step 4: Review and submit",
    "  POST /api/admin/create-contest",
    "    → eventController.createContest",
    "    → eventService.handleQuizCreation | handleCodingContestCreation",
    "    → Firestore events collection: new document, status = 'queue'",
])

h2("Scheduling and Execution")
code_block([
    "  Admin: ManageContest.jsx",
    "    Activate  → PUT /api/admin/events/:id  (status: queue → active)",
    "    End       → PUT /api/admin/events/:id  (status: active → ended)",
    "    Reopen    → POST /api/admin/reopen-contest",
    "                 Deletes student submission, resets event status to active",
])

h2("Student Participation — Quiz")
code_block([
    "  1. GET /api/student/events           → list (no question content)",
    "  2. GET /api/student/events/:eventId  → questions without correctAnswer",
    "  3. If Strict mode: fullscreen request + proctoring hook activated",
    "  4. Seeded shuffle of question order (consistent per student across refresh)",
    "  5. Timer synced with server-side start time",
    "  6. POST /api/student/finish-contest  { contestId, answers[] }",
    "       Server compares answers against stored correctAnswer",
    "       Calculates score, writes eventResult, updates user.totalScore",
])

h2("Student Participation — Coding Contest")
code_block([
    "  1. GET /api/student/events/:eventId  → problems (hidden test cases stripped)",
    "  2. Monaco editor per problem, language selector",
    "  3. POST /api/judge/run-open-tests    → real-time feedback",
    "  4. POST /api/judge/contest-submit    → scored against all test cases",
    "       Submission metadata encrypted (RSA) → stored in localStorage",
    "  5. POST /api/student/finish-contest",
    "       Backend aggregates scores from all problem submissions",
    "       Writes eventResults document",
])

# ══════════════════════════════════════════════════════════════════════════════
#  10. DEPLOYMENT ARCHITECTURE
# ══════════════════════════════════════════════════════════════════════════════
h1("10. Deployment Architecture")

h2("Production Topology")
add_table(
    ["Component", "Platform", "Details"],
    [
        ["Frontend",       "Vercel CDN",              "React SPA; git push triggers auto-build. vercel.json routes all paths to /index.html for client-side routing."],
        ["Backend API",    "Google Cloud Run",         "Node.js 20 Docker container. Region: asia-south1. Auto-scales 0-10 instances. Health check: GET /health."],
        ["Database",       "Firebase Firestore",       "Serverless, horizontally scalable document store. Firebase Admin SDK used exclusively from the backend (no client-side DB access)."],
        ["Secrets",        "GCP Secret Manager",       "JWT_SECRET, Firebase credentials, Judge0 API key. Injected as env vars at Cloud Run deploy time."],
        ["Code Execution", "Judge0 (RapidAPI / VPS)",  "Current: RapidAPI endpoint. Designed for swap to self-hosted VPS by changing JUDGE0_HOST env var."],
    ],
    col_widths=[1.4, 1.7, 4.0]
)

h2("CI/CD Pipeline (Cloud Build)")
code_block([
    "  On git push to main branch:",
    "    Step 1 → Build Docker image: gcr.io/$PROJECT_ID/syntax-backend:$COMMIT_SHA",
    "    Step 2 → Push image to Google Container Registry",
    "    Step 3 → Deploy to Cloud Run (asia-south1, allow-unauthenticated)",
    "             Traffic migrated to new revision automatically",
])

h2("Docker Configuration")
code_block([
    "  FROM node:20-slim",
    "  WORKDIR /app",
    "  COPY package*.json ./",
    "  RUN npm ci --only=production",
    "  COPY . .",
    "  EXPOSE 8080",
    "  ENV NODE_ENV=production",
    "  CMD [\"node\", \"server.js\"]",
])

h2("Environment Variables")
code_block([
    "  Backend (GCP Secrets → Cloud Run env):",
    "    PORT=8080                    JWT_SECRET=<key>",
    "    NODE_ENV=production          FRONTEND_URL=https://syntax-eta.vercel.app",
    "    FIREBASE_PROJECT_ID          FIREBASE_CLIENT_EMAIL",
    "    FIREBASE_PRIVATE_KEY         JUDGE0_HOST",
    "    JUDGE0_API_KEY               JUDGE0_RAPIDAPI_KEY",
    "",
    "  Frontend (Vercel env):",
    "    VITE_API_URL=https://syntax-backend-xxxxx-as.a.run.app",
])

h2("Cold Start Consideration")
body(
    "Cloud Run scales to zero when idle, which introduces a cold start latency of 2-5 seconds "
    "after a period of inactivity. For production exam sessions, setting min-instances=1 "
    "eliminates this at a marginal fixed cost (~$5-10/month), ensuring students do not "
    "experience a delay when the first request of an exam arrives."
)

# ══════════════════════════════════════════════════════════════════════════════
#  11. KEY DESIGN DECISIONS
# ══════════════════════════════════════════════════════════════════════════════
h1("11. Key Design Decisions")
add_table(
    ["Decision", "Rationale"],
    [
        ["JWT in httpOnly cookies (not localStorage)",
         "Prevents XSS from stealing auth tokens. The browser never exposes the token to JavaScript."],
        ["Separate list and detail endpoints for events",
         "The list endpoint returns metadata only; questions and test cases are sent only on contest start, preventing early inspection."],
        ["Hidden test cases server-side only",
         "Hidden test cases are stored in Firestore but never included in any API response sent to the frontend. Scoring against them happens on the server."],
        ["RSA encryption for submissions",
         "Only the backend private key can decrypt a submission. A student cannot forge a result even with full network access."],
        ["Seeded question shuffling",
         "Questions are shuffled using a seed derived from student ID. The order is consistent if the student refreshes but differs between students."],
        ["Proctoring listener re-attachment (3s interval)",
         "Naive bypass scripts that call removeEventListener once are countered. Listeners are re-added every three seconds."],
        ["Violation persistence in localStorage",
         "A page refresh does not reset the violation counter. The count is restored from localStorage on re-mount."],
        ["Server-side timer as source of truth",
         "Contest start time is recorded in Firestore. The frontend countdown is derived from this value, not from client-side clock."],
        ["Hybrid AES + RSA encryption for payloads",
         "Pure RSA on large data is slow. AES encrypts the payload; RSA encrypts the AES key. This gives speed with the security property of asymmetric keys."],
        ["Firebase Admin SDK exclusively on backend",
         "No Firebase client SDK is exposed to the frontend. All database access flows through the Express API, centralising access control."],
    ],
    col_widths=[2.3, 4.8]
)

# ══════════════════════════════════════════════════════════════════════════════
#  12. ROLES AND FEATURES MATRIX
# ══════════════════════════════════════════════════════════════════════════════
h1("12. Roles and Features")
add_table(
    ["Feature", "Student", "Admin", "Super Admin"],
    [
        ["Take quiz / coding contest",      "Yes", "—",   "—"],
        ["Free-run code playground",        "Yes", "—",   "—"],
        ["View articles and resources",     "Yes", "—",   "—"],
        ["Leaderboard (own contests)",      "Yes", "Yes", "—"],
        ["Submission history",              "Yes", "—",   "—"],
        ["Profile / skills management",     "Yes", "—",   "—"],
        ["Create and schedule contests",    "—",   "Yes", "—"],
        ["Manage students (add/ban/import)","—",   "Yes", "—"],
        ["View proctoring logs",            "—",   "Yes", "—"],
        ["Reopen a contest",                "—",   "Yes", "—"],
        ["Manage articles",                 "—",   "Yes", "—"],
        ["Problem bank (reusable)",         "—",   "Yes", "—"],
        ["Manage admin accounts",           "—",   "—",   "Yes"],
        ["Global contest oversight",        "—",   "—",   "Yes"],
        ["Database-level deletions",        "—",   "—",   "Yes"],
    ],
    col_widths=[3.0, 1.2, 1.2, 1.7]
)

# ══════════════════════════════════════════════════════════════════════════════
#  FINAL PAGE — closing note
# ══════════════════════════════════════════════════════════════════════════════
doc.add_page_break()

closing = doc.add_paragraph()
closing.alignment = WD_ALIGN_PARAGRAPH.CENTER
para_space(closing, before=60, after=6)
r_c = closing.add_run("End of Document")
set_run_font(r_c, size=11, bold=True, color=BLACK)

closing2 = doc.add_paragraph()
closing2.alignment = WD_ALIGN_PARAGRAPH.CENTER
para_space(closing2, before=4)
r_c2 = closing2.add_run("Syntax · Technical Architecture · June 2026")
set_run_font(r_c2, size=10, color=MGRAY, italic=True)

# ── Save ──────────────────────────────────────────────────────────────────────
out = "/home/user/Syntax_Deploy/Syntax_Architecture_Document.docx"
doc.save(out)
print(f"Saved: {out}")
