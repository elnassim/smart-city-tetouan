import './AlertCard.css';

export default function AlertCard({ icon, title, message, timestamp, color, type }) {
  return (
    <div
      className={`alert-item alert-${type}`}
      style={{ '--alert-color': color }}
    >
      <span className="alert-icon">{icon}</span>
      <div className="alert-content">
        <h4 className="alert-title">{title}</h4>
        <p className="alert-message">{message}</p>
        <span className="alert-timestamp">{timestamp}</span>
      </div>
    </div>
  );
}
