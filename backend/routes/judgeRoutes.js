// /backend/routes/judgeRoutes.js
const express = require('express');
const router = express.Router();

const {
  handleRunCode,
  handleContestSubmit,
  handleRunOpenTests
} = require('../controllers/judgeController');

const { requireStudentAuth } = require('../middleware/authMiddleware');

// Public route - anyone can run code in the playground
router.post('/run', handleRunCode);

// Protected route - run code against open test cases only
router.post('/run-open-tests', requireStudentAuth, handleRunOpenTests);

// Protected route - for contest event submissions
router.post('/contest-submit', requireStudentAuth, handleContestSubmit);

module.exports = router;