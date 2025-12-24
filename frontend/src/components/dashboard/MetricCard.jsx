import './MetricCard.css';

export default function MetricCard({ title, value, unit, trend, icon, colorStart, colorEnd, previous, backgroundImage }) {
  const trendValue = parseFloat(trend);
  const isPositive = trendValue > 0;
  const isNegative = trendValue < 0;

  // For consumption, increase is bad (red), decrease is good (green)
  // For billing, same logic applies
  const trendClass = isPositive ? 'trend-up' : isNegative ? 'trend-down' : 'trend-neutral';
  const trendIcon = isPositive ? '↑' : isNegative ? '↓' : '→';

  return (
    <div
      className="metric-card"
      style={{
        '--card-color-1': colorStart,
        '--card-color-2': colorEnd,
        backgroundImage: backgroundImage ? `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <h3 className="metric-title">{title}</h3>
      </div>

      <div className="metric-body">
        <div className="metric-value">
          {value} <span className="metric-unit">{unit}</span>
        </div>

        {trend && (
          <div className={`metric-trend ${trendClass}`}>
            <span className="trend-icon">{trendIcon}</span>
            <span>{Math.abs(trendValue)}%</span>
          </div>
        )}
      </div>

      {previous && (
        <div className="metric-footer">
          Précédent: {previous} {unit}
        </div>
      )}
    </div>
  );
}
