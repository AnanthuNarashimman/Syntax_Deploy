// /syntax/src/Components/ProblemBankSelector.jsx
import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  X,
  Loader,
  FileText,
  CheckCircle
} from 'lucide-react';
import styles from './ProblemBankSelector.module.css';
import { useAlert } from '../contexts/AlertContext';

function ProblemBankSelector({ onSelect, onClose }) {
  const { showError } = useAlert();
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [viewingProblem, setViewingProblem] = useState(null);

  const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchProblems();
  }, []);

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
        showError('Failed to fetch problems from bank');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      showError('Failed to fetch problems from bank');
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const handleSelect = () => {
    if (selectedProblem) {
      onSelect(selectedProblem);
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Select Problem from Bank</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.filterSection}>
            <Filter size={16} />
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

        <div className={styles.content}>
          {loading ? (
            <div className={styles.emptyState}>
              <Loader size={24} className={styles.spinner} />
              <p>Loading problems...</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={48} className={styles.emptyIcon} />
              <p>{searchQuery || filterDifficulty !== 'all' ? 'No problems match your criteria.' : 'No problems available in the bank.'}</p>
            </div>
          ) : (
            <div className={styles.problemsList}>
              {filteredProblems.map(problem => (
                <div
                  key={problem.id}
                  className={`${styles.problemCard} ${selectedProblem?.id === problem.id ? styles.problemCardSelected : ''}`}
                  onClick={() => setSelectedProblem(problem)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      <h3>{problem.title}</h3>
                      <span className={`${styles.difficultyBadge} ${getDifficultyClass(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    {selectedProblem?.id === problem.id && (
                      <CheckCircle className={styles.checkIcon} size={20} />
                    )}
                  </div>
                  <p className={styles.cardDescription}>
                    {problem.description.substring(0, 120)}...
                  </p>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <Eye size={14} /> {problem.openTestCases?.length || 0} open
                    </span>
                    <span className={styles.metaItem}>
                      <EyeOff size={14} /> {problem.hiddenTestCases?.length || 0} hidden
                    </span>
                    <button
                      className={styles.previewBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingProblem(problem);
                      }}
                    >
                      Preview
                    </button>
                  </div>
                  {problem.topics && problem.topics.length > 0 && (
                    <div className={styles.cardTopics}>
                      {problem.topics.slice(0, 3).map(topic => (
                        <span key={topic} className={styles.topicTag}>{topic}</span>
                      ))}
                      {problem.topics.length > 3 && (
                        <span className={styles.topicTag}>+{problem.topics.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.selectBtn}
            onClick={handleSelect}
            disabled={!selectedProblem}
          >
            Use This Problem
          </button>
        </div>

        {/* Preview Modal */}
        {viewingProblem && (
          <div className={styles.previewOverlay} onClick={() => setViewingProblem(null)}>
            <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.previewHeader}>
                <h3>{viewingProblem.title}</h3>
                <button className={styles.closeBtn} onClick={() => setViewingProblem(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.previewContent}>
                <div className={styles.previewSection}>
                  <h4>Description</h4>
                  <p>{viewingProblem.description}</p>
                </div>
                <div className={styles.previewGrid}>
                  <div className={styles.previewSection}>
                    <h4>Input Format</h4>
                    <p>{viewingProblem.inputFormat}</p>
                  </div>
                  <div className={styles.previewSection}>
                    <h4>Output Format</h4>
                    <p>{viewingProblem.outputFormat}</p>
                  </div>
                </div>
                <div className={styles.previewSection}>
                  <h4>Constraints</h4>
                  <pre>{viewingProblem.constraints}</pre>
                </div>
                <div className={styles.previewSection}>
                  <h4>Examples</h4>
                  {viewingProblem.exampleIO?.map((ex, i) => (
                    <div key={i} className={styles.exampleBlock}>
                      <div className={styles.exampleIO}>
                        <div><strong>Input:</strong><pre>{ex.input}</pre></div>
                        <div><strong>Output:</strong><pre>{ex.output}</pre></div>
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
    </div>
  );
}

export default ProblemBankSelector;
