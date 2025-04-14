import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getPurchaseOrders = async () => {
  const response = await api.get('/purchase-orders');
  return response.data;
};

export const getPurchaseOrderById = async (id) => {
  const response = await api.get(`/purchase-orders/${id}`);
  return response.data;
};

export const createPurchaseOrder = async (purchaseOrderData) => {
  const response = await api.post('/purchase-orders', purchaseOrderData);
  return response.data;
};

export const approvePurchaseOrder = async (id, { status, comment }) => {
  const response = await api.post(`/purchase-orders/${id}/approve`, {
    status,
    comment,
  });
  return response.data;
};

export const getApprovalHistory = async (id) => {
  const response = await api.get(`/purchase-orders/${id}/history`);
  return response.data;
};