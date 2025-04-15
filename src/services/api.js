import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add better error handling to the interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // console.log('Making request to:', config.baseURL + config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage');
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw to handle it in the component
  }
};

export const getPurchaseOrders = async () => {
  try {
    // console.log('Before API call - checking if interceptor added token');
    const response = await api.get('/purchase-orders');
    // console.log('API response received:', response.config.headers); // This will show the final headers including the token
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
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