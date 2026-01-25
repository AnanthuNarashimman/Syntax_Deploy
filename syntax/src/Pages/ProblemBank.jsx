// /syntax/src/Pages/ProblemBank.jsx
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
  Filter,
  Loader
} from 'lucide-react';
import styles from '../Styles/PageStyles/ProblemBank.module.css';
import AdminNavbar from "../Components/AdminNavbar";
import { useAlert } from '../contexts/AlertContext';

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const TOPIC_OPTIONS = ['Arrays', 'Strings', 'Hash Table', 'Binary Search', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Recursion', 'Sorting'];

function ProblemBank() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useAlert();

  // All useState hooks must be at the top, before any conditional returns
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [viewingProblem, setViewingProblem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
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

  // Fetch problems from API
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/problem-bank`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems || []);
      } else {
        showError('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      showError('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          setAuthLoading(false);
          fetchProblems();
        } else {
          navigate('/admin-login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/admin-login');
      }
    };

    checkAuth();
  }, [navigate]);

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

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editingProblem) {
        // Update existing problem
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/problem-bank/${editingProblem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          showSuccess('Problem updated successfully!');
          fetchProblems();
          closeForm();
        } else {
          const data = await response.json();
          showError(data.message || 'Failed to update problem');
        }
      } else {
        // Create new problem
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/problem-bank`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          showSuccess('Problem created successfully!');
          fetchProblems();
          closeForm();
        } else {
          const data = await response.json();
          showError(data.message || 'Failed to create problem');
        }
      }
    } catch (error) {
      console.error('Error saving problem:', error);
      showError('Failed to save problem');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (problemId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/problem-bank/${problemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        showSuccess('Problem deleted successfully!');
        fetchProblems();
      } else {
        const data = await response.json();
        showError(data.message || 'Failed to delete problem');
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
      showError('Failed to delete problem');
    } finally {
      setDeleteConfirm(null);
    }
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

        {loading ? (
          <div className={styles.emptyState}>
            <Loader size={24} className={styles.spinner} />
            <p>Loading problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{searchQuery || filterDifficulty !== 'all' ? 'No problems match your search criteria.' : 'No problems available. Create your first problem!'}</p>
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
          <button className={styles.backButton} onClick={closeForm} disabled={saving}>
            <ChevronLeft size={16} />
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? <Loader size={16} className={styles.spinner} /> : <Save size={16} />}
            {saving ? 'Saving...' : (editingProblem ? 'Update Problem' : 'Save Problem')}
          </button>
        </div>
      </div>
    </div>
  );

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className={styles.wrapper}>
        <AdminNavbar />
        <div className={styles.content}>
          <div className={styles.listPage}>
            <div className={styles.emptyState}>
              <Loader size={32} className={styles.spinner} />
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
