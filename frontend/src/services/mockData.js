// Mock data service for dashboard
export const mockDashboardData = {
  user: {
    accountNumber: "TET-2024-00123",
    address: "Avenue Hassan II, Tétouan"
  },

  consumption: {
    water: {
      current: 12.5,
      previous: 11.8,
      trend: "+5.9",
      unit: "m³",
      color: "blue",
      icon: "💧"
    },
    electricity: {
      current: 285,
      previous: 310,
      trend: "-8.1",
      unit: "kWh",
      color: "orange",
      icon: "⚡"
    }
  },

  billing: {
    totalAmount: 450.75,
    dueDate: "2024-12-31",
    status: "pending",
    breakdown: {
      water: 125.50,
      electricity: 325.25
    },
    icon: "💰"
  },

  weeklyConsumption: [
    { day: "Lun", water: 1.8, electricity: 38 },
    { day: "Mar", water: 1.6, electricity: 42 },
    { day: "Mer", water: 2.1, electricity: 45 },
    { day: "Jeu", water: 1.9, electricity: 40 },
    { day: "Ven", water: 1.7, electricity: 41 },
    { day: "Sam", water: 2.0, electricity: 48 },
    { day: "Dim", water: 1.4, electricity: 31 }
  ],

  alerts: [
    {
      id: 1,
      type: "warning",
      icon: "⚠️",
      title: "Consommation élevée détectée",
      message: "Votre consommation d'eau est 25% plus élevée que d'habitude",
      timestamp: "Il y a 2 heures",
      color: "#fbbf24"
    },
    {
      id: 2,
      type: "info",
      icon: "💧",
      title: "Fuite potentielle",
      message: "Débit constant détecté entre 2h-4h du matin",
      timestamp: "Il y a 5 heures",
      color: "#3b82f6"
    },
    {
      id: 3,
      type: "success",
      icon: "📄",
      title: "Facture disponible",
      message: "Votre facture de décembre est prête",
      timestamp: "Il y a 1 jour",
      color: "#10b981"
    }
  ],

  recommendations: [
    {
      icon: "💡",
      title: "Optimisation suggérée",
      description: "Réduisez de 15% votre consommation pour économiser 67 MAD/mois",
      savings: 67
    },
    {
      icon: "📊",
      title: "Performance",
      description: "Vous consommez 12% moins que la moyenne du quartier",
      badge: "Bon"
    }
  ]
};
