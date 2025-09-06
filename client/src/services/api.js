import axios from 'axios';

// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });


const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// In your api.js file
export const register = async (userData) => {
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Log the error details
      console.error('Registration error:', data);
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
};

export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (name, email, password) => API.post('/auth/register', { name, email, password }),
  googleLogin: (googleData) => API.post('/auth/google', googleData),
  sendOTP: (email) => API.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp) => API.post('/auth/verify-otp', { email, otp }),
  getCurrentUser: () => API.get('/auth/me'),
};

export const chatAPI = {
  getUsers: () => API.get('/chat/users'),
  getMessages: (userId) => API.get(`/chat/messages/${userId}`),
  updateMessageStatus: (messageId, status) => API.put(`/chat/message/${messageId}/status`, { status }),
};


// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default API;



