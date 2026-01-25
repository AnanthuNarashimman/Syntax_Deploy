const { db, admin } = require("../config/firebase");

// Create a new problem in the problem bank
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      difficulty,
      topics,
      exampleIO,
      openTestCases,
      hiddenTestCases,
      starterCode
    } = req.body;

    // Validate required fields
    if (!title || !description || !inputFormat || !outputFormat || !constraints) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, inputFormat, outputFormat, constraints"
      });
    }

    if (!exampleIO || exampleIO.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one example I/O is required"
      });
    }

    if (!openTestCases || openTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one open test case is required"
      });
    }

    if (!hiddenTestCases || hiddenTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one hidden test case is required"
      });
    }

    if (!starterCode || !starterCode.python || !starterCode.java || !starterCode.javascript) {
      return res.status(400).json({
        success: false,
        message: "Starter code for all languages (python, java, javascript) is required"
      });
    }

    const problemData = {
      title: title.trim(),
      description: description.trim(),
      inputFormat: inputFormat.trim(),
      outputFormat: outputFormat.trim(),
      constraints: constraints.trim(),
      difficulty: difficulty || 'Easy',
      topics: topics || [],
      exampleIO,
      openTestCases,
      hiddenTestCases,
      starterCode,
      createdBy: req.user.userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("problemBank").add(problemData);

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: {
        id: docRef.id,
        ...problemData,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create problem",
      error: error.message
    });
  }
};

// Get all problems from the problem bank
const getProblems = async (req, res) => {
  try {
    const { search, difficulty } = req.query;

    let query = db.collection("problemBank").orderBy("createdAt", "desc");

    const snapshot = await query.get();

    let problems = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      problems.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        inputFormat: data.inputFormat,
        outputFormat: data.outputFormat,
        constraints: data.constraints,
        difficulty: data.difficulty,
        topics: data.topics || [],
        exampleIO: data.exampleIO || [],
        openTestCases: data.openTestCases || [],
        hiddenTestCases: data.hiddenTestCases || [],
        starterCode: data.starterCode || {},
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    });

    // Apply filters (Firestore doesn't support text search, so we filter in memory)
    if (search) {
      const searchLower = search.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (difficulty && difficulty !== 'all') {
      problems = problems.filter(p => p.difficulty === difficulty);
    }

    res.status(200).json({
      success: true,
      problems,
      total: problems.length
    });

  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch problems",
      error: error.message
    });
  }
};

// Get a single problem by ID
const getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problemRef = db.collection("problemBank").doc(problemId);
    const problemDoc = await problemRef.get();

    if (!problemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const data = problemDoc.data();
    const problem = {
      id: problemDoc.id,
      title: data.title,
      description: data.description,
      inputFormat: data.inputFormat,
      outputFormat: data.outputFormat,
      constraints: data.constraints,
      difficulty: data.difficulty,
      topics: data.topics || [],
      exampleIO: data.exampleIO || [],
      openTestCases: data.openTestCases || [],
      hiddenTestCases: data.hiddenTestCases || [],
      starterCode: data.starterCode || {},
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };

    res.status(200).json({
      success: true,
      problem
    });

  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
      error: error.message
    });
  }
};

// Update a problem
const updateProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const {
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      difficulty,
      topics,
      exampleIO,
      openTestCases,
      hiddenTestCases,
      starterCode
    } = req.body;

    const problemRef = db.collection("problemBank").doc(problemId);
    const problemDoc = await problemRef.get();

    if (!problemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    // Validate required fields
    if (!title || !description || !inputFormat || !outputFormat || !constraints) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, inputFormat, outputFormat, constraints"
      });
    }

    const updateData = {
      title: title.trim(),
      description: description.trim(),
      inputFormat: inputFormat.trim(),
      outputFormat: outputFormat.trim(),
      constraints: constraints.trim(),
      difficulty: difficulty || 'Easy',
      topics: topics || [],
      exampleIO: exampleIO || [],
      openTestCases: openTestCases || [],
      hiddenTestCases: hiddenTestCases || [],
      starterCode: starterCode || {},
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await problemRef.update(updateData);

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: {
        id: problemId,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update problem",
      error: error.message
    });
  }
};

// Delete a problem
const deleteProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problemRef = db.collection("problemBank").doc(problemId);
    const problemDoc = await problemRef.get();

    if (!problemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    await problemRef.delete();

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete problem",
      error: error.message
    });
  }
};

module.exports = {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem
};
