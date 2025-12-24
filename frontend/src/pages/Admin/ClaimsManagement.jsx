import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { getAllClaims } from '../../services/api';
import './AdminDashboard.css';
import './ClaimsManagement.css';

export default function ClaimsManagement() {
  const { user } = useUser();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const data = await getAllClaims();
      setClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
      // Mock data
      setClaims([
        {
          id: 1,
          claimNumber: 'CLM-2024-001',
          userId: 1,
          userFullName: 'Ahmed Benali',
          claimType: 'WATER_LEAK',
          title: 'Fuite d\'eau importante',
          description: 'Fuite visible au niveau du compteur principal',
          status: 'in_progress',
          priority: 'high',
          address: 'Avenue Hassan II, Tétouan',
          createdAt: '2024-12-22 10:30:00',
        },
        {
          id: 2,
          claimNumber: 'CLM-2024-002',
          userId: 2,
          userFullName: 'Fatima El Amrani',
          claimType: 'ELECTRICITY_SMART_GRID',
          title: 'Problème de connexion smart grid',
          description: 'Le compteur intelligent ne transmet plus les données',
          status: 'submitted',
          priority: 'medium',
          address: 'Rue Moulay Ismail, Tétouan',
          createdAt: '2024-12-23 14:15:00',
        },
        {
          id: 3,
          claimNumber: 'CLM-2024-003',
          userId: 3,
          userFullName: 'Karim Idrissi',
          claimType: 'WATER_QUALITY',
          title: 'Eau trouble',
          description: 'L\'eau du robinet est de couleur marron depuis ce matin',
          status: 'submitted',
          priority: 'high',
          address: 'Boulevard Mohamed V, Tétouan',
          createdAt: '2024-12-23 16:45:00',
        },
        {
          id: 4,
          claimNumber: 'CLM-2024-004',
          userId: 1,
          userFullName: 'Ahmed Benali',
          claimType: 'ELECTRICITY_BILLING',
          title: 'Facture incorrecte',
          description: 'Le montant de la facture est anormalement élevé',
          status: 'resolved',
          priority: 'low',
          address: 'Avenue Hassan II, Tétouan',
          createdAt: '2024-12-20 09:00:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims.filter(c => {
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || c.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const stats = {
    total: claims.length,
    submitted: claims.filter(c => c.status === 'submitted').length,
    in_progress: claims.filter(c => c.status === 'in_progress').length,
    resolved: claims.filter(c => c.status === 'resolved').length,
    high: claims.filter(c => c.priority === 'high').length,
    medium: claims.filter(c => c.priority === 'medium').length,
    low: claims.filter(c => c.priority === 'low').length,
  };

  const getClaimTypeIcon = (type) => {
    const icons = {
      WATER_LEAK: '💧',
      WATER_QUALITY: '🚰',
      WATER_PRESSURE: '⬇️',
      ELECTRICITY_OUTAGE: '⚡',
      ELECTRICITY_SMART_GRID: '📶',
      ELECTRICITY_BILLING: '💰',
      GENERAL: '📝',
    };
    return icons[type] || '📝';
  };

  const getClaimTypeLabel = (type) => {
    const labels = {
      WATER_LEAK: 'Fuite d\'eau',
      WATER_QUALITY: 'Qualité de l\'eau',
      WATER_PRESSURE: 'Pression d\'eau',
      ELECTRICITY_OUTAGE: 'Panne électrique',
      ELECTRICITY_SMART_GRID: 'Smart Grid',
      ELECTRICITY_BILLING: 'Facturation',
      GENERAL: 'Général',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des réclamations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>Gestion des Réclamations</h1>
          <p className="welcome-text">Gérer toutes les réclamations citoyens</p>
        </div>
        <div className="user-profile">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <nav className="admin-nav">
        <Link to="/admin/dashboard" className="nav-link">
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
        <Link to="/admin/claims" className="nav-link active">
          <span className="nav-icon">📝</span>
          Réclamations
        </Link>
        <Link to="/dashboard" className="nav-link">
          <span className="nav-icon">🏠</span>
          Vue citoyen
        </Link>
      </nav>

      <main className="admin-main">
        {/* Stats */}
        <section className="claims-stats">
          <div className="claim-stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-number">{stats.total}</div>
          </div>
          <div className="claim-stat-card blue">
            <div className="stat-label">📩 Soumises</div>
            <div className="stat-number">{stats.submitted}</div>
          </div>
          <div className="claim-stat-card yellow">
            <div className="stat-label">🔄 En cours</div>
            <div className="stat-number">{stats.in_progress}</div>
          </div>
          <div className="claim-stat-card green">
            <div className="stat-label">✓ Résolues</div>
            <div className="stat-number">{stats.resolved}</div>
          </div>
          <div className="claim-stat-card red">
            <div className="stat-label">🔥 Haute</div>
            <div className="stat-number">{stats.high}</div>
          </div>
          <div className="claim-stat-card orange">
            <div className="stat-label">⚠️ Moyenne</div>
            <div className="stat-number">{stats.medium}</div>
          </div>
        </section>

        {/* Filters */}
        <section className="filters-section">
          <div className="filter-group">
            <label htmlFor="status-filter">Statut:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tous</option>
              <option value="submitted">Soumises</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolues</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="priority-filter">Priorité:</label>
            <select
              id="priority-filter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Toutes</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
        </section>

        {/* Claims Grid */}
        <section className="claims-grid">
          {filteredClaims.map(claim => (
            <div key={claim.id} className="claim-card">
              <div className="claim-card-header">
                <div className="claim-info-row">
                  <span className="claim-icon">{getClaimTypeIcon(claim.claimType)}</span>
                  <div className="claim-details">
                    <span className="claim-id">{claim.claimNumber}</span>
                    <span className="claim-type-label">{getClaimTypeLabel(claim.claimType)}</span>
                  </div>
                </div>
                <div className="claim-badges-row">
                  <span className={`status-badge ${claim.status}`}>
                    {claim.status === 'submitted' ? 'Soumise' :
                     claim.status === 'in_progress' ? 'En cours' : 'Résolue'}
                  </span>
                  <span className={`priority-badge ${claim.priority}`}>
                    {claim.priority === 'high' ? 'Haute' :
                     claim.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                </div>
              </div>

              <div className="claim-card-body">
                <h4>{claim.title}</h4>
                <p className="claim-description">{claim.description}</p>

                <div className="claim-meta">
                  <div className="meta-item">
                    <span className="meta-icon">👤</span>
                    <span>{claim.userFullName}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span>{claim.address}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">🕒</span>
                    <span>{claim.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="claim-card-footer">
                <button className="claim-action-btn primary">
                  Voir détails
                </button>
                <button className="claim-action-btn secondary">
                  Assigner
                </button>
              </div>
            </div>
          ))}
        </section>

        {filteredClaims.length === 0 && (
          <div className="no-results">
            <p>Aucune réclamation trouvée</p>
          </div>
        )}
      </main>
    </div>
  );
}
