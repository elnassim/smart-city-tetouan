import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { getAllMeters } from '../../services/api';
import './AdminDashboard.css';
import './MeterManagement.css';

export default function MeterManagement() {
  const { user } = useUser();
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    try {
      setLoading(true);
      const data = await getAllMeters();
      setMeters(data);
    } catch (error) {
      console.error('Error fetching meters:', error);
      // Mock data
      setMeters([
        { id: 1, meterNumber: 'WAT-TET-001', type: 'WATER', status: 'ACTIVE', userId: 1, userFullName: 'Ahmed Benali', locationAddress: 'Avenue Hassan II, Tétouan', installedAt: '2023-01-15' },
        { id: 2, meterNumber: 'ELEC-TET-001', type: 'ELECTRICITY', status: 'ACTIVE', userId: 1, userFullName: 'Ahmed Benali', locationAddress: 'Avenue Hassan II, Tétouan', installedAt: '2023-01-15' },
        { id: 3, meterNumber: 'WAT-TET-002', type: 'WATER', status: 'ACTIVE', userId: 2, userFullName: 'Fatima El Amrani', locationAddress: 'Rue Moulay Ismail, Tétouan', installedAt: '2023-02-20' },
        { id: 4, meterNumber: 'ELEC-TET-002', type: 'ELECTRICITY', status: 'MAINTENANCE', userId: 2, userFullName: 'Fatima El Amrani', locationAddress: 'Rue Moulay Ismail, Tétouan', installedAt: '2023-02-20' },
        { id: 5, meterNumber: 'WAT-TET-003', type: 'WATER', status: 'ACTIVE', userId: 3, userFullName: 'Karim Idrissi', locationAddress: 'Boulevard Mohamed V, Tétouan', installedAt: '2023-03-10' },
        { id: 6, meterNumber: 'ELEC-TET-003', type: 'ELECTRICITY', status: 'INACTIVE', userId: 3, userFullName: 'Karim Idrissi', locationAddress: 'Boulevard Mohamed V, Tétouan', installedAt: '2023-03-10' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeters = meters.filter(m => {
    const matchesSearch = m.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.locationAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || m.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: meters.length,
    water: meters.filter(m => m.type === 'WATER').length,
    electricity: meters.filter(m => m.type === 'ELECTRICITY').length,
    active: meters.filter(m => m.status === 'ACTIVE').length,
    maintenance: meters.filter(m => m.status === 'MAINTENANCE').length,
    inactive: meters.filter(m => m.status === 'INACTIVE').length,
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des compteurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>Gestion des Compteurs</h1>
          <p className="welcome-text">Gérer tous les compteurs du système</p>
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
        <Link to="/admin/meters" className="nav-link active">
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
        <section className="meter-stats">
          <div className="meter-stat-card">
            <div className="stat-label">Total Compteurs</div>
            <div className="stat-number">{stats.total}</div>
          </div>
          <div className="meter-stat-card blue">
            <div className="stat-label">💧 Eau</div>
            <div className="stat-number">{stats.water}</div>
          </div>
          <div className="meter-stat-card orange">
            <div className="stat-label">⚡ Électricité</div>
            <div className="stat-number">{stats.electricity}</div>
          </div>
          <div className="meter-stat-card green">
            <div className="stat-label">✓ Actifs</div>
            <div className="stat-number">{stats.active}</div>
          </div>
          <div className="meter-stat-card yellow">
            <div className="stat-label">🔧 Maintenance</div>
            <div className="stat-number">{stats.maintenance}</div>
          </div>
          <div className="meter-stat-card red">
            <div className="stat-label">✗ Inactifs</div>
            <div className="stat-number">{stats.inactive}</div>
          </div>
        </section>

        {/* Filters */}
        <section className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par numéro, utilisateur ou adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tous</option>
              <option value="WATER">Eau</option>
              <option value="ELECTRICITY">Électricité</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Statut:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tous</option>
              <option value="ACTIVE">Actif</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactif</option>
            </select>
          </div>
        </section>

        {/* Meters Table */}
        <section className="users-table-section">
          <div className="admin-panel">
            <div className="panel-header">
              <h3>
                Liste des compteurs
                <span className="count-badge">{filteredMeters.length}</span>
              </h3>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Numéro</th>
                    <th>Type</th>
                    <th>Utilisateur</th>
                    <th>Adresse</th>
                    <th>Statut</th>
                    <th>Date d&apos;installation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeters.map(m => (
                    <tr key={m.id}>
                      <td className="meter-number">{m.meterNumber}</td>
                      <td>
                        <span className={`meter-type-badge ${m.type.toLowerCase()}`}>
                          {m.type === 'WATER' ? '💧 Eau' : '⚡ Électricité'}
                        </span>
                      </td>
                      <td>{m.userFullName}</td>
                      <td className="address-cell">{m.locationAddress}</td>
                      <td>
                        <span className={`status-badge ${m.status.toLowerCase()}`}>
                          {m.status === 'ACTIVE' ? 'Actif' : m.status === 'MAINTENANCE' ? 'Maintenance' : 'Inactif'}
                        </span>
                      </td>
                      <td>{m.installedAt}</td>
                      <td>
                        <button className="action-btn view">
                          👁️ Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMeters.length === 0 && (
              <div className="no-results">
                <p>Aucun compteur trouvé</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
