import MeditationTimer from './MeditationTimer';
import BreathingExercise from './BreathingExercise';
import JournalPrompt from './JournalPrompt';
import WisdomCard from './WisdomCard';
import AssessmentQuiz from './AssessmentQuiz';

export default function ToolResult({ result, onJournalSave }) {
  if (!result || !result.type) return null;

  switch (result.type) {
    case 'meditation':
      return <MeditationTimer meditation={result} />;
    case 'breathing':
      return <BreathingExercise exercise={result} />;
    case 'journal':
      return <JournalPrompt prompt={result} onSave={onJournalSave} />;
    case 'wisdom':
      return (
        <div className="wisdom-results">
          {result.results.map((w, i) => (
            <WisdomCard key={i} wisdom={w} />
          ))}
        </div>
      );
    case 'assessment':
      return <AssessmentQuiz questions={result.questions} />;
    default:
      return null;
  }
}
