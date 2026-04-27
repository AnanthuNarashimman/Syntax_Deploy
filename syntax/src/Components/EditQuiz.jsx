import { useEffect, useState } from "react";
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
    AlertCircle,
    ArrowLeft,
    AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Styles/PageStyles/EditQuiz.css';

import { useContestContext } from "../contexts/ContestContext";
import { useAlert } from "../contexts/AlertContext";

function EditQuiz({ questions: initialQuestions, onSave, eventId, onCancel }) {

    const { updateEventData } = useContestContext();
    const { showSuccess, showError } = useAlert();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState(initialQuestions || []);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);

    useEffect(() => {
        setTotalQuestions(questions.length);
    }, [questions]);

    const addQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        };
        setQuestions([...questions, newQuestion]);
        setTotalQuestions(questions.length + 1);
        setCurrentQuestion(questions.length);
    };

    const deleteQuestion = (index) => {
        if (questions.length <= 1) {
            alert('Quiz must have at least one question');
            return;
        }
        const updated = questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, id: i + 1 }));
        setQuestions(updated);
        setTotalQuestions(updated.length);
        if (currentQuestion >= updated.length) {
            setCurrentQuestion(updated.length - 1);
        }
    };

    const handleQuestionChange = (field, value, optionIndex = null) => {
        setQuestions(prevQuestions => {
            const updated = [...prevQuestions];
            if (optionIndex !== null) {
                updated[currentQuestion] = {
                    ...updated[currentQuestion],
                    options: updated[currentQuestion].options.map((opt, idx) =>
                        idx === optionIndex ? value : opt
                    )
                };
            } else {
                updated[currentQuestion] = {
                    ...updated[currentQuestion],
                    [field]: value
                };
            }
            return updated;
        });
    };

    const renderHighlightedText = (text) => {
        if (!text) return null;

        // Split by ** markers and render highlighted parts
        const parts = text.split(/(\*\*.*?\*\*)/g);

        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // Remove ** and render as highlighted
                const content = part.slice(2, -2);
                return <mark key={index} className="highlighted-text">{content}</mark>;
            }
            return <span key={index}>{part}</span>;
        });
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

    const isCurrentQuestionValid = () => {
        const current = questions[currentQuestion];
        return current &&
            String(current.question).trim() !== '' &&
            current.options.every(option => String(option).trim() !== '') &&
            String(current.correctAnswer).trim() !== '';
    };

    const areAllQuestionsValid = () => {
        return questions.every(q =>
            String(q.question).trim() !== '' &&
            q.options.every(option => String(option).trim() !== '') &&
            String(q.correctAnswer).trim() !== ''
        );
    };

    const handleQuestionsUpdate = () => {
        setShowSaveConfirm(true);
    };

    const confirmSave = async () => {
        setShowSaveConfirm(false);
        try {
            await updateEventData(eventId, { questions: questions });
            showSuccess('Questions updated successfully!');
            onCancel();
        } catch (err) {
            showError(`Error updating questions: ${err.message}`);
        }
    };

    const handleLeave = () => {
        setShowLeaveConfirm(true);
    };

    const confirmLeave = () => {
        setShowLeaveConfirm(false);
        onCancel();
    };


    return (
        <div className="edit-quiz-page">
            <div className="edit-quiz-wrapper">
                <div className="question-form-container">
                    <div className="question-header">
                        <div className="header-top">
                            <button className="back-btn" onClick={handleLeave}>
                                <ArrowLeft size={18} />
                                Back
                            </button>
                        </div>
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
                            {questions[currentQuestion]?.question?.includes('**') && (
                                <div className="question-preview">
                                    <div className="preview-label">Preview:</div>
                                    <div className="preview-content">
                                        {renderHighlightedText(questions[currentQuestion]?.question)}
                                    </div>
                                </div>
                            )}
                            <textarea
                                id="question"
                                value={questions[currentQuestion]?.question || ''}
                                onChange={(e) => handleQuestionChange('question', e.target.value)}
                                placeholder="Enter your question here..."
                                rows="3"
                                required
                            />
                            <div className="input-hint">
                                💡 Tip: Use **text** to highlight important parts
                            </div>
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
                                    <option key={index} value={option} disabled={!String(option).trim()}>
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
                                        String(questions[index].question).trim() &&
                                        questions[index].options.every(opt => String(opt).trim()) &&
                                        String(questions[index].correctAnswer).trim() ? 'completed' : ''
                                        }`}
                                    onClick={() => setCurrentQuestion(index)}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="nav-button submit-button"
                            onClick={handleQuestionsUpdate}
                            disabled={!areAllQuestionsValid()}
                        >
                            <Check size={16} />
                            Update
                        </button>

                    </div>
                </div>
            </div>

            {showSaveConfirm && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowSaveConfirm(false); }}>
                    <div className="modal-content leave-confirm-modal">
                        <div className="modal-header">
                            <h3>
                                <Check size={20} style={{ marginRight: '8px', color: '#28a745' }} />
                                Save Changes
                            </h3>
                            <button
                                className="close-button"
                                onClick={() => setShowSaveConfirm(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="leave-confirm-content">
                            <p className="confirm-message">
                                Are you sure you want to save these changes?
                            </p>
                            <div className="warning-box" style={{ backgroundColor: '#d4edda', borderColor: '#28a745' }}>
                                <Check size={18} style={{ color: '#155724' }} />
                                <div className="warning-content">
                                    <p className="warning-title" style={{ color: '#155724' }}>Summary:</p>
                                    <ul style={{ color: '#155724' }}>
                                        <li>Questions will be updated</li>
                                        <li>Changes will be saved to the database</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowSaveConfirm(false)}>
                                Cancel
                            </button>
                            <button className="btn-success" onClick={confirmSave}>
                                Yes, Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLeaveConfirm && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowLeaveConfirm(false); }}>
                    <div className="modal-content leave-confirm-modal">
                        <div className="modal-header">
                            <h3>
                                <AlertTriangle size={20} style={{ marginRight: '8px' }} />
                                Leave Edit Mode
                            </h3>
                            <button
                                className="close-button"
                                onClick={() => setShowLeaveConfirm(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="leave-confirm-content">
                            <p className="confirm-message">
                                Are you sure you want to leave? Your unsaved changes will be lost.
                            </p>
                            <div className="warning-box">
                                <AlertCircle size={18} />
                                <div className="warning-content">
                                    <p className="warning-title">Warning:</p>
                                    <ul>
                                        <li>All unsaved changes will be discarded</li>
                                        <li>You will need to edit again to save any changes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowLeaveConfirm(false)}>
                                Cancel
                            </button>
                            <button className="btn-danger" onClick={confirmLeave}>
                                Yes, Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditQuiz
