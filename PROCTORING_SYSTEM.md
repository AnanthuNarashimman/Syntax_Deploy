# Proctoring System Documentation

## Overview

The proctoring system is designed to monitor students during **strict mode contests and quizzes** to maintain exam integrity. It uses browser-based monitoring techniques without requiring camera or microphone access.

## Features

### ✅ Implemented Features

1. **Fullscreen Enforcement** - Forces and maintains fullscreen mode
2. **Tab Switching Detection** - Detects when user switches tabs
3. **Window Focus Monitoring** - Detects when exam window loses focus
4. **Mouse Tracking** - Detects mouse leaving exam area (DevTools/Sidebar detection)
5. **Copy/Paste Blocking** - Prevents clipboard operations
6. **Keyboard Shortcut Blocking** - Blocks DevTools shortcuts (F12, Ctrl+Shift+I, etc.)
7. **Right-Click Blocking** - Prevents context menu access
8. **Navigation Blocking** - Prevents browser back button and URL changes
9. **DevTools Detection** - Detects viewport size changes (DevTools opening)
10. **Warning System** - 3-strike system before auto-submission
11. **Backend Logging** - All violations logged to Firestore for admin review

## How It Works

### 1. Activation

Proctoring **ONLY activates** for contests with `eventMode: "strict"`:

```javascript
// Contest must have this field set to "strict"
eventMode: "strict"  // Enables proctoring
eventMode: "practice" // No proctoring
```

### 2. Student Experience

#### When Entering Strict Contest:

1. Page automatically enters fullscreen mode
2. Alert shown: "Proctoring activated! Stay in fullscreen mode..."
3. Proctoring badge appears in header showing `0/3` violations
4. All monitoring begins immediately

#### When Violation Occurs:

1. Violation is detected (e.g., mouse left window)
2. Violation count increments (`1/3`, `2/3`, `3/3`)
3. Warning modal appears with:
   - Violation type
   - Current warning count
   - Remaining warnings
   - Rules reminder
4. Violation logged to backend
5. Violation logged to localStorage

#### On 4th Violation:

1. Contest is **automatically submitted**
2. All answers saved to backend
3. Student redirected to contests page
4. Cannot return to contest

### 3. Monitored Activities

| Activity | Detection Method | Violation Message |
|----------|-----------------|-------------------|
| **Exit Fullscreen** | `fullscreenchange` event | "Exited fullscreen mode" |
| **Switch Tab** | `visibilitychange` event | "Switched to another tab" |
| **Window Blur** | `blur` event | "Window lost focus" |
| **Mouse Leaves Window** | `mouseleave` + timeout | "Mouse left exam window" |
| **Mouse Outside Viewport** | `mousemove` coordinates | "Mouse outside exam area (DevTools/Sidebar suspected)" |
| **Copy Attempt** | `copy` event | "Copy attempt blocked" |
| **Paste Attempt** | `paste` event | "Paste attempt blocked" |
| **Cut Attempt** | `cut` event | "Cut attempt blocked" |
| **F12 Pressed** | `keydown` event | "DevTools shortcut blocked" |
| **Ctrl+Shift+I** | `keydown` event | "DevTools shortcut blocked" |
| **Ctrl+C/V/X** | `keydown` event | "Clipboard shortcut blocked" |
| **Right-Click** | `contextmenu` event | (Silently blocked) |
| **Browser Back** | `popstate` event | "Navigation attempt blocked" |
| **Viewport Resize** | Size change detection | "DevTools suspected (viewport size changed)" |

### 4. Warning System

```
Strike 1 (1/3) → Warning modal shown → Continue exam
Strike 2 (2/3) → Warning modal shown → Continue exam
Strike 3 (3/3) → FINAL WARNING modal → Continue exam
Strike 4 (>3/3) → Auto-submit contest → Exam ends
```

## Technical Implementation

### Frontend Files

```
syntax/src/
├── hooks/
│   └── useProctoring.js                    # Main proctoring logic hook
├── components/
│   ├── ProctoringWarning.jsx               # Warning modal component
│   └── ProctoringWarning.module.css        # Modal styles
├── Pages/
│   └── CodingContestPage.jsx               # Integrated proctoring
└── Styles/PageStyles/
    └── CodingContestPage.module.css        # Proctoring badge styles
```

### Backend Files

```
backend/
├── controllers/
│   └── proctoringController.js             # Violation logging controller
├── routes/
│   └── proctoringRoutes.js                 # Proctoring API routes
└── index.js                                # Routes registered here
```

### Database Structure

#### Firestore Collections:

**1. `proctoringLogs` (Individual Violations)**
```javascript
{
  userId: "student123",
  userName: "John Doe",
  userEmail: "john@example.com",
  contestId: "contest456",
  violationType: "Mouse left exam window",
  violationCount: 2,
  timestamp: "2025-01-13T10:30:00Z",
  userAgent: "Mozilla/5.0...",
  ipAddress: "192.168.1.1",
  createdAt: Timestamp
}
```

**2. `users/{userId}/contestResults/{contestId}` (Summary)**
```javascript
{
  // ...existing contest result fields...
  proctoringViolations: 3,
  lastViolationType: "Mouse outside exam area",
  lastViolationAt: Timestamp
}
```

**3. localStorage (Client-Side)**
```javascript
// Violation count
localStorage: `proctoring_violations_${contestId}` = "3"

// Violation log
localStorage: `proctoring_log_${contestId}` = [
  { type: "Tab switched", timestamp: "...", count: 1 },
  { type: "Mouse left window", timestamp: "...", count: 2 },
  { type: "DevTools detected", timestamp: "...", count: 3 }
]
```

## API Endpoints

### Student Endpoints

**POST /api/proctoring/log-violation**
- **Auth**: Student only
- **Body**:
  ```json
  {
    "contestId": "abc123",
    "violationType": "Tab switched",
    "violationCount": 2,
    "timestamp": "2025-01-13T10:30:00Z"
  }
  ```
- **Response**: `{ success: true, message: "Violation logged successfully" }`

### Admin Endpoints

**GET /api/proctoring/contest/:contestId/violations**
- **Auth**: Admin only
- **Returns**: All violations for a specific contest, grouped by student

**GET /api/proctoring/student/:studentId/violations**
- **Auth**: Admin only
- **Returns**: All violations for a specific student across all contests

**GET /api/proctoring/student/:studentId/contest/:contestId/violations**
- **Auth**: Admin only
- **Returns**: Violations for a specific student in a specific contest

## Configuration

### Proctoring Settings

```javascript
// In useProctoring.js
const MAX_VIOLATIONS = 3;                    // Maximum warnings before auto-submit
const mouseOutsideGracePeriod = 2000;       // 2 seconds before violation
const mouseOutsideDuration = 3000;          // 3 seconds sustained outside
const devToolsCheckInterval = 2000;         // Check every 2 seconds
```

### Adjust Sensitivity

To make proctoring **stricter**:
- Reduce `MAX_VIOLATIONS` to `2`
- Reduce `mouseOutsideGracePeriod` to `1000ms`
- Reduce `mouseOutsideDuration` to `2000ms`

To make proctoring **more lenient**:
- Increase `MAX_VIOLATIONS` to `5`
- Increase `mouseOutsideGracePeriod` to `3000ms`
- Don't count mouse violations (comment out mouse handlers)

## Admin Features

### View Violations

Admins can view proctoring violations for:
1. **Entire Contest**: See all students' violations in one contest
2. **Specific Student**: See all violations for one student
3. **Student in Contest**: See specific student's violations in specific contest

### Violation Data Includes:

- Student name and email
- Violation type and count
- Exact timestamp
- User agent (browser info)
- IP address
- Total violations per student

### Future Admin Dashboard (Recommended)

Create an admin page to view:
- Top violators
- Most common violation types
- Violation trends over time
- Real-time proctoring status

## Limitations & Bypass Potential

### ⚠️ Known Limitations

| Limitation | Description | Severity |
|------------|-------------|----------|
| **DevTools Detection** | Not 100% reliable; can be bypassed with undocked DevTools | Medium |
| **Second Device** | Cannot detect student using phone/tablet for answers | High |
| **Virtual Machines** | Student can use VM to bypass some checks | Medium |
| **Browser Extensions** | Hard to detect all sidebar extensions reliably | Low |
| **Screen Sharing** | Cannot detect student sharing screen with others | High |

### ✅ What IS Reliably Detected

- Tab switching ✅
- Window focus loss ✅
- Fullscreen exit ✅
- Mouse leaving viewport ✅
- Copy/paste attempts ✅
- Keyboard shortcuts ✅
- Navigation attempts ✅

## Best Practices

### For Students

1. **Close all other applications** before starting
2. **Use Chrome or Edge** (best compatibility)
3. **Test proctoring** in practice mode first
4. **Don't minimize or switch windows**
5. **Keep mouse inside exam window**
6. **Don't open DevTools or extensions**

### For Admins

1. **Inform students beforehand** about proctoring
2. **Provide practice contests** to test setup
3. **Review violation logs** after exams
4. **Set clear expectations** in exam rules
5. **Have backup plan** for technical issues

## Privacy & Ethics

### ✅ Privacy-Friendly Features

- **No camera or microphone** required
- **No screen recording**
- **No keystroke logging**
- **Minimal data collection** (only violations)
- **Transparent logging** (students know what's monitored)

### ⚠️ Inform Students

Before enabling strict mode, ensure students know:
- What activities are monitored
- How many violations are allowed
- What happens on auto-submit
- How to practice with proctoring

## Testing Proctoring

### Test Checklist

1. ✅ Create a test strict mode contest
2. ✅ Enter contest as student
3. ✅ Verify fullscreen activates
4. ✅ Verify proctoring badge shows `0/3`
5. ✅ Try switching tab → Violation recorded?
6. ✅ Try exiting fullscreen → Violation recorded?
7. ✅ Try moving mouse outside → Violation recorded?
8. ✅ Try pressing F12 → Blocked?
9. ✅ Try copying code → Blocked?
10. ✅ Get 4 violations → Auto-submitted?
11. ✅ Check admin dashboard → Violations visible?

## Future Enhancements

### Recommended Additions

1. **Screenshot Capture** (on violation)
2. **Webcam Integration** (optional, with permission)
3. **AI Behavior Analysis** (unusual patterns)
4. **Real-time Admin Monitoring** (live violation feed)
5. **Audio Detection** (detect voices)
6. **Network Activity Monitor** (detect external API calls)
7. **Biometric Verification** (face recognition at intervals)

### Backend Code Rerun Integration

When VPS is ready, combine proctoring with code rerun:
- Store all submissions locally (encrypted or plain)
- On final submit, backend reruns all code through Judge0
- Proctoring violations considered in final score
- Students with 3+ violations flagged for manual review

## Troubleshooting

### Common Issues

**Q: Student accidentally triggered violation - can they continue?**
A: Yes, they can continue until 4th violation. Each student gets 3 warnings.

**Q: Student's browser doesn't support fullscreen?**
A: Use Chrome/Edge. Safari and older browsers may have issues.

**Q: Mouse detection too sensitive?**
A: Adjust `mouseOutsideGracePeriod` in `useProctoring.js` to 3000ms or higher.

**Q: DevTools detection not working?**
A: Expected - it's not 100% reliable. Focus on other detection methods.

**Q: Can student disable proctoring via DevTools?**
A: If they open DevTools, they'll likely trigger violations. After 3, auto-submit.

## Summary

The proctoring system provides **reasonable security** for strict mode exams without being intrusive. It's **not perfect** but significantly raises the difficulty of cheating while maintaining student privacy.

Key strengths:
- ✅ Browser-based (no software install)
- ✅ Privacy-friendly (no camera/mic)
- ✅ Fair warning system (3 strikes)
- ✅ Comprehensive logging
- ✅ Easy to configure

Combine with:
- Backend code rerun (when VPS ready)
- Randomized question order
- Time limits
- Question pools

For maximum exam integrity! 🔒
