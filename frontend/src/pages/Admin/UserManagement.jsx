import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { getAllUsers, updateUserRole } from '../../services/api';
import './AdminDashboard.css';
import './UserManagement.css';

export default function UserManagement() {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for demonstration
      setUsers([
        { id: 1, fullName: 'Ahmed Benali', email: 'ahmed.benali@example.com', phone: '+212 6 11 22 33 44', role: 'CITOYEN', createdAt: '2024-12-20' },
        { id: 2, fullName: 'Fatima El Amrani', email: 'fatima.el-amrani@example.com', phone: '+212 6 55 66 77 88', role: 'CITOYEN', createdAt: '2024-12-19' },
        { id: 3, fullName: 'Karim Idrissi', email: 'karim.idrissi@example.com', phone: '+212 6 99 00 11 22', role: 'OPERATOR', createdAt: '2024-12-18' },
        { id: 4, fullName: 'Admin SmartCity', email: 'admin@smartcity-tetouan.ma', phone: '+212 6 12 34 56 78', role: 'ADMIN', createdAt: '2024-12-15' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert('Rôle mis à jour avec succès');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>Gestion des Utilisateurs</h1>
          <p className="welcome-text">Gérer les utilisateurs et leurs rôles</p>
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
        <Link to="/admin/users" className="nav-link active">
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
        {/* Filters */}
        <section className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="role-filter">Filtrer par rôle:</label>
            <select
              id="role-filter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="CITOYEN">Citoyen</option>
              <option value="OPERATOR">Opérateur</option>
            </select>
          </div>
        </section>

        {/* Users Table */}
        <section className="users-table-section">
          <div className="admin-panel">
            <div className="panel-header">
              <h3>
                Liste des utilisateurs
                <span className="count-badge">{filteredUsers.length}</span>
              </h3>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                    <th>Date de création</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td className="user-name">
                        <div className="user-avatar">{u.fullName.charAt(0)}</div>
                        {u.fullName}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`role-select ${u.role.toLowerCase()}`}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="CITOYEN">Citoyen</option>
                          <option value="OPERATOR">Opérateur</option>
                        </select>
                      </td>
                      <td>{u.createdAt}</td>
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

            {filteredUsers.length === 0 && (
              <div className="no-results">
                <p>Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
