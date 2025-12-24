import React, { useEffect, useState } from 'react';
import '../styles/LandingPage.css';

const EnhancedLandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use Clerk hosted authentication - redirects to dashboard after login
  const signInUrl = 'https://cute-sunbird-79.accounts.dev/sign-in?redirect_url=' + encodeURIComponent(window.location.origin + '/dashboard');
  const signUpUrl = 'https://cute-sunbird-79.accounts.dev/sign-up?redirect_url=' + encodeURIComponent(window.location.origin + '/dashboard');

  const features = [
    {
      icon: "📈",
      title: "Suivi en temps réel",
      description: "Visualisez votre consommation d'eau et d'électricité instantanément avec des graphiques détaillés.",
      color: "blue-cyan"
    },
    {
      icon: "🔔",
      title: "Alertes intelligentes",
      description: "Notifications instantanées pour consommation anormale, fuites détectées ou dépassement de seuils.",
      color: "purple-pink"
    },
    {
      icon: "📄",
      title: "Facturation précise",
      description: "Gérez vos factures, consultez l'historique et effectuez des paiements en ligne sécurisés.",
      color: "green-emerald"
    },
    {
      icon: "📱",
      title: "Application mobile",
      description: "Accédez à vos données partout avec notre application mobile intuitive et réactive.",
      color: "orange-red"
    },
    {
      icon: "📊",
      title: "Analyses avancées",
      description: "Analyses détaillées et recommandations personnalisées pour optimiser votre consommation.",
      color: "indigo-blue"
    },
    {
      icon: "🛡️",
      title: "Sécurité renforcée",
      description: "Vos données protégées par des protocoles avancés et un chiffrement de bout en bout.",
      color: "teal-cyan"
    }
  ];

  const stats = [
    { number: "10K+", label: "Utilisateurs actifs" },
    { number: "24/7", label: "Support disponible" },
    { number: "99.9%", label: "Disponibilité" },
    { number: "500+", label: "Alertes traitées/jour" }
  ];

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <span className="icon-water">💧</span>
                <span className="icon-electricity">⚡</span>
              </div>
              <span className="logo-text">
                SmartCity <span className="logo-highlight">Tetouan</span>
              </span>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="auth-buttons desktop-only">
              <a href={signInUrl} className="btn-signin">
                Se connecter
              </a>
              <a href={signUpUrl} className="btn-signup">
                S'inscrire
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <a href={signInUrl} className="mobile-menu-item">
                Se connecter
              </a>
              <a href={signUpUrl} className="mobile-menu-item mobile-menu-signup">
                S'inscrire gratuitement
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <div className="hero-badge">
                <span>✨ Plateforme intelligente de gestion</span>
              </div>
              
              <h1 className="hero-title">
                Gestion <span className="gradient-text">intelligente</span><br />
                de l'eau et de l'électricité
              </h1>
              
              <p className="hero-description">
                Surveillez votre consommation en temps réel, détectez les anomalies et optimisez 
                votre utilisation des ressources avec notre plateforme nouvelle génération.
              </p>

              <div className="hero-cta">
                <a href={signUpUrl} className="btn-primary">
                  <span>Commencer maintenant</span>
                  <span className="arrow">→</span>
                </a>
                <a href="#features" className="btn-outline">
                  En savoir plus
                </a>
              </div>

              {/* Stats */}
              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="dashboard-preview">
              <div className="dashboard-card">
                {/* Dashboard Header */}
                <div className="dashboard-header">
                  <h3>Tableau de bord</h3>
                  <div className="window-controls">
                    <span className="control red"></span>
                    <span className="control yellow"></span>
                    <span className="control green"></span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="metrics-grid">
                  <div className="metric-card water">
                    <span className="metric-icon">💧</span>
                    <div className="metric-value">120 L</div>
                    <div className="metric-label">Consommation eau</div>
                  </div>
                  <div className="metric-card electricity">
                    <span className="metric-icon">⚡</span>
                    <div className="metric-value">15 kWh</div>
                    <div className="metric-label">Consommation électricité</div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="chart-container">
                  {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
                    <div key={i} className="chart-bar" style={{ height: `${height}%` }}></div>
                  ))}
                </div>

                {/* Floating Elements */}
                <div className="floating-element purple"></div>
                <div className="floating-element blue"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Fonctionnalités <span className="gradient-text">principales</span>
            </h2>
            <p className="section-subtitle">
              Découvrez comment nous révolutionnons la gestion des ressources avec une technologie de pointe
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card ${feature.color}`}>
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <a href="#" className="feature-link">
                  En savoir plus →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-circle cta-circle-1"></div>
          <div className="cta-circle cta-circle-2"></div>
        </div>
        
        <div className="container cta-container">
          <h2 className="cta-title">
            Prêt à optimiser votre consommation ?
          </h2>
          <p className="cta-description">
            Rejoignez des milliers d'utilisateurs qui gèrent déjà leurs ressources de manière intelligente et économique
          </p>
          
          <div className="cta-buttons">
            <a href={signUpUrl} className="btn-cta-primary">
              Créer un compte gratuitement
            </a>
            <a href="#contact" className="btn-cta-outline">
              Nous contacter
            </a>
          </div>

          <div className="cta-features">
            <div className="cta-feature-item">
              <span>✓</span>
              <span>Sans carte bancaire</span>
            </div>
            <div className="cta-feature-item">
              <span>✓</span>
              <span>Support 24/7</span>
            </div>
            <div className="cta-feature-item">
              <span>✓</span>
              <span>Données sécurisées</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <div className="footer-logo">
                <div className="footer-logo-icon">💧</div>
                <span className="footer-logo-text">SmartCity Tetouan</span>
              </div>
              <p className="footer-description">
                Révolutionnons ensemble la gestion des ressources pour une ville plus intelligente et durable.
              </p>
            </div>
            
            <div className="footer-links">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#">Fonctionnalités</a></li>
                <li><a href="#">Tarifs</a></li>
                <li><a href="#">À propos</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Ressources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Centre d'aide</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Contact</h4>
              <ul className="footer-contact">
                <li>📍 Tetouan, Maroc</li>
                <li>📞 +212 6 12 34 56 78</li>
                <li>✉️ contact@smartcity-tetouan.ma</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 SmartCity Tetouan. Tous droits réservés.</p>
            <div className="footer-legal">
              <a href="#">Confidentialité</a>
              <span>•</span>
              <a href="#">Conditions</a>
              <span>•</span>
              <a href="#">Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedLandingPage;