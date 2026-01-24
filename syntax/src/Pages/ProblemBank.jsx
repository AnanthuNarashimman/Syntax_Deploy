// /syntax/src/Pages/ProblemBank.jsx
import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Code,
  FileText,
  ChevronLeft,
  Save,
  X,
  Filter
} from 'lucide-react';
import styles from '../Styles/PageStyles/ProblemBank.module.css';
import AdminNavbar from "../Components/AdminNavbar";
import { useAlert } from '../contexts/AlertContext';

// Mock data for existing problems
const MOCK_PROBLEMS = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    inputFormat: 'First line contains n (size of array) and target. Second line contains n space-separated integers.',
    outputFormat: 'Print two space-separated indices.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    exampleIO: [
      { input: '4 9\n2 7 11 15', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }
    ],
    openTestCases: [
      { input: '4 9\n2 7 11 15', output: '0 1' },
      { input: '3 6\n3 2 4', output: '1 2' }
    ],
    hiddenTestCases: [
      { input: '2 6\n3 3', output: '0 1' },
      { input: '5 10\n1 2 3 4 6', output: '3 4' }
    ],
    starterCode: {
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      java: 'public class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}',
      javascript: 'function twoSum(nums, target) {\n    // Your code here\n}'
    },
    difficulty: 'Easy',
    topics: ['Arrays', 'Hash Table'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Palindrome Check',
    description: 'Given a string s, return true if it is a palindrome, or false otherwise. A palindrome is a word that reads the same backward as forward.',
    inputFormat: 'A single line containing the string s.',
    outputFormat: 'Print "true" if palindrome, "false" otherwise.',
    constraints: '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
    exampleIO: [
      { input: 'racecar', output: 'true', explanation: 'racecar reads the same forwards and backwards.' },
      { input: 'hello', output: 'false', explanation: 'hello is not the same when reversed.' }
    ],
    openTestCases: [
      { input: 'racecar', output: 'true' },
      { input: 'hello', output: 'false' }
    ],
    hiddenTestCases: [
      { input: 'a', output: 'true' },
      { input: 'abba', output: 'true' },
      { input: 'ab', output: 'false' }
    ],
    starterCode: {
      python: 'def is_palindrome(s):\n    # Your code here\n    pass',
      java: 'public class Main {\n    public static boolean isPalindrome(String s) {\n        // Your code here\n        return false;\n    }\n}',
      javascript: 'function isPalindrome(s) {\n    // Your code here\n}'
    },
    difficulty: 'Easy',
    topics: ['Strings'],
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Binary Search',
    description: 'Given a sorted array of integers and a target value, implement binary search to find the target. Return the index if found, otherwise return -1.',
    inputFormat: 'First line contains n (size of array) and target. Second line contains n sorted space-separated integers.',
    outputFormat: 'Print the index of target or -1 if not found.',
    constraints: '1 <= n <= 10^4\n-10^4 <= nums[i], target <= 10^4\nAll integers in nums are unique.\nnums is sorted in ascending order.',
    exampleIO: [
      { input: '6 9\n-1 0 3 5 9 12', output: '4', explanation: '9 exists in nums at index 4' }
    ],
    openTestCases: [
      { input: '6 9\n-1 0 3 5 9 12', output: '4' },
      { input: '6 2\n-1 0 3 5 9 12', output: '-1' }
    ],
    hiddenTestCases: [
      { input: '1 5\n5', output: '0' },
      { input: '3 1\n1 2 3', output: '0' },
      { input: '3 3\n1 2 3', output: '2' }
    ],
    starterCode: {
      python: 'def binary_search(nums, target):\n    # Your code here\n    pass',
      java: 'public class Main {\n    public static int binarySearch(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}',
      javascript: 'function binarySearch(nums, target) {\n    // Your code here\n}'
    },
    difficulty: 'Easy',
    topics: ['Arrays', 'Binary Search'],
    createdAt: '2024-02-01'
  }
];

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const TOPIC_OPTIONS = ['Arrays', 'Strings', 'Hash Table', 'Binary Search', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Recursion', 'Sorting'];

function ProblemBank() {
  const [problems, setProblems] = useState(MOCK_PROBLEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [viewingProblem, setViewingProblem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { showError, showSuccess } = useAlert();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    difficulty: 'Easy',
    topics: [],
    exampleIO: [{ input: '', output: '', explanation: '' }],
    openTestCases: [{ input: '', output: '' }],
    hiddenTestCases: [{ input: '', output: '' }],
    starterCode: {
      python: 'def solution():\n    # Your code here\n    pass',
      java: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
      javascript: 'function solution() {\n    // Your code here\n}'
    }
  });

  // Filter problems
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Form handlers
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      inputFormat: '',
      outputFormat: '',
      constraints: '',
      difficulty: 'Easy',
      topics: [],
      exampleIO: [{ input: '', output: '', explanation: '' }],
      openTestCases: [{ input: '', output: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      starterCode: {
        python: 'def solution():\n    # Your code here\n    pass',
        java: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
        javascript: 'function solution() {\n    // Your code here\n}'
      }
    });
  };

  const openCreateForm = () => {
    resetForm();
    setEditingProblem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (problem) => {
    setFormData({ ...problem });
    setEditingProblem(problem);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProblem(null);
    resetForm();
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTopicToggle = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  // Example I/O handlers
  const handleExampleIOChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      exampleIO: prev.exampleIO.map((example, i) =>
        i === index ? { ...example, [field]: value } : example
      )
    }));
  };

  const addExampleIO = () => {
    setFormData(prev => ({
      ...prev,
      exampleIO: [...prev.exampleIO, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeExampleIO = (index) => {
    if (formData.exampleIO.length > 1) {
      setFormData(prev => ({
        ...prev,
        exampleIO: prev.exampleIO.filter((_, i) => i !== index)
      }));
    }
  };

  // Open Test Cases handlers
  const handleOpenTestCaseChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      openTestCases: prev.openTestCases.map((tc, i) =>
        i === index ? { ...tc, [field]: value } : tc
      )
    }));
  };

  const addOpenTestCase = () => {
    setFormData(prev => ({
      ...prev,
      openTestCases: [...prev.openTestCases, { input: '', output: '' }]
    }));
  };

  const removeOpenTestCase = (index) => {
    if (formData.openTestCases.length > 1) {
      setFormData(prev => ({
        ...prev,
        openTestCases: prev.openTestCases.filter((_, i) => i !== index)
      }));
    }
  };

  // Hidden Test Cases handlers
  const handleHiddenTestCaseChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      hiddenTestCases: prev.hiddenTestCases.map((tc, i) =>
        i === index ? { ...tc, [field]: value } : tc
      )
    }));
  };

  const addHiddenTestCase = () => {
    setFormData(prev => ({
      ...prev,
      hiddenTestCases: [...prev.hiddenTestCases, { input: '', output: '' }]
    }));
  };

  const removeHiddenTestCase = (index) => {
    if (formData.hiddenTestCases.length > 1) {
      setFormData(prev => ({
        ...prev,
        hiddenTestCases: prev.hiddenTestCases.filter((_, i) => i !== index)
      }));
    }
  };

  // Starter Code handler
  const handleStarterCodeChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      starterCode: { ...prev.starterCode, [lang]: value }
    }));
  };

  // Validate and save
  const validateForm = () => {
    if (!formData.title?.trim()) {
      showError('Please enter the problem title');
      return false;
    }
    if (!formData.description?.trim()) {
      showError('Please enter the problem description');
      return false;
    }
    if (!formData.inputFormat?.trim()) {
      showError('Please enter the input format');
      return false;
    }
    if (!formData.outputFormat?.trim()) {
      showError('Please enter the output format');
      return false;
    }
    if (!formData.constraints?.trim()) {
      showError('Please enter the constraints');
      return false;
    }
    if (formData.exampleIO.some(ex => !ex.input.trim() || !ex.output.trim())) {
      showError('Please complete all example I/O fields');
      return false;
    }
    if (formData.openTestCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
      showError('Please complete all open test cases');
      return false;
    }
    if (formData.hiddenTestCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
      showError('Please complete all hidden test cases');
      return false;
    }
    if (!formData.starterCode?.python?.trim() ||
        !formData.starterCode?.java?.trim() ||
        !formData.starterCode?.javascript?.trim()) {
      showError('Please enter starter code for all languages');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingProblem) {
      setProblems(prev => prev.map(p =>
        p.id === editingProblem.id
          ? { ...formData, id: editingProblem.id, createdAt: editingProblem.createdAt }
          : p
      ));
      showSuccess('Problem updated successfully!');
    } else {
      const newProblem = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProblems(prev => [newProblem, ...prev]);
      showSuccess('Problem created successfully!');
    }
    closeForm();
  };

  const handleDelete = (problemId) => {
    setProblems(prev => prev.filter(p => p.id !== problemId));
    setDeleteConfirm(null);
    showSuccess('Problem deleted successfully!');
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return styles.difficultyEasy;
      case 'Medium': return styles.difficultyMedium;
      case 'Hard': return styles.difficultyHard;
      default: return '';
    }
  };

  // Render list view
  const renderListView = () => (
    <div className={styles.listPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Problem Bank</h1>
          <p className={styles.pageSubtitle}>Manage your coding problems library</p>
        </div>
        <button className={styles.createBtn} onClick={openCreateForm}>
          <Plus size={20} />
          Create Problem
        </button>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search problems by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterSection}>
          <Filter className={styles.filterIcon} size={20} />
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${filterDifficulty === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterDifficulty('all')}
            >
              All
            </button>
            {DIFFICULTY_OPTIONS.map(diff => (
              <button
                key={diff}
                className={`${styles.filterBtn} ${filterDifficulty === diff ? styles.filterBtnActive : ''}`}
                onClick={() => setFilterDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.problemsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <FileText size={24} className={styles.typeIcon} />
            Problems
            <span className={styles.count}>({filteredProblems.length})</span>
          </h2>
        </div>

        {filteredProblems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No problems found. Create your first problem!</p>
          </div>
        ) : (
          <div className={styles.problemsGrid}>
            {filteredProblems.map(problem => (
              <div key={problem.id} className={styles.problemCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <h3 className={styles.cardTitleText}>{problem.title}</h3>
                    <span className={`${styles.difficultyBadge} ${getDifficultyClass(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
                <p className={styles.cardDescription}>{problem.description.substring(0, 150)}...</p>
                <div className={styles.cardTopics}>
                  {problem.topics.map(topic => (
                    <span key={topic} className={styles.topicTag}>{topic}</span>
                  ))}
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.testCount}>
                    <Eye size={14} /> {problem.openTestCases.length} open
                  </span>
                  <span className={styles.testCount}>
                    <EyeOff size={14} /> {problem.hiddenTestCases.length} hidden
                  </span>
                  <span className={styles.createdDate}>Created: {problem.createdAt}</span>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.btnView} onClick={() => setViewingProblem(problem)}>
                    <Eye size={16} /> View
                  </button>
                  <button className={styles.btnEdit} onClick={() => openEditForm(problem)}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className={styles.btnDelete} onClick={() => setDeleteConfirm(problem)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Problem</h3>
            <p className={styles.modalText}>Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className={styles.btnDanger} onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* View Problem Modal */}
      {viewingProblem && (
        <div className={styles.modalOverlay} onClick={() => setViewingProblem(null)}>
          <div className={`${styles.modalContent} ${styles.viewModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{viewingProblem.title}</h3>
              <button className={styles.closeButton} onClick={() => setViewingProblem(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.viewContent}>
              <div className={styles.viewSection}>
                <h4 className={styles.viewSectionTitle}>Description</h4>
                <p className={styles.viewSectionText}>{viewingProblem.description}</p>
              </div>
              <div className={styles.viewGrid}>
                <div className={styles.viewSection}>
                  <h4 className={styles.viewSectionTitle}>Input Format</h4>
                  <p className={styles.viewSectionText}>{viewingProblem.inputFormat}</p>
                </div>
                <div className={styles.viewSection}>
                  <h4 className={styles.viewSectionTitle}>Output Format</h4>
                  <p className={styles.viewSectionText}>{viewingProblem.outputFormat}</p>
                </div>
              </div>
              <div className={styles.viewSection}>
                <h4 className={styles.viewSectionTitle}>Constraints</h4>
                <pre className={styles.viewSectionPre}>{viewingProblem.constraints}</pre>
              </div>
              <div className={styles.viewSection}>
                <h4 className={styles.viewSectionTitle}>Examples</h4>
                {viewingProblem.exampleIO.map((ex, i) => (
                  <div key={i} className={styles.exampleBlock}>
                    <div className={styles.exampleIO}>
                      <div><strong>Input:</strong><pre className={styles.examplePre}>{ex.input}</pre></div>
                      <div><strong>Output:</strong><pre className={styles.examplePre}>{ex.output}</pre></div>
                    </div>
                    {ex.explanation && <p className={styles.explanation}><strong>Explanation:</strong> {ex.explanation}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render form view
  const renderFormView = () => (
    <div className={styles.formPage}>
      <div className={styles.formHeader}>
        <button className={styles.backButton} onClick={closeForm}>
          <ChevronLeft size={16} />
          Back to Problems
        </button>
        <h2 className={styles.formTitle}>{editingProblem ? 'Edit Problem' : 'Create New Problem'}</h2>
      </div>

      <div className={styles.formContainer}>
        {/* Title */}
        <div className={styles.formGroup}>
          <p className={styles.label}>
            <FileText size={16} />
            Problem Title
          </p>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g., Two Sum, Palindrome Checker..."
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
          />
        </div>

        {/* Difficulty and Topics */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <p className={styles.label}>Difficulty</p>
            <select
              className={styles.select}
              value={formData.difficulty}
              onChange={(e) => handleFormChange('difficulty', e.target.value)}
            >
              {DIFFICULTY_OPTIONS.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <p className={styles.label}>Topics</p>
            <div className={styles.topicsSelect}>
              {TOPIC_OPTIONS.map(topic => (
                <button
                  key={topic}
                  type="button"
                  className={`${styles.topicBtn} ${formData.topics.includes(topic) ? styles.topicBtnSelected : ''}`}
                  onClick={() => handleTopicToggle(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <p className={styles.label}>
            <FileText size={16} />
            Problem Description
          </p>
          <textarea
            className={styles.textarea}
            rows="6"
            placeholder="Describe the problem statement in detail..."
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
          />
        </div>

        {/* Input/Output Format */}
        <div className={styles.ioFormatSection}>
          <h3 className={styles.sectionTitleSmall}><Code size={16} /> Input/Output Format</h3>
          <div className={styles.ioFormatGrid}>
            <div className={styles.formGroup}>
              <p className={styles.label}>Input Format</p>
              <textarea
                className={styles.textarea}
                rows="3"
                placeholder="Describe the input format..."
                value={formData.inputFormat}
                onChange={(e) => handleFormChange('inputFormat', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <p className={styles.label}>Output Format</p>
              <textarea
                className={styles.textarea}
                rows="3"
                placeholder="Describe the output format..."
                value={formData.outputFormat}
                onChange={(e) => handleFormChange('outputFormat', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Constraints */}
        <div className={styles.formGroup}>
          <p className={styles.label}>
            <FileText size={16} />
            Constraints
          </p>
          <textarea
            className={styles.textarea}
            rows="3"
            placeholder="e.g., 1 <= n <= 10^5, -10^9 <= arr[i] <= 10^9..."
            value={formData.constraints}
            onChange={(e) => handleFormChange('constraints', e.target.value)}
          />
        </div>

        {/* Example I/O Section */}
        <div className={styles.testCasesSection}>
          <div className={styles.testCasesSectionHeader}>
            <h3 className={styles.sectionTitleSmall}><Eye size={16} /> Example Input/Output</h3>
            <button className={styles.addTestCaseBtn} onClick={addExampleIO}>
              <Plus size={16} /> Add Example
            </button>
          </div>
          <p className={styles.sectionSubtitle}>These examples help students understand the problem.</p>

          {formData.exampleIO.map((example, index) => (
            <div key={index} className={styles.testCaseCard}>
              <div className={styles.testCaseHeader}>
                <span className={styles.testCaseLabel}>Example {index + 1}</span>
                {formData.exampleIO.length > 1 && (
                  <button className={styles.removeTestCaseBtn} onClick={() => removeExampleIO(index)}>
                    Remove
                  </button>
                )}
              </div>
              <div className={styles.testCaseGrid}>
                <div className={styles.formGroup}>
                  <p className={styles.label}>Input</p>
                  <textarea
                    className={styles.textarea}
                    rows="2"
                    placeholder="Example input..."
                    value={example.input}
                    onChange={(e) => handleExampleIOChange(index, 'input', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <p className={styles.label}>Output</p>
                  <textarea
                    className={styles.textarea}
                    rows="2"
                    placeholder="Expected output..."
                    value={example.output}
                    onChange={(e) => handleExampleIOChange(index, 'output', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <p className={styles.label}>Explanation (Optional)</p>
                <textarea
                  className={styles.textarea}
                  rows="2"
                  placeholder="Explain why this output is correct..."
                  value={example.explanation}
                  onChange={(e) => handleExampleIOChange(index, 'explanation', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Open Test Cases Section */}
        <div className={styles.testCasesSection}>
          <div className={styles.testCasesSectionHeader}>
            <h3 className={styles.sectionTitleSmall}><Eye size={16} /> Open Test Cases</h3>
            <button className={styles.addTestCaseBtn} onClick={addOpenTestCase}>
              <Plus size={16} /> Add Open Test Case
            </button>
          </div>
          <p className={styles.sectionSubtitle}>Students can run their code against these test cases.</p>

          {formData.openTestCases.map((testCase, index) => (
            <div key={index} className={styles.testCaseCard}>
              <div className={styles.testCaseHeader}>
                <span className={styles.testCaseLabel}>Open Case {index + 1}</span>
                {formData.openTestCases.length > 1 && (
                  <button className={styles.removeTestCaseBtn} onClick={() => removeOpenTestCase(index)}>
                    Remove
                  </button>
                )}
              </div>
              <div className={styles.testCaseGrid}>
                <div className={styles.formGroup}>
                  <p className={styles.label}>Input</p>
                  <textarea
                    className={styles.textarea}
                    rows="3"
                    placeholder="Test case input..."
                    value={testCase.input}
                    onChange={(e) => handleOpenTestCaseChange(index, 'input', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <p className={styles.label}>Expected Output</p>
                  <textarea
                    className={styles.textarea}
                    rows="3"
                    placeholder="Expected output..."
                    value={testCase.output}
                    onChange={(e) => handleOpenTestCaseChange(index, 'output', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Starter Code Section */}
        <div className={styles.starterCodeSection}>
          <h3 className={styles.sectionTitleSmall}><Code size={16} /> Starter Code</h3>
          <div className={styles.starterCodeGrid}>
            <div className={styles.formGroup}>
              <p className={styles.label}>Python</p>
              <textarea
                className={`${styles.textarea} ${styles.codeTextarea}`}
                rows="5"
                placeholder="Python starter code..."
                value={formData.starterCode.python}
                onChange={(e) => handleStarterCodeChange('python', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <p className={styles.label}>Java</p>
              <textarea
                className={`${styles.textarea} ${styles.codeTextarea}`}
                rows="7"
                placeholder="Java starter code..."
                value={formData.starterCode.java}
                onChange={(e) => handleStarterCodeChange('java', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <p className={styles.label}>JavaScript</p>
              <textarea
                className={`${styles.textarea} ${styles.codeTextarea}`}
                rows="5"
                placeholder="JavaScript starter code..."
                value={formData.starterCode.javascript}
                onChange={(e) => handleStarterCodeChange('javascript', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Hidden Test Cases Section */}
        <div className={styles.testCasesSection}>
          <div className={styles.testCasesSectionHeader}>
            <h3 className={styles.sectionTitleSmall}><EyeOff size={16} /> Hidden Test Cases</h3>
            <button className={styles.addTestCaseBtn} onClick={addHiddenTestCase}>
              <Plus size={16} /> Add Hidden Test Case
            </button>
          </div>
          <p className={styles.sectionSubtitle}>These test cases are used for judging and are NOT visible to students.</p>

          {formData.hiddenTestCases.map((testCase, index) => (
            <div key={index} className={styles.testCaseCard}>
              <div className={styles.testCaseHeader}>
                <span className={styles.testCaseLabel}>Hidden Case {index + 1}</span>
                {formData.hiddenTestCases.length > 1 && (
                  <button className={styles.removeTestCaseBtn} onClick={() => removeHiddenTestCase(index)}>
                    Remove
                  </button>
                )}
              </div>
              <div className={styles.testCaseGrid}>
                <div className={styles.formGroup}>
                  <p className={styles.label}>Input</p>
                  <textarea
                    className={styles.textarea}
                    rows="3"
                    placeholder="Test case input..."
                    value={testCase.input}
                    onChange={(e) => handleHiddenTestCaseChange(index, 'input', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <p className={styles.label}>Expected Output</p>
                  <textarea
                    className={styles.textarea}
                    rows="3"
                    placeholder="Expected output..."
                    value={testCase.output}
                    onChange={(e) => handleHiddenTestCaseChange(index, 'output', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button className={styles.backButton} onClick={closeForm}>
            <ChevronLeft size={16} />
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            <Save size={16} />
            {editingProblem ? 'Update Problem' : 'Save Problem'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <AdminNavbar />
      <div className={styles.content}>
        {isFormOpen ? renderFormView() : renderListView()}
      </div>
    </div>
  );
}

export default ProblemBank;
