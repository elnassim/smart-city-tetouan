import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { getDashboardSummaryByClerkId } from '../../services/api';
import MetricCard from '../../components/dashboard/MetricCard';
import ConsumptionChart from '../../components/dashboard/ConsumptionChart';
import AlertCard from '../../components/dashboard/AlertCard';
import QuickActionButton from '../../components/dashboard/QuickActionButton';
import waterMeterImg from '../../assets/images/dashboard/water-meter.jpg.jpeg';
import electricityMeterImg from '../../assets/images/dashboard/electricity-meter.jpg.jpeg';
import smartCityImg from '../../assets/images/dashboard/smart-city.jpg.jpeg';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardSummaryByClerkId(user.id);
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Impossible de charger les données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  const { consumption, billing, weeklyConsumption, alerts } = dashboardData;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Tableau de bord</h1>
          <p className="welcome-text">Bonjour, {user?.firstName || 'Citoyen'}  👋</p>
        </div>
        <div className="user-profile">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="dashboard-main">
        {/* Metrics Row */}
        <section className="metrics-row">
          <MetricCard
            title="Consommation d'eau"
            value={consumption.water.current}
            unit={consumption.water.unit}
            trend={consumption.water.trend}
            icon={consumption.water.icon}
            previous={consumption.water.previous}
            colorStart="#3b82f6"
            colorEnd="#06b6d4"
            backgroundImage={waterMeterImg}
          />

          <MetricCard
            title="Consommation d'électricité"
            value={consumption.electricity.current}
            unit={consumption.electricity.unit}
            trend={consumption.electricity.trend}
            icon={consumption.electricity.icon}
            previous={consumption.electricity.previous}
            colorStart="#fbbf24"
            colorEnd="#f97316"
            backgroundImage={electricityMeterImg}
          />

          <MetricCard
            title="Facture totale"
            value={billing.totalAmount}
            unit="MAD"
            icon={billing.icon}
            colorStart="#10b981"
            colorEnd="#059669"
            backgroundImage={smartCityImg}
          />
        </section>

        {/* Consumption Chart */}
        <ConsumptionChart data={weeklyConsumption} />

        {/* Bottom Grid: Alerts & Actions */}
        <section className="bottom-grid">
          {/* Alerts Panel */}
          <div className="alerts-panel">
            <h3 className="panel-title">🔔 Alertes & Notifications</h3>
            <div className="alerts-list">
              {alerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  icon={alert.icon}
                  title={alert.title}
                  message={alert.message}
                  timestamp={alert.timestamp}
                  color={alert.color}
                  type={alert.type}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="actions-panel">
            <h3 className="panel-title">⚡ Actions rapides</h3>
            <div className="actions-list">
              <QuickActionButton
                label="Voir mes factures"
                icon="💳"
                onClick={() => alert('Paiement des factures - À venir')}
                variant="primary"
              />
              <QuickActionButton
                label="Soumettre une réclamation"
                icon="📝"
                to="/claims"
                variant="secondary"
              />
              <QuickActionButton
                label="Historique de consommation"
                icon="📊"
                to="/consumption"
                variant="secondary"
              />
              <QuickActionButton
                label="Télécharger le rapport"
                icon="📄"
                onClick={() => alert('Téléchargement du rapport - À venir')}
                variant="secondary"
              />
            </div>

            {/* Recommendations */}
            <div className="recommendations">
              <h4 className="recommendations-title">💡 Recommandations</h4>
              <div className="recommendation-card">
                <span className="recommendation-icon">💡</span>
                <div className="recommendation-content">
                  <p className="recommendation-text">
                    Réduisez de 15% votre consommation pour économiser <strong>67 MAD/mois</strong>
                  </p>
                </div>
              </div>
              <div className="recommendation-card success">
                <span className="recommendation-icon">📊</span>
                <div className="recommendation-content">
                  <p className="recommendation-text">
                    Vous consommez <strong>12% moins</strong> que la moyenne du quartier
                  </p>
                  <span className="recommendation-badge">Bon</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
