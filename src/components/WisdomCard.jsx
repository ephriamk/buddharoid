export default function WisdomCard({ wisdom }) {
  return (
    <div className="tool-card wisdom-card">
      <div className="wisdom-category">{wisdom.category.toUpperCase()}</div>
      <h4 className="wisdom-title">{wisdom.title}</h4>
      <blockquote className="wisdom-text">
        "{wisdom.text}"
      </blockquote>
      <div className="wisdom-source">
        — {wisdom.source} <span className="wisdom-tradition">({wisdom.tradition})</span>
      </div>
      <p className="wisdom-teaching">{wisdom.teaching}</p>
    </div>
  );
}
