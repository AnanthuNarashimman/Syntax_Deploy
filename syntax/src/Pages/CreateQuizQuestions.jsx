import { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Check,
    Calculator,
    Home,
    Plus,
    Settings,
    MessageSquare,
    User,
    Users,
    Trophy,
    Clock,
    TrendingUp,
    Calendar,
    Award,
    Activity,
    Upload,
    Download,
    Copy,
    Trash2,
    FileSpreadsheet,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import '../Styles/PageStyles/CreateQuizQuestions.css';
import AdminNavbar from "../Components/AdminNavbar";
import { useNavigate } from 'react-router-dom';
import { useContestContext } from '../contexts/ContestContext';
import { useAlert } from '../contexts/AlertContext';

function CreateQuizQuestions() {

    const navigate = useNavigate();
    const { addNewEvent } = useContestContext();
    const { showError, showSuccess } = useAlert();

    const [totalQuestions, setTotalQuestions] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [activeTab, setActiveTabState] = useState('create');

    // Import method state
    const [importMethod, setImportMethod] = useState('manual');

    // Excel import state
    const [excelFile, setExcelFile] = useState(null);
    const [parseErrors, setParseErrors] = useState([]);
    const [excelParsed, setExcelParsed] = useState(false);

    // Smart import state
    const [smartImportData, setSmartImportData] = useState({
        topic: '',
        numberOfQuestions: 10,
        focusSubtopics: '',
        avoidSubtopics: ''
    });
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [jsonInput, setJsonInput] = useState('');
    const [jsonParseError, setJsonParseError] = useState('');
    const [promptCopied, setPromptCopied] = useState(false);

    // Load import method from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('contestFormData');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.importMethod) {
                setImportMethod(data.importMethod);
            }
        }
    }, []);

    const sidebarItems = [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'create', label: 'Create Contest', icon: Plus },
        { id: 'manage', label: 'Manage Events', icon: Settings },
        { id: 'participants', label: 'Participants', icon: Users },
        // { id: 'analytics', label: 'Analytics', icon: TrendingUp }, // Under development
        { id: 'profile', label: 'Profile', icon: User }
    ];

    const setActiveTab = (tab) => {
        setActiveTabState(tab);
        // Map tab id to route
        const tabRoutes = {
            home: '/admin-dashboard',
            create: '/create-contest',
            manage: '/manage-contest',
            participants: '/manage-participants',
            analytics: '/analytics',
            profile: '/admin-profile',
        };
        if (tabRoutes[tab]) {
            navigate(tabRoutes[tab]);
        }
    };

    const handleQuestionCountSubmit = (e) => {
        e.preventDefault();
        if (totalQuestions > 0) {
            const initialQuestions = Array.from({ length: totalQuestions }, (_, index) => ({
                id: index + 1,
                question: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            }));
            setQuestions(initialQuestions);
            setShowQuestionForm(true);
            setCurrentQuestion(0);
        }
    };

    const handleQuestionChange = (field, value, optionIndex = null) => {
        const updatedQuestions = [...questions];

        if (field === 'question') {
            updatedQuestions[currentQuestion].question = value;
        } else if (field === 'option') {
            updatedQuestions[currentQuestion].options[optionIndex] = value;
        } else if (field === 'correctAnswer') {
            updatedQuestions[currentQuestion].correctAnswer = value;
        }

        setQuestions(updatedQuestions);
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleQuestionsComplete = async () => {
        // Directly save the quiz with auto-calculated points (1 point per question)
        await handleScoreSubmit();
    };

    const handleScoreSubmit = async () => {
        // Get contest general data from localStorage
        let contestGeneralData = {};

        try {
            const stored = localStorage.getItem('contestFormData');
            if (stored) {
                contestGeneralData = JSON.parse(stored);
                console.log('Found contest data in localStorage:', contestGeneralData);
            } else {
                throw new Error('No contest data found in localStorage');
            }
        } catch (e) {
            showError('Quiz general information not found. Please go back and fill in the quiz details first.');
            console.error('Error retrieving contest data:', e);
            return;
        }

        // Check if we have the required data
        if (!contestGeneralData.title || !contestGeneralData.description) {
            showError('Quiz title and description not found. Please go back and fill in the quiz details first.');
            console.error('Missing required contest data. Available data:', contestGeneralData);
            return;
        }

        // Assemble the data to send to the backend
        const dataToSend = {
            contestTitle: contestGeneralData.title,
            contestDescription: contestGeneralData.description,
            duration: contestGeneralData.duration,
            pointsPerProgram: 1, // Always 1 point per quiz question
            contestType: contestGeneralData.type, // Should be "quiz"
            contestMode: contestGeneralData.mode,
            topicsCovered: contestGeneralData.topicsCovered,
            allowedDepartments: contestGeneralData.allowedDepartments,
            numberOfQuestions: totalQuestions,
            questions: questions, // Array of quiz questions
        };

        console.log('Data being sent to API:', dataToSend);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/create-contest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                showError(`Failed to create quiz: ${errorData.message || 'Unknown error'}`);
                console.error('API Error:', errorData);
                return;
            }

            const result = await response.json();
            showSuccess('Quiz created successfully!');
            console.log('Quiz creation success:', result);

            // Add the new event to the context
            if (result.event) {
                addNewEvent(result.event);
            }

            // Clear localStorage
            localStorage.removeItem('contestFormData');

            // Reset form
            setTotalQuestions(0);
            setCurrentQuestion(0);
            setShowQuestionForm(false);
            setQuestions([]);

            // Navigate to manage page
            navigate('/manage-contest');

        } catch (error) {
            console.error('Network or unexpected error:', error);
            showError('An unexpected error occurred while saving the quiz. Please check the console for details.');
        }
    };

    const isCurrentQuestionValid = () => {
        const current = questions[currentQuestion];
        return current &&
            current.question.trim() !== '' &&
            current.options.every(option => option.trim() !== '') &&
            current.correctAnswer.trim() !== '';
    };

    const areAllQuestionsValid = () => {
        return questions.every(q =>
            q.question.trim() !== '' &&
            q.options.every(option => option.trim() !== '') &&
            q.correctAnswer.trim() !== ''
        );
    };

    // ============== EXCEL IMPORT FUNCTIONS ==============

    const handleExcelFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            processExcelFile(file);
        }
    };

    const handleExcelDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            processExcelFile(file);
        }
    };

    const processExcelFile = (file) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
            showError('Please upload a valid Excel file (.xlsx or .xls)');
            return;
        }

        setExcelFile(file);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(sheet);

                if (data.length === 0) {
                    showError('The Excel file is empty');
                    return;
                }

                const parsedQuestions = [];
                const errors = [];

                data.forEach((row, index) => {
                    const question = {
                        id: index + 1,
                        question: row['Question'] || row['question'] || row['QUESTION'] || '',
                        options: [
                            row['Option A'] || row['option_a'] || row['Option a'] || row['A'] || '',
                            row['Option B'] || row['option_b'] || row['Option b'] || row['B'] || '',
                            row['Option C'] || row['option_c'] || row['Option c'] || row['C'] || '',
                            row['Option D'] || row['option_d'] || row['Option d'] || row['D'] || ''
                        ],
                        correctAnswer: ''
                    };

                    // Map correct answer
                    const correct = row['Correct Answer'] || row['correct_answer'] || row['Answer'] || row['answer'] || row['Correct'] || '';
                    const correctStr = String(correct).trim().toUpperCase();

                    if (['A', 'B', 'C', 'D'].includes(correctStr)) {
                        const idx = correctStr.charCodeAt(0) - 65;
                        question.correctAnswer = question.options[idx];
                    } else {
                        // Try to match the text directly
                        question.correctAnswer = correct;
                    }

                    // Validate
                    if (!question.question.trim()) {
                        errors.push(`Row ${index + 2}: Missing question text`);
                    }
                    const filledOptions = question.options.filter(o => o && o.toString().trim());
                    if (filledOptions.length < 4) {
                        errors.push(`Row ${index + 2}: Missing some options (found ${filledOptions.length}/4)`);
                    }
                    if (!question.correctAnswer || !question.options.includes(question.correctAnswer)) {
                        errors.push(`Row ${index + 2}: Correct answer doesn't match any option`);
                    }

                    parsedQuestions.push(question);
                });

                setQuestions(parsedQuestions);
                setTotalQuestions(parsedQuestions.length);
                setParseErrors(errors);
                setExcelParsed(true);

                if (errors.length === 0) {
                    showSuccess(`Successfully parsed ${parsedQuestions.length} questions!`);
                }
            } catch (err) {
                showError('Failed to parse Excel file: ' + err.message);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const downloadTemplate = () => {
        const template = [
            {
                'Question': 'What is 2 + 2?',
                'Option A': '3',
                'Option B': '4',
                'Option C': '5',
                'Option D': '6',
                'Correct Answer': 'B'
            },
            {
                'Question': 'Which planet is closest to the Sun?',
                'Option A': 'Venus',
                'Option B': 'Earth',
                'Option C': 'Mercury',
                'Option D': 'Mars',
                'Correct Answer': 'C'
            }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Questions');
        XLSX.writeFile(wb, 'quiz_questions_template.xlsx');
    };

    // ============== SMART IMPORT FUNCTIONS ==============

    const generatePrompt = () => {
        const { topic, numberOfQuestions, focusSubtopics, avoidSubtopics } = smartImportData;

        if (!topic.trim()) {
            showError('Please enter a topic');
            return;
        }

        const prompt = `Generate exactly ${numberOfQuestions} multiple choice quiz questions about "${topic}".

${focusSubtopics.trim() ? `FOCUS on these subtopics: ${focusSubtopics}` : ''}
${avoidSubtopics.trim() ? `AVOID these subtopics: ${avoidSubtopics}` : ''}

CRITICAL INSTRUCTIONS:
1. Output valid JSON wrapped in a code block using triple backticks
2. Do NOT use Canvas, Artifacts, or any interactive features
3. Format your response as: \`\`\`json followed by the JSON array, then closing \`\`\`
4. Each question must have exactly 4 unique options
5. The correctAnswer must exactly match one of the options word-for-word

Required JSON format inside code block:
\`\`\`json
[
  {
    "question": "Your question text here?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": "Option B text"
  }
]
\`\`\`

Generate ${numberOfQuestions} questions now. Remember: wrap the JSON array in a code block with triple backticks.`;

        setGeneratedPrompt(prompt);
    };

    const copyPromptToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            setPromptCopied(true);
            showSuccess('Prompt copied to clipboard!');
            setTimeout(() => setPromptCopied(false), 2000);
        } catch (err) {
            showError('Failed to copy prompt');
        }
    };

    const parseJsonInput = () => {
        try {
            let cleaned = jsonInput.trim();

            // Remove markdown code blocks if present
            if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?\s*```$/i, '');
            }

            // Try to find JSON array in the text
            const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                cleaned = jsonMatch[0];
            }

            const parsed = JSON.parse(cleaned);

            if (!Array.isArray(parsed)) {
                throw new Error('Expected an array of questions');
            }

            if (parsed.length === 0) {
                throw new Error('No questions found in the JSON');
            }

            const parsedQuestions = parsed.map((q, index) => ({
                id: index + 1,
                question: q.question || '',
                options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['', '', '', ''],
                correctAnswer: q.correctAnswer || ''
            }));

            // Validate and collect errors
            const errors = [];
            parsedQuestions.forEach((q, i) => {
                if (!q.question.trim()) {
                    errors.push(`Question ${i + 1}: Missing question text`);
                }
                if (q.options.length !== 4) {
                    errors.push(`Question ${i + 1}: Must have exactly 4 options`);
                }
                if (q.options.filter(o => o && o.trim()).length < 4) {
                    errors.push(`Question ${i + 1}: Some options are empty`);
                }
                if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
                    errors.push(`Question ${i + 1}: Correct answer doesn't match any option`);
                }
            });

            if (errors.length > 0) {
                setJsonParseError(errors.join('\n'));
                // Still set the questions so user can edit them
                setQuestions(parsedQuestions);
                setTotalQuestions(parsedQuestions.length);
            } else {
                setQuestions(parsedQuestions);
                setTotalQuestions(parsedQuestions.length);
                setJsonParseError('');
                showSuccess(`Successfully parsed ${parsedQuestions.length} questions!`);
            }
        } catch (err) {
            setJsonParseError(`Invalid JSON: ${err.message}`);
        }
    };

    // ============== QUESTION MANAGEMENT FUNCTIONS ==============

    const addQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        };
        setQuestions([...questions, newQuestion]);
        setTotalQuestions(totalQuestions + 1);
        setCurrentQuestion(questions.length);
    };

    const deleteQuestion = (index) => {
        if (questions.length <= 1) {
            showError('Quiz must have at least one question');
            return;
        }
        const updated = questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, id: i + 1 }));
        setQuestions(updated);
        setTotalQuestions(updated.length);
        if (currentQuestion >= updated.length) {
            setCurrentQuestion(updated.length - 1);
        }
    };

    // ============== RENDER FUNCTIONS ==============

    const renderQuestionCountForm = () => (
        <div className="question-count-container">
            <h2 className="form-title">Set Number of Questions</h2>
            <p className="form-subtitle">How many questions would you like to add to your quiz?</p>

            <div className="question-count-form">
                <div className="input-group">
                    <label htmlFor="questionCount">Number of Questions</label>
                    <input
                        type="number"
                        id="questionCount"
                        min="1"
                        max="50"
                        value={totalQuestions}
                        onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 0)}
                        placeholder="Enter number of questions"
                        required
                    />
                </div>

                <button
                    type="button"
                    className="continue-button"
                    onClick={handleQuestionCountSubmit}
                    disabled={totalQuestions <= 0}
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderQuestionForm = () => (
        <div className="question-form-container">
            <div className="question-header">
                <h2 className="form-title">
                    Question {currentQuestion + 1} of {totalQuestions}
                </h2>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="question-card">
                <div className="question-input-group">
                    <label htmlFor="question">Question</label>
                    <textarea
                        id="question"
                        value={questions[currentQuestion]?.question || ''}
                        onChange={(e) => handleQuestionChange('question', e.target.value)}
                        placeholder="Enter your question here..."
                        rows="3"
                        required
                    />
                </div>

                <div className="options-container">
                    <label>Answer Options</label>
                    {questions[currentQuestion]?.options.map((option, index) => (
                        <div key={index} className="option-input-group">
                            <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleQuestionChange('option', e.target.value, index)}
                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                required
                            />
                        </div>
                    ))}
                </div>

                <div className="correct-answer-group">
                    <label htmlFor="correctAnswer">Correct Answer</label>
                    <select
                        id="correctAnswer"
                        value={questions[currentQuestion]?.correctAnswer || ''}
                        onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                        required
                    >
                        <option value="">Select correct answer</option>
                        {questions[currentQuestion]?.options.map((option, index) => (
                            <option key={index} value={option} disabled={!option.trim()}>
                                {String.fromCharCode(65 + index)}. {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="question-navigation">
                <button
                    type="button"
                    className="nav-button prev-button"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                <div className="question-indicators">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`question-indicator ${index === currentQuestion ? 'active' : ''} ${questions[index] &&
                                questions[index].question.trim() &&
                                questions[index].options.every(opt => opt.trim()) &&
                                questions[index].correctAnswer.trim() ? 'completed' : ''
                                }`}
                            onClick={() => setCurrentQuestion(index)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                {currentQuestion === totalQuestions - 1 ? (
                    <button
                        type="button"
                        className="nav-button submit-button"
                        onClick={handleQuestionsComplete}
                        disabled={!areAllQuestionsValid()}
                    >
                        <Check size={16} />
                        Create Quiz
                    </button>
                ) : (
                    <button
                        type="button"
                        className="nav-button next-button"
                        onClick={handleNext}
                        disabled={!isCurrentQuestionValid()}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );

    const renderExcelImport = () => (
        <div className="excel-import-container">
            <h2 className="form-title">Import Questions from Excel</h2>
            <p className="form-subtitle">Upload an Excel file (.xlsx) with your quiz questions</p>

            <div className="template-download">
                <p>Download our template to see the required format:</p>
                <button className="template-button" onClick={downloadTemplate}>
                    <Download size={16} />
                    Download Template
                </button>
            </div>

            <div
                className={`excel-dropzone ${excelFile ? 'has-file' : ''}`}
                onDrop={handleExcelDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onClick={() => document.getElementById('excel-file-input').click()}
            >
                <input
                    type="file"
                    id="excel-file-input"
                    accept=".xlsx,.xls"
                    style={{ display: 'none' }}
                    onChange={handleExcelFileSelect}
                />
                <div className="dropzone-content">
                    <FileSpreadsheet size={48} className="dropzone-icon" />
                    {excelFile ? (
                        <p className="dropzone-text">{excelFile.name}</p>
                    ) : (
                        <>
                            <p className="dropzone-text">Drag & drop your Excel file here</p>
                            <p className="dropzone-hint">or click to browse</p>
                        </>
                    )}
                </div>
            </div>

            {parseErrors.length > 0 && (
                <div className="parse-errors">
                    <div className="error-header">
                        <AlertCircle size={16} />
                        <span>Issues found ({parseErrors.length}):</span>
                    </div>
                    <ul>
                        {parseErrors.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                    <p className="error-note">You can still continue and fix these in the editor.</p>
                </div>
            )}

            {excelParsed && questions.length > 0 && (
                <div className="import-preview">
                    <div className="preview-header">
                        <Check size={20} className="success-icon" />
                        <span>Found {questions.length} questions</span>
                    </div>
                    <button
                        className="continue-button"
                        onClick={() => setShowQuestionForm(true)}
                    >
                        Continue to Edit Questions
                    </button>
                </div>
            )}
        </div>
    );

    const renderSmartImport = () => {
        // Step 1: Show form to configure prompt
        if (!generatedPrompt) {
            return (
                <div className="smart-import-container">
                    <h2 className="form-title">Smart Import - AI Question Generator</h2>
                    <p className="form-subtitle">Configure your quiz and we'll generate a prompt for any AI</p>

                    <div className="smart-import-form">
                        <div className="input-group">
                            <label htmlFor="topic">Topic *</label>
                            <input
                                type="text"
                                id="topic"
                                value={smartImportData.topic}
                                onChange={(e) => setSmartImportData({ ...smartImportData, topic: e.target.value })}
                                placeholder="e.g., JavaScript Fundamentals, World History, Biology"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="numQuestions">Number of Questions *</label>
                            <input
                                type="number"
                                id="numQuestions"
                                min="1"
                                max="50"
                                value={smartImportData.numberOfQuestions}
                                onChange={(e) => setSmartImportData({ ...smartImportData, numberOfQuestions: parseInt(e.target.value) || 10 })}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="focusSubtopics">Subtopics to Focus On (optional)</label>
                            <textarea
                                id="focusSubtopics"
                                value={smartImportData.focusSubtopics}
                                onChange={(e) => setSmartImportData({ ...smartImportData, focusSubtopics: e.target.value })}
                                placeholder="e.g., closures, async/await, promises"
                                rows="2"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="avoidSubtopics">Subtopics to Avoid (optional)</label>
                            <textarea
                                id="avoidSubtopics"
                                value={smartImportData.avoidSubtopics}
                                onChange={(e) => setSmartImportData({ ...smartImportData, avoidSubtopics: e.target.value })}
                                placeholder="e.g., DOM manipulation, browser APIs"
                                rows="2"
                            />
                        </div>

                        <button
                            className="generate-prompt-button"
                            onClick={generatePrompt}
                            disabled={!smartImportData.topic.trim()}
                        >
                            <Sparkles size={16} />
                            Generate Prompt
                        </button>
                    </div>
                </div>
            );
        }

        // Step 2: Show generated prompt and JSON input
        if (questions.length === 0) {
            return (
                <div className="smart-import-container">
                    <h2 className="form-title">Copy Prompt & Paste Response</h2>
                    <p className="form-subtitle">Use this prompt with ChatGPT, Claude, or any AI assistant</p>

                    <div className="prompt-section">
                        <div className="prompt-header">
                            <label>Generated Prompt:</label>
                            <button
                                className={`copy-button ${promptCopied ? 'copied' : ''}`}
                                onClick={copyPromptToClipboard}
                            >
                                <Copy size={14} />
                                {promptCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="prompt-display">
                            <pre>{generatedPrompt}</pre>
                        </div>
                    </div>

                    <div className="json-input-section">
                        <label htmlFor="jsonInput">Paste AI Response Here:</label>
                        <textarea
                            id="jsonInput"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder="Paste the JSON response from the AI here..."
                            rows="10"
                            className="json-textarea"
                        />

                        {jsonParseError && (
                            <div className="json-error">
                                <AlertCircle size={16} />
                                <pre>{jsonParseError}</pre>
                            </div>
                        )}

                        <div className="json-actions">
                            <button
                                className="back-button-small"
                                onClick={() => {
                                    setGeneratedPrompt('');
                                    setJsonInput('');
                                    setJsonParseError('');
                                }}
                            >
                                <ChevronLeft size={14} />
                                Back to Form
                            </button>
                            <button
                                className="parse-button"
                                onClick={parseJsonInput}
                                disabled={!jsonInput.trim()}
                            >
                                Parse & Import
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Step 3: Show preview of imported questions
        return (
            <div className="smart-import-container">
                <div className="import-preview">
                    <div className="preview-header">
                        <Check size={20} className="success-icon" />
                        <span>Imported {questions.length} questions</span>
                    </div>
                    {jsonParseError && (
                        <div className="parse-warnings">
                            <AlertCircle size={16} />
                            <span>Some issues were found - you can fix them in the editor</span>
                        </div>
                    )}
                    <button
                        className="continue-button"
                        onClick={() => setShowQuestionForm(true)}
                    >
                        Continue to Edit Questions
                    </button>
                </div>
            </div>
        );
    };

    const renderQuestionFormWithActions = () => (
        <div className="question-form-container">
            <div className="question-header">
                <h2 className="form-title">
                    Question {currentQuestion + 1} of {totalQuestions}
                </h2>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Actions - Add/Delete */}
            <div className="question-actions">
                <button className="add-question-btn" onClick={addQuestion}>
                    <Plus size={16} />
                    Add Question
                </button>
                <button
                    className="delete-question-btn"
                    onClick={() => deleteQuestion(currentQuestion)}
                    disabled={questions.length <= 1}
                >
                    <Trash2 size={16} />
                    Delete This Question
                </button>
            </div>

            <div className="question-card">
                <div className="question-input-group">
                    <label htmlFor="question">Question</label>
                    <textarea
                        id="question"
                        value={questions[currentQuestion]?.question || ''}
                        onChange={(e) => handleQuestionChange('question', e.target.value)}
                        placeholder="Enter your question here..."
                        rows="3"
                        required
                    />
                </div>

                <div className="options-container">
                    <label>Answer Options</label>
                    {questions[currentQuestion]?.options.map((option, index) => (
                        <div key={index} className="option-input-group">
                            <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleQuestionChange('option', e.target.value, index)}
                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                required
                            />
                        </div>
                    ))}
                </div>

                <div className="correct-answer-group">
                    <label htmlFor="correctAnswer">Correct Answer</label>
                    <select
                        id="correctAnswer"
                        value={questions[currentQuestion]?.correctAnswer || ''}
                        onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                        required
                    >
                        <option value="">Select correct answer</option>
                        {questions[currentQuestion]?.options.map((option, index) => (
                            <option key={index} value={option} disabled={!option.trim()}>
                                {String.fromCharCode(65 + index)}. {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="question-navigation">
                <button
                    type="button"
                    className="nav-button prev-button"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                <div className="question-indicators">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`question-indicator ${index === currentQuestion ? 'active' : ''} ${questions[index] &&
                                questions[index].question.trim() &&
                                questions[index].options.every(opt => opt.trim()) &&
                                questions[index].correctAnswer.trim() ? 'completed' : ''
                                }`}
                            onClick={() => setCurrentQuestion(index)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                {currentQuestion === totalQuestions - 1 ? (
                    <button
                        type="button"
                        className="nav-button submit-button"
                        onClick={handleQuestionsComplete}
                        disabled={!areAllQuestionsValid()}
                    >
                        <Check size={16} />
                        Create Quiz
                    </button>
                ) : (
                    <button
                        type="button"
                        className="nav-button next-button"
                        onClick={handleNext}
                        disabled={!isCurrentQuestionValid()}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );

    // Determine which content to show based on import method and state
    const renderContent = () => {
        // If question form is shown, always show it (with actions for imported questions)
        if (showQuestionForm) {
            if (importMethod === 'manual') {
                return renderQuestionForm();
            } else {
                return renderQuestionFormWithActions();
            }
        }

        // Otherwise show appropriate import interface
        switch (importMethod) {
            case 'excel':
                return renderExcelImport();
            case 'smart':
                return renderSmartImport();
            case 'manual':
            default:
                return renderQuestionCountForm();
        }
    };

    return (
        <div className="create-quiz-questions">
            <AdminNavbar />
            <div className="content-wrapper">
                <div className="page-header">
                    <button
                        className="back-to-create"
                        onClick={() => { navigate(-1) }}
                    >
                        <ChevronLeft size={16} />
                        Back to Create Contest
                    </button>
                    <h1>Create Quiz Questions</h1>
                    {importMethod !== 'manual' && !showQuestionForm && (
                        <span className="import-method-badge">
                            {importMethod === 'excel' ? 'Excel Import' : 'Smart Import'}
                        </span>
                    )}
                </div>

                {renderContent()}
            </div>
        </div>
    );
}

export default CreateQuizQuestions