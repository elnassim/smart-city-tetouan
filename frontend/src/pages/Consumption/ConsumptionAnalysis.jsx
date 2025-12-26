import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Droplet, Zap, Power, Home, AlertCircle } from 'lucide-react';
import './ConsumptionAnalysis.css';

const ConsumptionAnalysis = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [waterValveStatus, setWaterValveStatus] = useState(true);
  const [smartPlugStatus, setSmartPlugStatus] = useState(true);

  // Fake data for daily consumption
  const dailyData = [
    { time: '00:00', water: 2, electricity: 1.2 },
    { time: '04:00', water: 1.5, electricity: 0.8 },
    { time: '08:00', water: 8, electricity: 3.5 },
    { time: '12:00', water: 6, electricity: 4.2 },
    { time: '16:00', water: 4, electricity: 3.8 },
    { time: '20:00', water: 10, electricity: 5.5 },
    { time: '23:59', water: 3, electricity: 2.1 },
  ];

  // Fake data for weekly consumption
  const weeklyData = [
    { day: 'Lun', water: 45, electricity: 28 },
    { day: 'Mar', water: 52, electricity: 32 },
    { day: 'Mer', water: 48, electricity: 30 },
    { day: 'Jeu', water: 55, electricity: 35 },
    { day: 'Ven', water: 50, electricity: 33 },
    { day: 'Sam', water: 65, electricity: 40 },
    { day: 'Dim', water: 60, electricity: 38 },
  ];

  // Fake data for monthly consumption
  const monthlyData = [
    { month: 'Jan', water: 1200, electricity: 850 },
    { month: 'Fév', water: 1150, electricity: 820 },
    { month: 'Mar', water: 1300, electricity: 900 },
    { month: 'Avr', water: 1250, electricity: 880 },
    { month: 'Mai', water: 1400, electricity: 950 },
    { month: 'Juin', water: 1500, electricity: 1000 },
  ];

  // Fake comparison data
  const comparisonData = [
    { category: 'Eau', myHome: 1500, neighborhood: 1300 },
    { category: 'Électricité', myHome: 1000, neighborhood: 950 },
  ];

  const getChartData = () => {
    switch(timeRange) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return weeklyData;
    }
  };

  const toggleWaterValve = () => {
    setWaterValveStatus(!waterValveStatus);
  };

  const toggleSmartPlug = () => {
    setSmartPlugStatus(!smartPlugStatus);
  };

  return (
    <div className="consumption-analysis">
      <div className="page-header">
        <h1><TrendingUp size={32} /> Analyse Détaillée de Consommation</h1>
        <p>Analysez votre comportement de consommation et contrôlez vos équipements</p>
      </div>

      {/* Time Range Selector */}
      <div className="time-range-selector">
        <button
          className={timeRange === 'daily' ? 'active' : ''}
          onClick={() => setTimeRange('daily')}
        >
          Journalier
        </button>
        <button
          className={timeRange === 'weekly' ? 'active' : ''}
          onClick={() => setTimeRange('weekly')}
        >
          Hebdomadaire
        </button>
        <button
          className={timeRange === 'monthly' ? 'active' : ''}
          onClick={() => setTimeRange('monthly')}
        >
          Mensuel
        </button>
      </div>

      {/* Consumption Charts */}
      <div className="charts-section">
        <div className="chart-card">
          <h2>Courbe de Consommation - {timeRange === 'daily' ? 'Aujourd\'hui' : timeRange === 'weekly' ? 'Cette Semaine' : 'Ce Mois'}</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={timeRange === 'daily' ? 'time' : timeRange === 'weekly' ? 'day' : 'month'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} name="Eau (L)" />
              <Line type="monotone" dataKey="electricity" stroke="#f59e0b" strokeWidth={2} name="Électricité (kWh)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart Home Controls */}
      <div className="smart-controls">
        <h2><Home size={24} /> Contrôle Domotique</h2>
        <div className="controls-grid">
          <div className={`control-card ${waterValveStatus ? 'active' : 'inactive'}`}>
            <div className="control-header">
              <Droplet size={32} />
              <h3>Électrovanne Principale</h3>
            </div>
            <div className="control-status">
              <span className="status-label">Statut:</span>
              <span className={`status-badge ${waterValveStatus ? 'on' : 'off'}`}>
                {waterValveStatus ? 'Ouverte' : 'Fermée'}
              </span>
            </div>
            <button
              className={`toggle-btn ${waterValveStatus ? 'on' : 'off'}`}
              onClick={toggleWaterValve}
            >
              <Power size={20} />
              {waterValveStatus ? 'Fermer' : 'Ouvrir'}
            </button>
            {!waterValveStatus && (
              <div className="alert-message">
                <AlertCircle size={16} />
                <span>Alimentation en eau coupée</span>
              </div>
            )}
          </div>

          <div className={`control-card ${smartPlugStatus ? 'active' : 'inactive'}`}>
            <div className="control-header">
              <Zap size={32} />
              <h3>Prise Intelligente Salon</h3>
            </div>
            <div className="control-status">
              <span className="status-label">Statut:</span>
              <span className={`status-badge ${smartPlugStatus ? 'on' : 'off'}`}>
                {smartPlugStatus ? 'Activée' : 'Désactivée'}
              </span>
            </div>
            <button
              className={`toggle-btn ${smartPlugStatus ? 'on' : 'off'}`}
              onClick={toggleSmartPlug}
            >
              <Power size={20} />
              {smartPlugStatus ? 'Éteindre' : 'Allumer'}
            </button>
            <div className="consumption-info">
              Consommation actuelle: {smartPlugStatus ? '45W' : '0W'}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="comparison-section">
        <h2>Comparaison avec la Moyenne du Quartier</h2>
        <div className="chart-card">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="myHome" fill="#3b82f6" name="Mon Foyer (kWh/L)" />
              <Bar dataKey="neighborhood" fill="#10b981" name="Moyenne Quartier" />
            </BarChart>
          </ResponsiveContainer>
          <div className="comparison-insights">
            <div className="insight-card warning">
              <AlertCircle size={20} />
              <div>
                <strong>Eau:</strong> Vous consommez 15% de plus que la moyenne du quartier
              </div>
            </div>
            <div className="insight-card success">
              <AlertCircle size={20} />
              <div>
                <strong>Électricité:</strong> Vous consommez 5% de plus que la moyenne
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consumption Tips */}
      <div className="tips-section">
        <h2>Conseils pour Réduire Votre Consommation</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <Droplet className="tip-icon water" />
            <h3>Économie d'Eau</h3>
            <ul>
              <li>Vérifiez les fuites régulièrement</li>
              <li>Installez des mousseurs sur les robinets</li>
              <li>Réduisez le temps de douche à 5 minutes</li>
            </ul>
          </div>
          <div className="tip-card">
            <Zap className="tip-icon electricity" />
            <h3>Économie d'Électricité</h3>
            <ul>
              <li>Éteignez les appareils en veille</li>
              <li>Utilisez des ampoules LED</li>
              <li>Dégivrez le réfrigérateur régulièrement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionAnalysis;
