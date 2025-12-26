import React, { useState } from 'react';
import { MessageSquare, Plus, Upload, Send, CheckCircle, Clock, AlertTriangle, Filter, Search, Image as ImageIcon, X } from 'lucide-react';
import './ClaimsSupport.css';

const ClaimsSupport = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [createStep, setCreateStep] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  // Form data
  const [claimForm, setClaimForm] = useState({
    title: '',
    description: '',
    category: 'water',
    priority: 'normal',
    meterType: 'water',
    meterNumber: '',
    location: '',
    images: []
  });

  // Fake claims data
  const claimsData = [
    {
      id: 'CLM-2024-001',
      title: 'Fuite d\'eau dans le jardin',
      description: 'J\'ai remarqué une fuite importante au niveau du compteur d\'eau dans mon jardin',
      category: 'water',
      status: 'resolved',
      priority: 'high',
      createdDate: '2024-05-15',
      updatedDate: '2024-05-20',
      resolvedDate: '2024-05-20',
      meterNumber: 'WAT-45892',
      assignedTo: 'Tech. Ahmed Bennani',
      messages: [
        { id: 1, sender: 'citizen', content: 'Bonjour, j\'ai une fuite d\'eau importante', timestamp: '2024-05-15 10:30' },
        { id: 2, sender: 'admin', content: 'Nous avons reçu votre demande. Un technicien sera dépêché aujourd\'hui.', timestamp: '2024-05-15 11:00' },
        { id: 3, sender: 'admin', content: 'La fuite a été réparée. Merci de vérifier.', timestamp: '2024-05-20 15:30' },
        { id: 4, sender: 'citizen', content: 'Tout fonctionne parfaitement. Merci!', timestamp: '2024-05-20 16:00' }
      ]
    },
    {
      id: 'CLM-2024-002',
      title: 'Compteur électrique défectueux',
      description: 'Mon compteur électrique affiche des valeurs anormales',
      category: 'electricity',
      status: 'in_progress',
      priority: 'urgent',
      createdDate: '2024-06-01',
      updatedDate: '2024-06-02',
      meterNumber: 'ELEC-78456',
      assignedTo: 'Tech. Sara Alami',
      messages: [
        { id: 1, sender: 'citizen', content: 'Mon compteur indique des valeurs très élevées depuis hier', timestamp: '2024-06-01 09:15' },
        { id: 2, sender: 'admin', content: 'Nous allons vérifier le compteur. Un technicien passera demain matin.', timestamp: '2024-06-01 14:20' },
        { id: 3, sender: 'admin', content: 'Le technicien est en route', timestamp: '2024-06-02 08:00' }
      ]
    },
    {
      id: 'CLM-2024-003',
      title: 'Demande de relevé de compteur',
      description: 'Je souhaite un relevé manuel de mon compteur d\'eau',
      category: 'water',
      status: 'open',
      priority: 'normal',
      createdDate: '2024-06-10',
      updatedDate: '2024-06-10',
      meterNumber: 'WAT-12345',
      assignedTo: null,
      messages: [
        { id: 1, sender: 'citizen', content: 'Bonjour, je voudrais un relevé manuel SVP', timestamp: '2024-06-10 14:00' }
      ]
    },
    {
      id: 'CLM-2024-004',
      title: 'Problème de facturation',
      description: 'Ma dernière facture est anormalement élevée',
      category: 'billing',
      status: 'open',
      priority: 'high',
      createdDate: '2024-06-12',
      updatedDate: '2024-06-12',
      meterNumber: 'ELEC-98765',
      assignedTo: null,
      messages: [
        { id: 1, sender: 'citizen', content: 'Ma facture de mai est le double du mois précédent sans raison apparente', timestamp: '2024-06-12 10:30' }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Ouvert', color: 'info', icon: AlertTriangle },
      in_progress: { label: 'En cours', color: 'warning', icon: Clock },
      resolved: { label: 'Résolu', color: 'success', icon: CheckCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`status-badge ${config.color}`}>
        <Icon size={16} />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      normal: 'priority-normal',
      high: 'priority-high',
      urgent: 'priority-urgent'
    };

    const labels = {
      normal: 'Normal',
      high: 'Haute',
      urgent: 'Urgente'
    };

    return <span className={`priority-badge ${colors[priority]}`}>{labels[priority]}</span>;
  };

  const filteredClaims = claimsData.filter(claim => {
    const matchesSearch = claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || claim.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateClaim = () => {
    setShowCreateModal(true);
    setCreateStep(1);
    setClaimForm({
      title: '',
      description: '',
      category: 'water',
      priority: 'normal',
      meterType: 'water',
      meterNumber: '',
      location: '',
      images: []
    });
  };

  const handleNext = () => {
    setCreateStep(2);
  };

  const handleBack = () => {
    setCreateStep(1);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages([...uploadedImages, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmitClaim = () => {
    alert('Réclamation créée avec succès!');
    setShowCreateModal(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      alert(`Message envoyé: ${newMessage}`);
      setNewMessage('');
    }
  };

  return (
    <div className="claims-support-page">
      <div className="page-header">
        <h1><MessageSquare size={32} /> Mes Réclamations</h1>
        <p>Suivez et créez vos demandes d'assistance</p>
        <button className="btn-create" onClick={handleCreateClaim}>
          <Plus size={20} />
          Nouvelle Réclamation
        </button>
      </div>

      {/* Summary Stats */}
      <div className="claims-stats">
        <div className="stat-card">
          <div className="stat-icon open">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>Ouvertes</h3>
            <p>{claimsData.filter(c => c.status === 'open').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>En cours</h3>
            <p>{claimsData.filter(c => c.status === 'in_progress').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon resolved">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Résolues</h3>
            <p>{claimsData.filter(c => c.status === 'resolved').length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher par titre ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <Filter size={20} />
          <button className={filterStatus === 'all' ? 'active' : ''} onClick={() => setFilterStatus('all')}>
            Toutes
          </button>
          <button className={filterStatus === 'open' ? 'active' : ''} onClick={() => setFilterStatus('open')}>
            Ouvertes
          </button>
          <button className={filterStatus === 'in_progress' ? 'active' : ''} onClick={() => setFilterStatus('in_progress')}>
            En cours
          </button>
          <button className={filterStatus === 'resolved' ? 'active' : ''} onClick={() => setFilterStatus('resolved')}>
            Résolues
          </button>
        </div>
      </div>

      {/* Claims List and Chat */}
      <div className="claims-content">
        <div className="claims-list">
          <h2>Liste des Réclamations</h2>
          {filteredClaims.map(claim => (
            <div
              key={claim.id}
              className={`claim-card ${selectedClaim?.id === claim.id ? 'selected' : ''}`}
              onClick={() => setSelectedClaim(claim)}
            >
              <div className="claim-header">
                <h3>{claim.title}</h3>
                {getStatusBadge(claim.status)}
              </div>
              <p className="claim-id">{claim.id}</p>
              <p className="claim-desc">{claim.description}</p>
              <div className="claim-meta">
                {getPriorityBadge(claim.priority)}
                <span className="claim-date">
                  {new Date(claim.createdDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              {claim.assignedTo && (
                <div className="assigned-to">
                  Assigné à: <strong>{claim.assignedTo}</strong>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedClaim && (
          <div className="chat-panel">
            <div className="chat-header">
              <div>
                <h2>{selectedClaim.title}</h2>
                <p className="chat-subtitle">{selectedClaim.id} - {selectedClaim.meterNumber}</p>
              </div>
              {getStatusBadge(selectedClaim.status)}
            </div>

            <div className="chat-messages">
              {selectedClaim.messages.map(message => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <div className="message-bubble">
                    <p>{message.content}</p>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedClaim.status !== 'resolved' && (
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>
                  <Send size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {!selectedClaim && (
          <div className="no-selection">
            <MessageSquare size={64} />
            <p>Sélectionnez une réclamation pour voir la conversation</p>
          </div>
        )}
      </div>

      {/* Create Claim Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouvelle Réclamation - Étape {createStep}/2</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>

            <div className="modal-body">
              {createStep === 1 && (
                <div className="form-step">
                  <h3>Informations Générales</h3>

                  <div className="form-group">
                    <label>Titre de la réclamation *</label>
                    <input
                      type="text"
                      placeholder="Ex: Fuite d'eau, Compteur défectueux..."
                      value={claimForm.title}
                      onChange={(e) => setClaimForm({...claimForm, title: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Catégorie *</label>
                    <select
                      value={claimForm.category}
                      onChange={(e) => setClaimForm({...claimForm, category: e.target.value})}
                    >
                      <option value="water">Eau</option>
                      <option value="electricity">Électricité</option>
                      <option value="billing">Facturation</option>
                      <option value="meter">Compteur</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priorité *</label>
                    <select
                      value={claimForm.priority}
                      onChange={(e) => setClaimForm({...claimForm, priority: e.target.value})}
                    >
                      <option value="normal">Normale</option>
                      <option value="high">Haute</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description détaillée *</label>
                    <textarea
                      rows="5"
                      placeholder="Décrivez votre problème en détail..."
                      value={claimForm.description}
                      onChange={(e) => setClaimForm({...claimForm, description: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Photos (optionnel)</label>
                    <div className="upload-area">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{display: 'none'}}
                      />
                      <label htmlFor="image-upload" className="upload-label">
                        <Upload size={24} />
                        <span>Cliquez pour ajouter des photos</span>
                      </label>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="uploaded-images">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="image-preview">
                            <img src={img} alt={`Upload ${index + 1}`} />
                            <button className="remove-image" onClick={() => removeImage(index)}>
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {createStep === 2 && (
                <div className="form-step">
                  <h3>Détails Techniques</h3>

                  <div className="form-group">
                    <label>Type de compteur *</label>
                    <select
                      value={claimForm.meterType}
                      onChange={(e) => setClaimForm({...claimForm, meterType: e.target.value})}
                    >
                      <option value="water">Compteur d'eau</option>
                      <option value="electricity">Compteur d'électricité</option>
                      <option value="both">Les deux</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Numéro de série du compteur</label>
                    <input
                      type="text"
                      placeholder="Ex: WAT-12345 ou ELEC-67890"
                      value={claimForm.meterNumber}
                      onChange={(e) => setClaimForm({...claimForm, meterNumber: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Localisation précise</label>
                    <input
                      type="text"
                      placeholder="Ex: Jardin, Garage, Cuisine..."
                      value={claimForm.location}
                      onChange={(e) => setClaimForm({...claimForm, location: e.target.value})}
                    />
                  </div>

                  <div className="form-info">
                    <AlertTriangle size={20} />
                    <div>
                      <strong>Information importante</strong>
                      <p>Un technicien sera assigné à votre réclamation dans les 24-48h. Vous recevrez des notifications par email.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {createStep === 2 && (
                <button className="btn-secondary" onClick={handleBack}>
                  Retour
                </button>
              )}
              <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                Annuler
              </button>
              {createStep === 1 ? (
                <button className="btn-primary" onClick={handleNext}>
                  Suivant
                </button>
              ) : (
                <button className="btn-primary" onClick={handleSubmitClaim}>
                  Créer la Réclamation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsSupport;
