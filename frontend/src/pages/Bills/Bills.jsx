import React, { useState } from 'react';
import { FileText, Download, CreditCard, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import './Bills.css';

const Bills = () => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Fake bills data
  const billsData = [
    {
      id: 'FACT-2024-001',
      period: 'Janvier 2024',
      issueDate: '2024-01-31',
      dueDate: '2024-02-15',
      waterAmount: 145.50,
      electricityAmount: 289.75,
      totalAmount: 435.25,
      status: 'paid',
      paidDate: '2024-02-10',
      waterConsumption: 45,
      electricityConsumption: 320
    },
    {
      id: 'FACT-2024-002',
      period: 'Février 2024',
      issueDate: '2024-02-29',
      dueDate: '2024-03-15',
      waterAmount: 152.30,
      electricityAmount: 305.20,
      totalAmount: 457.50,
      status: 'paid',
      paidDate: '2024-03-08',
      waterConsumption: 48,
      electricityConsumption: 335
    },
    {
      id: 'FACT-2024-003',
      period: 'Mars 2024',
      issueDate: '2024-03-31',
      dueDate: '2024-04-15',
      waterAmount: 138.90,
      electricityAmount: 295.00,
      totalAmount: 433.90,
      status: 'paid',
      paidDate: '2024-04-12',
      waterConsumption: 42,
      electricityConsumption: 310
    },
    {
      id: 'FACT-2024-004',
      period: 'Avril 2024',
      issueDate: '2024-04-30',
      dueDate: '2024-05-15',
      waterAmount: 165.40,
      electricityAmount: 320.50,
      totalAmount: 485.90,
      status: 'pending',
      waterConsumption: 52,
      electricityConsumption: 350
    },
    {
      id: 'FACT-2024-005',
      period: 'Mai 2024',
      issueDate: '2024-05-31',
      dueDate: '2024-06-15',
      waterAmount: 158.20,
      electricityAmount: 312.75,
      totalAmount: 470.95,
      status: 'pending',
      waterConsumption: 50,
      electricityConsumption: 340
    },
    {
      id: 'FACT-2024-006',
      period: 'Juin 2024',
      issueDate: '2024-06-30',
      dueDate: '2024-07-15',
      waterAmount: 172.80,
      electricityAmount: 335.60,
      totalAmount: 508.40,
      status: 'overdue',
      waterConsumption: 55,
      electricityConsumption: 365
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'Payé', color: 'success', icon: CheckCircle },
      pending: { label: 'En attente', color: 'warning', icon: Clock },
      overdue: { label: 'En retard', color: 'danger', icon: AlertCircle }
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

  const filteredBills = billsData.filter(bill => {
    const matchesSearch = bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDownloadPDF = (billId) => {
    alert(`Téléchargement de la facture ${billId} en cours...`);
  };

  const handlePayBill = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    alert(`Paiement de ${selectedBill.totalAmount}€ effectué avec succès!`);
    setShowPaymentModal(false);
    setSelectedBill(null);
  };

  const totalPending = billsData
    .filter(b => b.status === 'pending' || b.status === 'overdue')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="bills-page">
      <div className="page-header">
        <h1><FileText size={32} /> Mes Factures</h1>
        <p>Consultez et gérez vos factures d'eau et d'électricité</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon total">
            <FileText size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Factures</h3>
            <p className="summary-value">{billsData.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon paid">
            <CheckCircle size={24} />
          </div>
          <div className="summary-content">
            <h3>Factures Payées</h3>
            <p className="summary-value">{billsData.filter(b => b.status === 'paid').length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon pending">
            <Clock size={24} />
          </div>
          <div className="summary-content">
            <h3>En Attente</h3>
            <p className="summary-value danger">{totalPending.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher par numéro ou période..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <Filter size={20} />
          <button
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            Toutes
          </button>
          <button
            className={filterStatus === 'paid' ? 'active' : ''}
            onClick={() => setFilterStatus('paid')}
          >
            Payées
          </button>
          <button
            className={filterStatus === 'pending' ? 'active' : ''}
            onClick={() => setFilterStatus('pending')}
          >
            En attente
          </button>
          <button
            className={filterStatus === 'overdue' ? 'active' : ''}
            onClick={() => setFilterStatus('overdue')}
          >
            En retard
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bills-table-container">
        <table className="bills-table">
          <thead>
            <tr>
              <th>N° Facture</th>
              <th>Période</th>
              <th>Date d'émission</th>
              <th>Date limite</th>
              <th>Eau</th>
              <th>Électricité</th>
              <th>Montant Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map(bill => (
              <tr key={bill.id} className={bill.status === 'overdue' ? 'overdue-row' : ''}>
                <td className="bill-id">{bill.id}</td>
                <td>{bill.period}</td>
                <td>{new Date(bill.issueDate).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(bill.dueDate).toLocaleDateString('fr-FR')}</td>
                <td className="amount">{bill.waterAmount.toFixed(2)} €</td>
                <td className="amount">{bill.electricityAmount.toFixed(2)} €</td>
                <td className="total-amount">{bill.totalAmount.toFixed(2)} €</td>
                <td>{getStatusBadge(bill.status)}</td>
                <td className="actions-cell">
                  <button
                    className="action-btn download"
                    onClick={() => handleDownloadPDF(bill.id)}
                    title="Télécharger PDF"
                  >
                    <Download size={18} />
                  </button>
                  {bill.status !== 'paid' && (
                    <button
                      className="action-btn pay"
                      onClick={() => handlePayBill(bill)}
                      title="Payer"
                    >
                      <CreditCard size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Paiement de Facture</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="bill-summary">
                <h3>Détails de la facture</h3>
                <div className="bill-detail-row">
                  <span>Numéro:</span>
                  <strong>{selectedBill.id}</strong>
                </div>
                <div className="bill-detail-row">
                  <span>Période:</span>
                  <strong>{selectedBill.period}</strong>
                </div>
                <div className="bill-detail-row">
                  <span>Eau ({selectedBill.waterConsumption}m³):</span>
                  <strong>{selectedBill.waterAmount.toFixed(2)} €</strong>
                </div>
                <div className="bill-detail-row">
                  <span>Électricité ({selectedBill.electricityConsumption}kWh):</span>
                  <strong>{selectedBill.electricityAmount.toFixed(2)} €</strong>
                </div>
                <div className="bill-detail-row total">
                  <span>Total à payer:</span>
                  <strong>{selectedBill.totalAmount.toFixed(2)} €</strong>
                </div>
              </div>

              <div className="payment-methods">
                <h3>Méthode de paiement</h3>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <CreditCard size={24} />
                    <span>Carte bancaire</span>
                  </label>
                  <label className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-icon">PP</span>
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Numéro de carte</label>
                    <input type="text" placeholder="1234 5678 9012 3456" maxLength="19" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date d'expiration</label>
                      <input type="text" placeholder="MM/AA" maxLength="5" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" placeholder="123" maxLength="3" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nom sur la carte</label>
                    <input type="text" placeholder="JEAN DUPONT" />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowPaymentModal(false)}>
                Annuler
              </button>
              <button className="btn-pay" onClick={processPayment}>
                <CreditCard size={20} />
                Payer {selectedBill.totalAmount.toFixed(2)} €
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
