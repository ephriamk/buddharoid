import { useState } from 'react';

export default function AssessmentQuiz({ questions }) {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  const getScore = () => {
    const total = Object.values(answers).reduce((sum, v) => sum + v, 0);
    const max = questions.length * 3;
    return Math.round((total / max) * 100);
  };

  const getLevel = (score) => {
    if (score >= 80) return { label: 'Awakening', desc: 'Your practice shows deep awareness and compassion. Continue nurturing this wisdom.' };
    if (score >= 60) return { label: 'Deepening', desc: 'You are developing strong spiritual foundations. Keep practicing with consistency.' };
    if (score >= 40) return { label: 'Exploring', desc: 'You are on a meaningful path of discovery. Each step matters.' };
    return { label: 'Beginning', desc: 'Every master was once a beginner. Your journey starts with beautiful potential.' };
  };

  if (showResults) {
    const score = getScore();
    const level = getLevel(score);
    return (
      <div className="tool-card assessment-card">
        <div className="tool-header">
          <span className="tool-icon">🔮</span>
          <h4>Your Spiritual Assessment</h4>
        </div>
        <div className="assessment-results">
          <div className="assessment-score">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-label">/ 100</span>
            </div>
          </div>
          <h3 className="assessment-level">{level.label}</h3>
          <p className="assessment-desc">{level.desc}</p>
          <div className="assessment-categories">
            {questions.map((q) => (
              <div key={q.id} className="category-score">
                <span className="category-name">{q.category}</span>
                <div className="category-bar">
                  <div
                    className="category-fill"
                    style={{ width: `${((answers[q.id] || 0) / 3) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-card assessment-card">
      <div className="tool-header">
        <span className="tool-icon">🔮</span>
        <div>
          <h4>Spiritual Self-Assessment</h4>
          <span className="tool-meta">Answer honestly — there are no wrong answers</span>
        </div>
      </div>
      <div className="assessment-questions">
        {questions.map((q) => (
          <div key={q.id} className="assessment-question">
            <p className="question-text">{q.question}</p>
            <div className="question-options">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`option-btn ${answers[q.id] === i ? 'selected' : ''}`}
                  onClick={() => handleAnswer(q.id, i)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className="timer-btn"
        disabled={!allAnswered}
        onClick={() => setShowResults(true)}
      >
        View Results ({Object.keys(answers).length}/{questions.length})
      </button>
    </div>
  );
}
