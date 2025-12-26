import React, { useState } from 'react';
import {
  Users, Droplet, Zap, AlertTriangle, CheckCircle, TrendingUp,
  Activity, MapPin, Server, Database, Wifi
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboardEnhanced.css';

const AdminDashboardEnhanced = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Fake KPIs data
  const kpisData = {
    activeUsers: 15,
    totalConsumption: 60, // m³ + kWh
    leaksDetected: 12,
    openClaims: 23,
    systemHealth: 98.5,
    waterConsumption: 1542, // m³
    electricityConsumption: 3040, // kWh
    revenue: 12564 // €
  };

  // Consumption trend data
  const consumptionTrendData = [
    { month: 'Jan', water: 14200, electricity: 28500 },
    { month: 'Fév', water: 13800, electricity: 27800 },
    { month: 'Mar', water: 14500, electricity: 29200 },
    { month: 'Avr', water: 14900, electricity: 29800 },
    { month: 'Mai', water: 15200, electricity: 30100 },
    { month: 'Juin', water: 15420, electricity: 30400 }
  ];

  // Distribution data
  const distributionData = [
    { name: 'Résidentiel', value: 65, color: '#3b82f6' },
    { name: 'Commercial', value: 25, color: '#10b981' },
    { name: 'Industriel', value: 10, color: '#f59e0b' }
  ];

  // Peak hours data
  const peakHoursData = [
    { hour: '00h', consumption: 120 },
    { hour: '04h', consumption: 80 },
    { hour: '08h', consumption: 320 },
    { hour: '12h', consumption: 280 },
    { hour: '16h', consumption: 260 },
    { hour: '20h', consumption: 400 },
    { hour: '23h', consumption: 180 }
  ];

  // Heatmap data (incidents/consumption by zone)
  const heatmapZones = [
    { id: 1, zone: 'Centre-Ville', lat: 35.5889, lng: -5.3626, incidents: 8, consumption: 'high', status: 'warning' },
    { id: 2, zone: 'Quartier Industriel', lat: 35.5756, lng: -5.3542, incidents: 3, consumption: 'very-high', status: 'normal' },
    { id: 3, zone: 'Résidentiel Nord', lat: 35.5945, lng: -5.3689, incidents: 12, consumption: 'medium', status: 'critical' },
    { id: 4, zone: 'Zone Sud', lat: 35.5823, lng: -5.3471, incidents: 5, consumption: 'medium', status: 'normal' },
    { id: 5, zone: 'Médina', lat: 35.5878, lng: -5.3735, incidents: 15, consumption: 'high', status: 'critical' },
    { id: 6, zone: 'Quartier Moderne', lat: 35.5912, lng: -5.3598, incidents: 2, consumption: 'low', status: 'normal' }
  ];

  // Microservices health
  const servicesHealth = [
    { name: 'API Gateway', status: 'online', uptime: 99.8, port: 8080, responseTime: 45 },
    { name: 'Utility Service', status: 'online', uptime: 99.5, port: 8081, responseTime: 120 },
    { name: 'Eureka Server', status: 'online', uptime: 99.9, port: 8761, responseTime: 30 },
    { name: 'Webhook Service', status: 'online', uptime: 98.7, port: 8082, responseTime: 80 },
    { name: 'Kafka Broker', status: 'online', uptime: 99.2, port: 9092, responseTime: 25 },
    { name: 'MySQL Database', status: 'warning', uptime: 97.8, port: 3306, responseTime: 150 }
  ];

  const getConsumptionColor = (level) => {
    const colors = {
      'low': '#10b981',
      'medium': '#3b82f6',
      'high': '#f59e0b',
      'very-high': '#ef4444'
    };
    return colors[level] || '#64748b';
  };

  const getStatusColor = (status) => {
    const colors = {
      'normal': '#10b981',
      'warning': '#f59e0b',
      'critical': '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  const getServiceStatusBadge = (status) => {
    const config = {
      online: { color: '#10b981', label: 'En ligne' },
      warning: { color: '#f59e0b', label: 'Alerte' },
      offline: { color: '#ef4444', label: 'Hors ligne' }
    };
    const { color, label } = config[status];
    return <span className="service-status-badge" style={{ background: color }}>{label}</span>;
  };

  return (
    <div className="admin-dashboard-enhanced">
      <div className="dashboard-header">
        <div>
          <h1><Activity size={32} /> Supervision Globale - Smart City Tetouan</h1>
          <p>Monitoring en temps réel de l'infrastructure et des services</p>
        </div>
        <div className="time-selector">
          <button className={timeRange === 'day' ? 'active' : ''} onClick={() => setTimeRange('day')}>
            Jour
          </button>
          <button className={timeRange === 'week' ? 'active' : ''} onClick={() => setTimeRange('week')}>
            Semaine
          </button>
          <button className={timeRange === 'month' ? 'active' : ''} onClick={() => setTimeRange('month')}>
            Mois
          </button>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="kpis-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon">
            <Users size={32} />
          </div>
          <div className="kpi-content">
            <h3>Utilisateurs Actifs</h3>
            <p className="kpi-value">{kpisData.activeUsers.toLocaleString()}</p>
            <span className="kpi-trend positive">
              <TrendingUp size={16} /> +5.2%
            </span>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-icon">
            <Droplet size={32} />
          </div>
          <div className="kpi-content">
            <h3>Consommation Eau</h3>
            <p className="kpi-value">{kpisData.waterConsumption.toLocaleString()} m³</p>
            <span className="kpi-trend negative">
              <TrendingUp size={16} /> +2.1%
            </span>
          </div>
        </div>

        <div className="kpi-card orange">
          <div className="kpi-icon">
            <Zap size={32} />
          </div>
          <div className="kpi-content">
            <h3>Consommation Électricité</h3>
            <p className="kpi-value">{kpisData.electricityConsumption.toLocaleString()} kWh</p>
            <span className="kpi-trend positive">
              <TrendingUp size={16} /> -1.5%
            </span>
          </div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-icon">
            <AlertTriangle size={32} />
          </div>
          <div className="kpi-content">
            <h3>Fuites Détectées</h3>
            <p className="kpi-value">{kpisData.leaksDetected}</p>
            <span className="kpi-trend warning">
              Nécessite attention
            </span>
          </div>
        </div>

        <div className="kpi-card purple">
          <div className="kpi-icon">
            <CheckCircle size={32} />
          </div>
          <div className="kpi-content">
            <h3>Santé du Système</h3>
            <p className="kpi-value">{kpisData.systemHealth}%</p>
            <span className="kpi-trend positive">
              Excellent
            </span>
          </div>
        </div>

        <div className="kpi-card teal">
          <div className="kpi-icon">
            <Activity size={32} />
          </div>
          <div className="kpi-content">
            <h3>Réclamations Ouvertes</h3>
            <p className="kpi-value">{kpisData.openClaims}</p>
            <span className="kpi-trend neutral">
              En traitement
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card large">
          <h2>Tendance de Consommation Mensuelle</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consumptionTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={3} name="Eau (m³)" />
              <Line type="monotone" dataKey="electricity" stroke="#f59e0b" strokeWidth={3} name="Électricité (kWh)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Distribution par Secteur</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Heures de Pointe</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="consumption" fill="#3b82f6" name="Consommation (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="heatmap-section">
        <h2><MapPin size={24} /> Carte des Incidents et Consommation par Zone</h2>
        <div className="heatmap-container">
          <div className="heatmap-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#10b981' }}></span>
              <span>Normal</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f59e0b' }}></span>
              <span>Attention</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#ef4444' }}></span>
              <span>Critique</span>
            </div>
          </div>

          <div className="zones-grid">
            {heatmapZones.map(zone => (
              <div
                key={zone.id}
                className="zone-card"
                style={{ borderColor: getStatusColor(zone.status) }}
              >
                <div className="zone-header">
                  <MapPin size={20} style={{ color: getStatusColor(zone.status) }} />
                  <h3>{zone.zone}</h3>
                </div>
                <div className="zone-details">
                  <div className="zone-stat">
                    <span className="stat-label">Incidents:</span>
                    <span className="stat-value" style={{ color: getStatusColor(zone.status) }}>
                      {zone.incidents}
                    </span>
                  </div>
                  <div className="zone-stat">
                    <span className="stat-label">Consommation:</span>
                    <span
                      className="consumption-level"
                      style={{ background: getConsumptionColor(zone.consumption) }}
                    >
                      {zone.consumption}
                    </span>
                  </div>
                  <div className="zone-stat">
                    <span className="stat-label">Coordonnées:</span>
                    <span className="coords">{zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</span>
                  </div>
                </div>
                <div className="zone-status" style={{ background: getStatusColor(zone.status) }}>
                  {zone.status === 'critical' ? 'Action Requise' : zone.status === 'warning' ? 'Surveillance' : 'Stable'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Microservices Health */}
      <div className="services-health-section">
        <h2><Server size={24} /> État des Microservices</h2>
        <div className="services-grid">
          {servicesHealth.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-header">
                <div className="service-icon">
                  {service.name.includes('Database') ? <Database size={24} /> :
                   service.name.includes('Kafka') ? <Wifi size={24} /> : <Server size={24} />}
                </div>
                <div>
                  <h3>{service.name}</h3>
                  <p className="service-port">Port: {service.port}</p>
                </div>
                {getServiceStatusBadge(service.status)}
              </div>
              <div className="service-metrics">
                <div className="metric">
                  <span className="metric-label">Uptime</span>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{
                        width: `${service.uptime}%`,
                        background: service.uptime > 98 ? '#10b981' : service.uptime > 95 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <span className="metric-value">{service.uptime}%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Temps de réponse</span>
                  <span className="metric-value">{service.responseTime}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;
