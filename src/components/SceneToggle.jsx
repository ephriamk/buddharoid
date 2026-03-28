export default function SceneToggle({ expanded, onToggle }) {
  return (
    <button className="scene-toggle-btn" onClick={onToggle}>
      <span className={`scene-toggle-chevron ${expanded ? 'up' : 'down'}`}>&#x25B2;</span>
      <span>{expanded ? 'Hide Temple' : 'Show Temple'}</span>
    </button>
  );
}
