import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Home, AlertCircle } from 'lucide-react';
import StudentNavbar from '../Components/StudentNavbar';
import styles from '../Styles/PageStyles/StudentQuiz.module.css';
import axios from 'axios';
import { useAlert } from '../contexts/AlertContext';
import useProctoring from '../hooks/useProctoring';
import ProctoringWarning from '../Components/ProctoringWarning';
import StartProctoringModal from '../Components/StartProctoringModal';

const StudentQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showError, showSuccess, showInfo } = useAlert();

  // Get quiz data from navigation state OR sessionStorage (for refresh persistence)
  const navigationQuizData = location.state?.quizData;
  const navigationServerTimeData = location.state?.serverTimeData;

  // State management
  const [quizData, setQuizData] = useState(navigationQuizData || null);
  const [serverTimeData, setServerTimeData] = useState(navigationServerTimeData || null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(!navigationQuizData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTimer, setIsLoadingTimer] = useState(true);

  // Auto-submit modal state
  const [showAutoSubmitModal, setShowAutoSubmitModal] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(10);

  // Server time tracking for secure timer (cannot be manipulated by user)
  const serverStartTimeRef = useRef(null);
  const durationMsRef = useRef(null);
  const serverClientOffsetRef = useRef(0); // Offset between server and client time

  // Ref for submit handler to avoid stale closures in timer
  const submitHandlerRef = useRef(null);

  // Guard against duplicate submissions (ref is synchronous, unlike state)
  const isSubmittingRef = useRef(false);

  // Proctoring State
  const [showStartProctoringModal, setShowStartProctoringModal] = useState(false);

  // Proctoring - Only active for strict mode quizzes
  const isStrictMode = quizData?.eventMode === 'strict';

  // Store quiz data in sessionStorage when navigating with state (for refresh persistence)
  useEffect(() => {
    const fetchAndStoreQuizData = async () => {
      if (navigationQuizData) {
        // Check if quiz data has questions - if not, fetch full data from API
        if (!navigationQuizData.questions || navigationQuizData.questions.length === 0) {
          console.log('📋 Quiz data missing questions, fetching from API...');
          
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/student/events/${navigationQuizData.id}`,
              { withCredentials: true }
            );

            if (response.data.event) {
              const fullQuizData = {
                ...navigationQuizData,
                ...response.data.event,
                id: navigationQuizData.id // Preserve the ID
              };
              
              sessionStorage.setItem('currentQuizData', JSON.stringify(fullQuizData));
              setQuizData(fullQuizData);
              console.log('✅ Full quiz data fetched and stored');
            }
          } catch (error) {
            console.error('Error fetching full quiz data:', error);
            showError('Failed to load quiz questions. Please try again.');
            navigate('/student-contests');
            return;
          }
        } else {
          // Quiz data already has questions
          sessionStorage.setItem('currentQuizData', JSON.stringify(navigationQuizData));
          setQuizData(navigationQuizData);
        }
        
        setIsLoadingQuiz(false);
      }
    };

    fetchAndStoreQuizData();
  }, [navigationQuizData, navigate, showError]);

  // Restore quiz data from sessionStorage on page refresh
  useEffect(() => {
    const loadQuizData = async () => {
      // If we already have quiz data from navigation, skip
      if (navigationQuizData) return;

      setIsLoadingQuiz(true);

      // Try to restore from sessionStorage
      const savedQuizData = sessionStorage.getItem('currentQuizData');
      if (savedQuizData) {
        try {
          const parsed = JSON.parse(savedQuizData);
          console.log('📋 Restored quiz data from sessionStorage');
          
          // If questions are missing, fetch full data from API
          if (!parsed.questions || parsed.questions.length === 0) {
            console.log('📋 Questions missing from saved data, fetching from API...');
            
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/student/events/${parsed.id}`,
                { withCredentials: true }
              );

              if (response.data.event) {
                const fullQuizData = {
                  ...parsed,
                  ...response.data.event,
                  id: parsed.id // Preserve the ID
                };
                
                sessionStorage.setItem('currentQuizData', JSON.stringify(fullQuizData));
                setQuizData(fullQuizData);
                console.log('✅ Full quiz data fetched and stored');
              }
            } catch (error) {
              console.error('Error fetching full quiz data:', error);
              showError('Failed to load quiz questions. Please try again.');
              sessionStorage.removeItem('currentQuizData');
              navigate('/student-contests');
              return;
            }
          } else {
            setQuizData(parsed);
          }

          // Fetch fresh server time data
          try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/student/status-with-results`, {
              eventId: parsed.id
            }, { withCredentials: true });

            if (response.data.eventStatus === 'completed') {
              showInfo('This quiz has already been completed.');
              sessionStorage.removeItem('currentQuizData');
              navigate('/student-contests');
              return;
            }

            if (response.data.serverStartTime) {
              setServerTimeData({
                serverStartTime: response.data.serverStartTime,
                serverCurrentTime: response.data.serverCurrentTime,
                durationMinutes: response.data.durationMinutes
              });
            }
          } catch (error) {
            console.error('Error fetching server time on refresh:', error);
          }

          setIsLoadingQuiz(false);
          return;
        } catch (e) {
          console.error('Error parsing saved quiz data:', e);
          sessionStorage.removeItem('currentQuizData');
        }
      }

      // No saved data - redirect to contests
      console.log('❌ No quiz data available, redirecting');
      navigate('/student-contests');
    };

    loadQuizData();
  }, [navigationQuizData, navigate, showInfo]);

  // Auto-submit handler for proctoring violations
  const handleProctoringAutoSubmit = useCallback(async (reason) => {
    showError(`Quiz auto-submitted: ${reason}`);
    console.warn(`⚠️ Auto-submitting quiz: ${reason}`);

    // Submit quiz with current answers (even if incomplete)
    try {
      showInfo('Submitting your quiz due to proctoring violations...');
      
      // Call the existing handleSubmit but mark as disqualified
      await handleSubmitInternal(true, reason);
      
    } catch (error) {
      console.error('Error during proctoring auto-submit:', error);
      showError('Failed to submit quiz. Please contact support.');
    }

    // Clear proctoring data
    if (quizData?.id) {
      localStorage.removeItem(`proctoring_violations_${quizData.id}`);
      localStorage.removeItem(`proctoring_log_${quizData.id}`);
    }

    // Navigate away
    setTimeout(() => {
      navigate('/student-contests');
    }, 2000);
  }, [quizData, navigate, showError, showInfo]);

  // Initialize proctoring hook
  const {
    violations,
    maxViolations,
    showWarning,
    setShowWarning,
    violationType,
    isProctoringActive,
    startProctoring
  } = useProctoring(quizData?.id, isStrictMode, handleProctoringAutoSubmit);

  // Calculate remaining time from server data (secure - cannot be manipulated)
  const calculateRemainingTime = useCallback(() => {
    if (!serverStartTimeRef.current || !durationMsRef.current) return null;

    // Calculate elapsed time accounting for server-client time offset
    const now = Date.now() + serverClientOffsetRef.current;
    const elapsed = now - serverStartTimeRef.current;
    const remaining = Math.max(0, durationMsRef.current - elapsed);

    return Math.floor(remaining / 1000); // Return seconds
  }, []);

  // Initialize timer from server data (secure - persists across reloads)
  useEffect(() => {
    // Wait for quiz data to be loaded
    if (isLoadingQuiz || !quizData) {
      return;
    }

    const initializeTimer = async () => {
      setIsLoadingTimer(true);

      try {
        // First, try to use navigation state data (from fresh start)
        if (serverTimeData?.serverStartTime && serverTimeData?.durationMinutes) {
          console.log('🕐 Using server time from navigation state');
          serverStartTimeRef.current = serverTimeData.serverStartTime;
          durationMsRef.current = serverTimeData.durationMinutes * 60 * 1000;

          // Calculate server-client time offset for accuracy
          if (serverTimeData.serverCurrentTime) {
            serverClientOffsetRef.current = serverTimeData.serverCurrentTime - Date.now();
          }

          const remaining = calculateRemainingTime();
          if (remaining !== null && remaining > 0) {
            setTimeRemaining(remaining);
          } else if (remaining !== null && remaining <= 0) {
            // Time already expired - show auto-submit modal
            setTimeRemaining(0);
            setShowAutoSubmitModal(true);
            setAutoSubmitCountdown(10);
            return;
          }
        } else {
          // Fetch server time data on page reload
          console.log('🕐 Fetching server time from API (page reload)');
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/student/status-with-results`, {
            eventId: quizData.id
          }, { withCredentials: true });

          if (response.data.eventStatus === 'completed') {
            showInfo('This quiz has already been completed.');
            navigate('/student-contests');
            return;
          }

          if (response.data.eventStatus === 'in_progress' && response.data.serverStartTime) {
            serverStartTimeRef.current = response.data.serverStartTime;
            durationMsRef.current = (response.data.durationMinutes || quizData.durationMinutes || 30) * 60 * 1000;

            // Calculate server-client offset
            if (response.data.serverCurrentTime) {
              serverClientOffsetRef.current = response.data.serverCurrentTime - Date.now();
            }

            const remaining = calculateRemainingTime();
            if (remaining !== null && remaining > 0) {
              setTimeRemaining(remaining);
            } else if (remaining !== null && remaining <= 0) {
              // Time expired - show auto-submit modal
              setTimeRemaining(0);
              setShowAutoSubmitModal(true);
              setAutoSubmitCountdown(10);
              return;
            }
          } else if (response.data.eventStatus === 'not_started') {
            // Event not started - this shouldn't happen normally
            // Start the event now
            const startResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/student/start-event`, {
              eventId: quizData.id
            }, { withCredentials: true });

            if (startResponse.data.success) {
              serverStartTimeRef.current = startResponse.data.serverStartTime;
              durationMsRef.current = (startResponse.data.durationMinutes || quizData.durationMinutes || 30) * 60 * 1000;

              if (startResponse.data.serverCurrentTime) {
                serverClientOffsetRef.current = startResponse.data.serverCurrentTime - Date.now();
              }

              const remaining = calculateRemainingTime();
              if (remaining !== null) {
                setTimeRemaining(remaining);
              }
            }
          } else {
            // Fallback - use local duration (less secure but functional)
            console.warn('⚠️ Using fallback local timer');
            const duration = quizData.durationMinutes || quizData.duration || 30;
            serverStartTimeRef.current = Date.now();
            durationMsRef.current = duration * 60 * 1000;
            setTimeRemaining(duration * 60);
          }
        }
      } catch (error) {
        console.error('Error initializing timer:', error);
        // Fallback to local timer on error
        const duration = quizData.durationMinutes || quizData.duration || 30;
        serverStartTimeRef.current = Date.now();
        durationMsRef.current = duration * 60 * 1000;
        setTimeRemaining(duration * 60);
      } finally {
        setIsLoadingTimer(false);
      }
    };

    initializeTimer();

    // Load saved answers from localStorage (answers only, not timer)
    const savedAnswers = localStorage.getItem(`quiz_${quizData.id}_answers`);
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }

    // Load saved current question
    const savedQuestion = localStorage.getItem(`quiz_${quizData.id}_current`);
    if (savedQuestion) {
      setCurrentQuestion(parseInt(savedQuestion));
    }
  }, [quizData, navigate, serverTimeData, calculateRemainingTime, isLoadingQuiz, showInfo, showError]);

  // Show proctoring modal for strict mode quizzes
  useEffect(() => {
    if (quizData && isStrictMode && !isProctoringActive && !showResults) {
      console.log('🔒 Strict mode quiz detected - showing proctoring modal');
      setShowStartProctoringModal(true);
    }
  }, [quizData, isStrictMode, isProctoringActive, showResults]);

  // Handle proctoring start (called when user clicks "Start Exam" button)
  const handleStartProctoring = useCallback(async () => {
    console.log('User clicked Start Proctored Quiz');
    
    // Enter fullscreen IMMEDIATELY with user gesture
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        console.log('✅ Fullscreen activated successfully');
        
        // Close modal and activate proctoring ONLY after successful fullscreen
        setShowStartProctoringModal(false);
        showInfo('Proctoring activated! Stay in fullscreen mode and keep focus on the quiz window.');
        startProctoring();
      } else {
        // Browser doesn't support fullscreen API
        console.error('❌ Fullscreen API not supported');
        showError('Your browser does not support fullscreen mode. Please use Chrome, Firefox, or Edge for this quiz.');
        // Keep modal open - don't start quiz
      }
    } catch (err) {
      // User denied fullscreen permission or other error
      console.error('❌ Failed to enter fullscreen:', err);
      showError('Fullscreen mode is required for this proctored quiz. Please click "Start Quiz" again and allow fullscreen.');
      // Keep modal open - don't start quiz
    }
  }, [startProctoring, showInfo, showError]);

  // Timer countdown - recalculates from server time each tick (secure)
  useEffect(() => {
    if (isLoadingTimer || timeRemaining === null || showResults || showAutoSubmitModal) return;

    const timer = setInterval(() => {
      const remaining = calculateRemainingTime();

      if (remaining !== null) {
        if (remaining <= 0) {
          setTimeRemaining(0);
          clearInterval(timer);
          // Show auto-submit modal instead of immediately submitting
          setShowAutoSubmitModal(true);
          setAutoSubmitCountdown(10);
        } else {
          setTimeRemaining(remaining);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoadingTimer, showResults, showAutoSubmitModal, calculateRemainingTime]);

  // Auto-submit countdown effect
  useEffect(() => {
    if (!showAutoSubmitModal) return;

    if (autoSubmitCountdown <= 0) {
      // Guard against duplicate submissions
      if (isSubmittingRef.current) {
        console.log('⏭️ Submission already in progress, skipping duplicate call');
        setShowAutoSubmitModal(false);
        return;
      }

      // Time's up - submit now
      setShowAutoSubmitModal(false);
      if (submitHandlerRef.current) {
        submitHandlerRef.current();
      }
      return;
    }

    const countdownTimer = setInterval(() => {
      setAutoSubmitCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [showAutoSubmitModal, autoSubmitCountdown]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (quizData && Object.keys(selectedAnswers).length > 0) {
      localStorage.setItem(`quiz_${quizData.id}_answers`, JSON.stringify(selectedAnswers));
      localStorage.setItem(`quiz_${quizData.id}_current`, currentQuestion.toString());
    }
  }, [selectedAnswers, currentQuestion, quizData]);

  // Get questions array from quiz data
  const questions = quizData?.questions || [];

  // Utility functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = {
      ...selectedAnswers,
      [questionIndex]: optionIndex
    };
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionJump = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  // Internal submit handler that can be called by both user and proctoring auto-submit
  const handleSubmitInternal = async (isDisqualified = false, disqualificationReason = null) => {
    // Guard against duplicate submissions using ref (synchronous check)
    if (isSubmittingRef.current) {
      console.log('⏭️ Submission already in progress, skipping duplicate call');
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    // Calculate time taken from server data (secure)
    const totalDurationSeconds = durationMsRef.current ? Math.floor(durationMsRef.current / 1000) : (quizData.durationMinutes || 30) * 60;
    const remainingSeconds = timeRemaining || 0;
    const timeTakenSeconds = totalDurationSeconds - remainingSeconds;

    try {
      // Convert selectedAnswers indices to actual answer values
      const studentAnswerValues = {};
      Object.keys(selectedAnswers).forEach(questionIndex => {
        const answerIndex = selectedAnswers[questionIndex];
        studentAnswerValues[questionIndex] = questions[questionIndex].options[answerIndex];
      });

      // Create studentSubmission data structure
      const studentSubmission = {
        quizId: quizData.id,
        quizTitle: quizData.eventTitle || quizData.title || 'Quiz',
        studentAnswers: studentAnswerValues, // Now contains the actual answer text values
        submittedAt: new Date().toISOString(),
        timeTaken: timeTakenSeconds,
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(selectedAnswers).length,
        disqualified: isDisqualified,
        disqualificationReason: disqualificationReason,
        questionDetails: questions.map((question, index) => ({
          questionIndex: index,
          question: question.question,
          options: question.options,
          selectedAnswer: selectedAnswers[index] !== undefined ? selectedAnswers[index] : null,
          selectedAnswerText: selectedAnswers[index] !== undefined ? question.options[selectedAnswers[index]] : null,
          correctAnswer: question.correctAnswer,
          correctAnswerText: question.options[question.correctAnswer],
          isCorrect: selectedAnswers[index] === question.correctAnswer
        }))
      };

      // Log the studentSubmission data to console
      console.log('Student Submission Data:', studentSubmission);

      // Make API request to validate quiz
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/student/validate-quiz`, studentSubmission, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Quiz Validation Response:', response.data);
      
      // Store the quiz results
      setQuizResults(response.data);

      // Clear localStorage (quiz answers)
      localStorage.removeItem(`quiz_${quizData.id}_answers`);
      localStorage.removeItem(`quiz_${quizData.id}_current`);

      // Clear proctoring data from localStorage
      localStorage.removeItem(`proctoring_violations_${quizData.id}`);
      localStorage.removeItem(`proctoring_log_${quizData.id}`);

      // Clear sessionStorage (quiz data for refresh persistence)
      sessionStorage.removeItem('currentQuizData');

      // Save final answers with timestamp
      const finalAnswers = {
        quizId: quizData.id,
        answers: selectedAnswers,
        submittedAt: new Date().toISOString(),
        timeTaken: timeTakenSeconds,
        validationResults: response.data
      };

      localStorage.setItem(`quiz_${quizData.id}_final`, JSON.stringify(finalAnswers));
      setShowResults(true);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      
      // Fallback to local calculation if API fails
      alert('There was an error submitting your quiz. Showing local results.');

      // Clear localStorage (quiz answers)
      localStorage.removeItem(`quiz_${quizData.id}_answers`);
      localStorage.removeItem(`quiz_${quizData.id}_current`);

      // Clear proctoring data from localStorage
      localStorage.removeItem(`proctoring_violations_${quizData.id}`);
      localStorage.removeItem(`proctoring_log_${quizData.id}`);

      // Clear sessionStorage
      sessionStorage.removeItem('currentQuizData');

      const finalAnswers = {
        quizId: quizData.id,
        answers: selectedAnswers,
        submittedAt: new Date().toISOString(),
        timeTaken: timeTakenSeconds
      };

      localStorage.setItem(`quiz_${quizData.id}_final`, JSON.stringify(finalAnswers));
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
      // Note: Don't reset isSubmittingRef here - we want to prevent any further submissions
      // once the quiz is submitted (even if there's an error, we show results)
    }
  };

  // Public submit handler (called by user clicking submit button)
  const handleSubmit = useCallback(async () => {
    await handleSubmitInternal(false, null);
  }, [quizData, questions, selectedAnswers, timeRemaining]);

  // Keep submitHandlerRef updated with latest handleSubmit (avoids stale closures in timer)
  useEffect(() => {
    submitHandlerRef.current = handleSubmit;
  }, [handleSubmit]);

  const handleRestart = () => {
    // Restart functionality removed
  };

  const handleBackToContests = () => {
    navigate('/student-contests');
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return { text: "Excellent! Outstanding performance!", class: "excellent" };
    if (percentage >= 80) return { text: "Great job! You did very well!", class: "excellent" };
    if (percentage >= 70) return { text: "Good work! Keep it up!", class: "good" };
    if (percentage >= 60) return { text: "Not bad! There's room for improvement.", class: "good" };
    return { text: "Keep practicing! You'll do better next time.", class: "needsImprovement" };
  };

  // Early return if no quiz data
  if (!quizData) {
    return (
      <div className={styles.studentQuiz}>
        <StudentNavbar />
        <div className={styles.resultsContainer}>
          <div className={styles.resultsQuizCard}>
            <h2>No Quiz Data Found</h2>
            <p>Please select a quiz from the contests page.</p>
            <button className={styles.homeButton} onClick={handleBackToContests}>
              Back to Contests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate score for results
  const calculateScore = () => {
    // Use API results if available
    if (quizResults) {
      return {
        correct: quizResults.CorrectAnswerCount,
        total: quizResults.TotalQuestions
      };
    }

    // Fallback to local calculation
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct: correct,
      total: questions.length
    };
  };

  // Results view
  if (showResults) {
    const scoreData = calculateScore();
    const percentage = scoreData.total > 0 ? (scoreData.correct / scoreData.total) * 100 : 0;
    const scoreMessage = getScoreMessage(percentage);
    const scoreColor = getScoreColor(percentage);

    return (
      <div className={styles.studentQuiz}>
        <StudentNavbar />
        <div className={styles.resultsContainer}>
          <div className={styles.resultsQuizCard}>
            <div className={styles.resultsSection}>
              <h1 className={styles.resultsTitle}>Quiz Completed!</h1>

              <div className={styles.scoreDisplay}>
                <div
                  className={styles.scoreCircle}
                  style={{ borderColor: scoreColor }}
                >
                  <div className={styles.scoreText} style={{ color: scoreColor }}>
                    {scoreData.correct}/{scoreData.total}
                  </div>
                </div>
                <div className={styles.scorePercentage}>
                  {percentage.toFixed(1)}%
                </div>
                {quizResults && (
                  <div className={styles.pointsDisplay}>
                    <strong>{quizResults.Points} Points</strong>
                  </div>
                )}
                <div className={`${styles.scoreMessage} ${styles[scoreMessage.class]}`}>
                  {scoreMessage.text}
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button className={styles.homeButton} onClick={handleBackToContests}>
                  <Home size={20} />
                  Back to Contests
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz view
  if (questions.length === 0) {
    return (
      <div className={styles.studentQuiz}>
        <StudentNavbar />
        <div className={styles.resultsContainer}>
          <div className={styles.resultsQuizCard}>
            <h2>No Questions Available</h2>
            <p>This quiz doesn't have any questions yet.</p>
            <button className={styles.homeButton} onClick={handleBackToContests}>
              Back to Contests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={styles.studentQuiz}>
      {/* Hide navbar when proctoring is active */}
      {!isProctoringActive && <StudentNavbar />}

      {/* Start Proctoring Modal - Shows before quiz starts */}
      {isStrictMode && (
        <StartProctoringModal
          show={showStartProctoringModal}
          onStart={handleStartProctoring}
          contestTitle={quizData?.eventTitle || quizData?.title || 'Quiz'}
        />
      )}

      {/* Proctoring Warning Modal - Only shown for strict mode */}
      {isStrictMode && (
        <ProctoringWarning
          show={showWarning}
          violation={violationType}
          count={violations}
          maxViolations={maxViolations}
          onClose={() => setShowWarning(false)}
        />
      )}

      {/* Auto-Submit Modal - Shows when timer expires */}
      {showAutoSubmitModal && (
        <div className={styles.autoSubmitModalOverlay}>
          <div className={styles.autoSubmitModal}>
            <div className={styles.autoSubmitIcon}>
              <Clock size={48} />
            </div>
            <h2 className={styles.autoSubmitTitle}>Time's Up!</h2>
            <p className={styles.autoSubmitMessage}>
              Your quiz time has expired. Your answers will be automatically submitted.
            </p>
            <div className={styles.autoSubmitCountdown}>
              <span className={styles.countdownNumber}>{autoSubmitCountdown}</span>
              <span className={styles.countdownLabel}>seconds</span>
            </div>
            <p className={styles.autoSubmitNote}>
              Auto-submitting your work...
            </p>
          </div>
        </div>
      )}

      <div className={isProctoringActive ? styles.quizContainerFullscreen : styles.quizContainer}>
        {/* Quiz Header */}
        <div className={styles.quizHeader}>
          <button className={styles.backBtn} onClick={handleBackToContests}>
            <ArrowLeft size={20} />
            Back to Contests
          </button>

          <h1 className={styles.quizTitle}>
            {quizData.eventTitle || quizData.title || 'Quiz'}
          </h1>

          <div className={styles.timerContainer}>
            <Clock size={20} />
            <span className={styles.timerText}>
              {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
            </span>
          </div>

          {/* Proctoring Indicator */}
          {isStrictMode && (
            <div className={styles.proctoringBadge} title={`${violations}/${maxViolations} violations`}>
              <AlertCircle size={16} />
              <span>Proctored</span>
              <span className={violations > 0 ? styles.violationCountActive : styles.violationCount}>
                {violations}/{maxViolations}
              </span>
            </div>
          )}
        </div>

        {/* Main Quiz Layout */}
        <div className={styles.quizLayout}>
          {/* Left Panel - Question and Options */}
          <div className={styles.leftPanel}>
            {/* Progress Section */}
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={styles.progressInfo}>
                <span className={styles.questionCounter}>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>

            {/* Quiz Content - No Card Wrapper */}
            <div className={styles.quizCard}>
              <div className={styles.questionSection}>
                <div className={styles.questionNumber}>
                  Q{currentQuestion + 1}
                </div>
                <div className={styles.questionText}>
                  {currentQ.question}
                </div>
              </div>

              <div className={styles.optionsContainer}>
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`${styles.option} ${
                      selectedAnswers[currentQuestion] === index ? styles.selected : ''
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                  >
                    <div className={styles.optionIndicator}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className={styles.optionText}>
                      {option}
                    </div>
                    {selectedAnswers[currentQuestion] === index && (
                      <CheckCircle className={styles.selectedIcon} size={20} />
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className={styles.navigationControls}>
                <button
                  className={`${styles.navButton} ${styles.secondary}`}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>

                <button
                  className={`${styles.navButton} ${styles.primary}`}
                  onClick={handleNext}
                  disabled={currentQuestion === questions.length - 1}
                >
                  Next
                  <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Question Navigation */}
          <div className={styles.rightPanel}>
            <div className={styles.questionNavigationCard}>
              <div className={styles.navigationHeader}>
                <h3 className={styles.navigationTitle}>Questions</h3>
                <div className={styles.navigationLegend}>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.current}`}></div>
                    <span>Current</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.answered}`}></div>
                    <span>Answered</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.unanswered}`}></div>
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.questionsGrid}>
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.questionNumberBtn} ${
                      index === currentQuestion ? styles.currentQuestion :
                      selectedAnswers[index] !== undefined ? styles.answeredQuestion : styles.unansweredQuestion
                    }`}
                    onClick={() => handleQuestionJump(index)}
                    title={`Question ${index + 1} ${
                      index === currentQuestion ? '(Current)' :
                      selectedAnswers[index] !== undefined ? '(Answered)' : '(Unanswered)'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className={styles.navigationSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total Questions:</span>
                  <span className={styles.summaryValue}>{questions.length}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Answered:</span>
                  <span className={styles.summaryValue}>{Object.keys(selectedAnswers).length}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Remaining:</span>
                  <span className={styles.summaryValue}>{questions.length - Object.keys(selectedAnswers).length}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className={styles.rightPanelSubmitButton}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;