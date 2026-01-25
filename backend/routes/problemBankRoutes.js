const express = require("express");
const router = express.Router();

const middleware = require('../middleware/authMiddleware');
const problemBankController = require('../controllers/problemBankController');

// All routes require admin authentication
router.post('/', middleware.requireAdminAuth, problemBankController.createProblem);
router.get('/', middleware.requireAdminAuth, problemBankController.getProblems);
router.get('/:problemId', middleware.requireAdminAuth, problemBankController.getProblemById);
router.put('/:problemId', middleware.requireAdminAuth, problemBankController.updateProblem);
router.delete('/:problemId', middleware.requireAdminAuth, problemBankController.deleteProblem);

module.exports = router;
