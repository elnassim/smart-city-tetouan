import { useState } from 'react';
import './ConsumptionChart.css';

export default function ConsumptionChart({ data }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Find max values for scaling
  const maxWater = Math.max(...data.map(d => d.water));
  const maxElectricity = Math.max(...data.map(d => d.electricity));

  return (
    <div className="chart-section">
      <h3 className="chart-title">Consommation de la semaine</h3>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color water"></span>
          <span>Eau (m³)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color electricity"></span>
          <span>Électricité (kWh)</span>
        </div>
      </div>

      <div className="chart-container">
        {data.map((day, index) => {
          const waterHeight = (day.water / maxWater) * 100;
          const electricityHeight = (day.electricity / maxElectricity) * 100;

          return (
            <div
              key={index}
              className="chart-day"
              onMouseEnter={() => setHoveredDay(index)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div className="chart-bars">
                <div
                  className="chart-bar water"
                  style={{ height: `${waterHeight}%` }}
                  data-value={day.water}
                >
                  {hoveredDay === index && (
                    <div className="chart-tooltip">
                      {day.water} m³
                    </div>
                  )}
                </div>
                <div
                  className="chart-bar electricity"
                  style={{ height: `${electricityHeight}%` }}
                  data-value={day.electricity}
                >
                  {hoveredDay === index && (
                    <div className="chart-tooltip">
                      {day.electricity} kWh
                    </div>
                  )}
                </div>
              </div>
              <div className="chart-label">{day.day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
