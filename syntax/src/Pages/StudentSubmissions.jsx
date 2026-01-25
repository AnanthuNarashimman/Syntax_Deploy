// /syntax/src/Pages/StudentSubmissions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trophy, Clock, CheckCircle, XCircle, Eye, Calendar, BookOpen, Code, Award, ArrowLeft, X } from 'lucide-react';
import axios from 'axios';
import StudentNavbar from '../Components/StudentNavbar';
import Loader from '../Components/Loader';
import styles from '../Styles/PageStyles/StudentSubmissions.module.css';

const StudentSubmissions = () => {
  const navigate = useNavigate();

  // State for submissions list
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for detailed results modal
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailedResults, setDetailedResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  // Fetch submissions on mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/student/submissions`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSubmissions(response.data.submissions);
      } else {
        setError('Failed to fetch submissions');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err.response?.data?.message || 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedResults = async (eventId) => {
    try {
      setResultsLoading(true);
      setResultsError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/student/submissions/${eventId}/results`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setDetailedResults(response.data.result);
      } else {
        setResultsError(response.data.message || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching detailed results:', err);
      setResultsError(err.response?.data?.message || 'Failed to fetch results');
    } finally {
      setResultsLoading(false);
    }
  };

  const handleViewResults = (submission) => {
    setSelectedSubmission(submission);
    setShowResultsModal(true);
    fetchDetailedResults(submission.eventId);
  };

  const handleCloseModal = () => {
    setShowResultsModal(false);
    setSelectedSubmission(null);
    setDetailedResults(null);
    setResultsError(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';

    // Handle Firestore timestamp
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Handle regular date string
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScorePercentage = (correct, total) => {
    if (!total || total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className={styles.studentSubmissions}>
        <StudentNavbar />
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.studentSubmissions}>
        <StudentNavbar />
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <XCircle size={64} />
          </div>
          <h2 className={styles.errorTitle}>Error Loading Submissions</h2>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn} onClick={fetchSubmissions}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.studentSubmissions}>
      <StudentNavbar />

      <div className={styles.submissionsContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.pageTitle}>My Submissions</h1>
              <p className={styles.pageSubtitle}>
                View your quiz and contest results. Detailed answers are available after the event ends.
              </p>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statItem}>
                <FileText size={24} />
                <div className={styles.statInfo}>
                  <span className={styles.statNumber}>{submissions.length}</span>
                  <span className={styles.statLabel}>Total Submissions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        <div className={styles.submissionsGrid}>
          {submissions.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <FileText size={64} />
              </div>
              <h3 className={styles.emptyStateTitle}>No Submissions Yet</h3>
              <p className={styles.emptyStateText}>
                You haven't submitted any quizzes or contests yet. Start participating to see your results here!
              </p>
              <button className={styles.exploreBtn} onClick={() => navigate('/student-contests')}>
                <Trophy size={16} />
                Explore Contests
              </button>
            </div>
          ) : (
            submissions.map((submission) => {
              const percentage = getScorePercentage(submission.correctAnswerCount, submission.totalQuestions);
              const isEnded = submission.eventStatus === 'ended';

              return (
                <div key={submission.submissionId} className={styles.submissionCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.eventType}>
                      {submission.eventType === 'quiz' ? (
                        <BookOpen size={16} />
                      ) : (
                        <Code size={16} />
                      )}
                      <span>{submission.eventType === 'quiz' ? 'Quiz' : 'Contest'}</span>
                    </div>
                    <div className={`${styles.statusBadge} ${isEnded ? styles.ended : styles.active}`}>
                      <Award size={14} />
                      <span>{isEnded ? 'Results Available' : 'Pending'}</span>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.eventTitle}>{submission.eventTitle}</h3>

                    <div className={styles.scoreSection}>
                      <div
                        className={styles.scoreCircle}
                        style={{ borderColor: getScoreColor(percentage) }}
                      >
                        <span className={styles.scoreValue} style={{ color: getScoreColor(percentage) }}>
                          {percentage}%
                        </span>
                      </div>
                      <div className={styles.scoreDetails}>
                        <div className={styles.scoreItem}>
                          <CheckCircle size={16} className={styles.correctIcon} />
                          <span>{submission.correctAnswerCount} / {submission.totalQuestions} correct</span>
                        </div>
                        <div className={styles.scoreItem}>
                          <Trophy size={16} className={styles.pointsIcon} />
                          <span>{submission.points} points</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.submissionMeta}>
                      <div className={styles.metaItem}>
                        <Calendar size={14} />
                        <span>{formatDate(submission.submittedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      className={`${styles.viewResultsBtn} ${!isEnded ? styles.disabled : ''}`}
                      onClick={() => handleViewResults(submission)}
                      disabled={!isEnded}
                      title={!isEnded ? 'Results will be available after the quiz ends' : 'View detailed results'}
                    >
                      <Eye size={16} />
                      {isEnded ? 'View Results' : 'Awaiting Results'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Results Modal */}
      {showResultsModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {selectedSubmission?.eventTitle || 'Quiz Results'}
              </h2>
              <button className={styles.closeBtn} onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {resultsLoading ? (
                <div className={styles.modalLoader}>
                  <Loader />
                  <p>Loading results...</p>
                </div>
              ) : resultsError ? (
                <div className={styles.modalError}>
                  <XCircle size={48} />
                  <p>{resultsError}</p>
                </div>
              ) : detailedResults ? (
                <>
                  {/* Score Summary */}
                  <div className={styles.resultsSummary}>
                    <div className={styles.summaryScore}>
                      <span className={styles.summaryLabel}>Your Score</span>
                      <span className={styles.summaryValue}>
                        {detailedResults.correctAnswerCount} / {detailedResults.totalQuestions}
                      </span>
                      <span className={styles.summaryPercentage}>
                        ({getScorePercentage(detailedResults.correctAnswerCount, detailedResults.totalQuestions)}%)
                      </span>
                    </div>
                    <div className={styles.summaryPoints}>
                      <Trophy size={20} />
                      <span>{detailedResults.points} points earned</span>
                    </div>
                  </div>

                  {/* Question Details */}
                  <div className={styles.questionsSection}>
                    <h3 className={styles.questionsTitle}>Question-by-Question Breakdown</h3>

                    {detailedResults.questionDetails && detailedResults.questionDetails.length > 0 ? (
                      <div className={styles.questionsList}>
                        {detailedResults.questionDetails.map((q, index) => (
                          <div
                            key={index}
                            className={`${styles.questionItem} ${q.isCorrect ? styles.correct : styles.wrong}`}
                          >
                            <div className={styles.questionHeader}>
                              <span className={styles.questionNumber}>Q{index + 1}</span>
                              <span className={`${styles.questionStatus} ${q.isCorrect ? styles.correctStatus : styles.wrongStatus}`}>
                                {q.isCorrect ? (
                                  <><CheckCircle size={16} /> Correct</>
                                ) : (
                                  <><XCircle size={16} /> Wrong</>
                                )}
                              </span>
                            </div>

                            <p className={styles.questionText}>{q.question}</p>

                            <div className={styles.answerOptions}>
                              {q.options && q.options.map((option, optIndex) => {
                                // Handle type coercion - Firestore may store as strings
                                const selectedIdx = q.selectedAnswer !== null && q.selectedAnswer !== undefined
                                  ? Number(q.selectedAnswer)
                                  : null;
                                const correctIdx = Number(q.correctAnswer);

                                const isSelected = selectedIdx === optIndex;
                                const isCorrectAnswer = correctIdx === optIndex;

                                let optionClass = styles.option;
                                if (isCorrectAnswer) optionClass += ` ${styles.correctOption}`;
                                if (isSelected && !isCorrectAnswer) optionClass += ` ${styles.wrongOption}`;

                                return (
                                  <div key={optIndex} className={optionClass}>
                                    <span className={styles.optionLetter}>
                                      {String.fromCharCode(65 + optIndex)}
                                    </span>
                                    <span className={styles.optionText}>{option}</span>
                                    {isCorrectAnswer && (
                                      <CheckCircle size={16} className={styles.correctMark} />
                                    )}
                                    {isSelected && !isCorrectAnswer && (
                                      <XCircle size={16} className={styles.wrongMark} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {q.selectedAnswer === null && (
                              <p className={styles.notAnswered}>Not answered</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noDetails}>
                        <p>Detailed question breakdown is not available for this submission.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSubmissions;
