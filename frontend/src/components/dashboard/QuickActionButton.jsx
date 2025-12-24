import { Link } from 'react-router-dom';
import './QuickActionButton.css';

export default function QuickActionButton({ label, icon, onClick, to, variant = 'primary' }) {
  const content = (
    <>
      <span className="action-icon">{icon}</span>
      <span className="action-label">{label}</span>
    </>
  );

  const className = `action-button ${variant}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
