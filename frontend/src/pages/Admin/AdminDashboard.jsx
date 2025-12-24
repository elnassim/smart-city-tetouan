import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Use mock data for now
        setStats({
          totalUsers: 1245,
          totalMeters: 2490,
          activeClaims: 47,
          totalRevenue: 1245870.50,
          waterConsumption: 52340.8,
          electricityConsumption: 892450,
          pendingBills: 342,
          recentUsers: [
            { id: 1, name: 'Ahmed Benali', email: 'ahmed.benali@example.com', role: 'CITOYEN', createdAt: '2024-12-20' },
            { id: 2, name: 'Fatima El Amrani', email: 'fatima.el-amrani@example.com', role: 'CITOYEN', createdAt: '2024-12-19' },
            { id: 3, name: 'Karim Idrissi', email: 'karim.idrissi@example.com', role: 'CITOYEN', createdAt: '2024-12-18' },
          ],
          recentClaims: [
            { id: 1, claimNumber: 'CLM-2024-001', type: 'WATER_LEAK', status: 'in_progress', priority: 'high' },
            { id: 2, claimNumber: 'CLM-2024-002', type: 'ELECTRICITY_SMART_GRID', status: 'submitted', priority: 'medium' },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>Tableau de bord Admin</h1>
          <p className="welcome-text">Bienvenue, {user?.firstName || 'Admin'}</p>
        </div>
        <div className="user-profile">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <nav className="admin-nav">
        <Link to="/admin/dashboard" className="nav-link active">
          <span className="nav-icon">📊</span>
          Vue d&apos;ensemble
        </Link>
        <Link to="/admin/users" className="nav-link">
          <span className="nav-icon">👥</span>
          Utilisateurs
        </Link>
        <Link to="/admin/meters" className="nav-link">
          <span className="nav-icon">📟</span>
          Compteurs
        </Link>
        <Link to="/admin/claims" className="nav-link">
          <span className="nav-icon">📝</span>
          Réclamations
        </Link>
        <Link to="/dashboard" className="nav-link">
          <span className="nav-icon">🏠</span>
          Vue citoyen
        </Link>
      </nav>

      <main className="admin-main">
        {/* Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Utilisateurs</h3>
              <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">📟</div>
            <div className="stat-content">
              <h3>Total Compteurs</h3>
              <p className="stat-value">{stats.totalMeters.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>Réclamations Actives</h3>
              <p className="stat-value">{stats.activeClaims}</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenu Total</h3>
              <p className="stat-value">{stats.totalRevenue.toLocaleString()} MAD</p>
            </div>
          </div>
        </section>

        {/* Consumption Overview */}
        <section className="consumption-overview">
          <div className="overview-card">
            <h3>💧 Consommation d&apos;eau totale</h3>
            <p className="overview-value">{stats.waterConsumption.toLocaleString()} m³</p>
            <span className="overview-label">Ce mois</span>
          </div>

          <div className="overview-card">
            <h3>⚡ Consommation d&apos;électricité totale</h3>
            <p className="overview-value">{stats.electricityConsumption.toLocaleString()} kWh</p>
            <span className="overview-label">Ce mois</span>
          </div>

          <div className="overview-card">
            <h3>📄 Factures en attente</h3>
            <p className="overview-value">{stats.pendingBills}</p>
            <span className="overview-label">À traiter</span>
          </div>
        </section>

        {/* Bottom Grid */}
        <section className="admin-bottom-grid">
          {/* Recent Users */}
          <div className="admin-panel">
            <div className="panel-header">
              <h3>Utilisateurs Récents</h3>
              <Link to="/admin/users" className="view-all">Voir tous →</Link>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Claims */}
          <div className="admin-panel">
            <div className="panel-header">
              <h3>Réclamations Récentes</h3>
              <Link to="/admin/claims" className="view-all">Voir tous →</Link>
            </div>
            <div className="claims-list">
              {stats.recentClaims.map(claim => (
                <div key={claim.id} className="claim-item">
                  <div className="claim-info">
                    <span className="claim-number">{claim.claimNumber}</span>
                    <span className="claim-type">{claim.type.replace('_', ' ')}</span>
                  </div>
                  <div className="claim-badges">
                    <span className={`badge ${claim.status}`}>{claim.status}</span>
                    <span className={`priority-badge ${claim.priority}`}>{claim.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
