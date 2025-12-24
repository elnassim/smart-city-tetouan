import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard API
export const getDashboardSummary = async (userId) => {
  const response = await api.get(`/dashboard/summary/${userId}`);
  return response.data;
};

export const getDashboardSummaryByClerkId = async (clerkUserId) => {
  const response = await api.get(`/dashboard/summary/clerk/${clerkUserId}`);
  return response.data;
};

// Consumption API
export const getConsumptionHistory = async (userId, period = 'month') => {
  const response = await api.get(`/consumption/history/${userId}`, {
    params: { period }
  });
  return response.data;
};

export const getConsumptionByMeter = async (meterId, startDate, endDate) => {
  const response = await api.get(`/consumption/meter/${meterId}`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Billing API
export const getUserBills = async (userId) => {
  const response = await api.get(`/billing/user/${userId}`);
  return response.data;
};

export const getBillDetails = async (billId) => {
  const response = await api.get(`/billing/${billId}`);
  return response.data;
};

export const payBill = async (billId, paymentData) => {
  const response = await api.post(`/billing/${billId}/pay`, paymentData);
  return response.data;
};

// Claims API
export const getUserClaims = async (userId) => {
  const response = await api.get(`/claims/user/${userId}`);
  return response.data;
};

export const createClaim = async (claimData) => {
  const response = await api.post('/claims', claimData);
  return response.data;
};

export const getClaimDetails = async (claimId) => {
  const response = await api.get(`/claims/${claimId}`);
  return response.data;
};

export const updateClaimStatus = async (claimId, status) => {
  const response = await api.put(`/claims/${claimId}/status`, { status });
  return response.data;
};

// Admin API - User Management
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Admin API - Meter Management
export const getAllMeters = async () => {
  const response = await api.get('/admin/meters');
  return response.data;
};

export const createMeter = async (meterData) => {
  const response = await api.post('/admin/meters', meterData);
  return response.data;
};

export const updateMeter = async (meterId, meterData) => {
  const response = await api.put(`/admin/meters/${meterId}`, meterData);
  return response.data;
};

export const deleteMeter = async (meterId) => {
  const response = await api.delete(`/admin/meters/${meterId}`);
  return response.data;
};

// Admin API - Claims Management
export const getAllClaims = async () => {
  const response = await api.get('/admin/claims');
  return response.data;
};

export const assignClaim = async (claimId, operatorId) => {
  const response = await api.put(`/admin/claims/${claimId}/assign`, { operatorId });
  return response.data;
};

// Admin API - Analytics
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getConsumptionTrends = async (period = 'month') => {
  const response = await api.get('/admin/analytics/consumption', {
    params: { period }
  });
  return response.data;
};

export const getRevenueTrends = async (period = 'month') => {
  const response = await api.get('/admin/analytics/revenue', {
    params: { period }
  });
  return response.data;
};

export default api;
