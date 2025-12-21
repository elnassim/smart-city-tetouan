import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Tableau de bord</h2>
      <div className="dashboard-cards">
        <Link to="/claims" className="dashboard-card">
          <h3>Réclamations</h3>
          <p>Gérez vos réclamations d'eau et d'électricité</p>
        </Link>
        <Link to="/consumption" className="dashboard-card">
          <h3>Consommation</h3>
          <p>Consultez votre consommation d'énergie</p>
        </Link>
      </div>
    </div>
  )
}
