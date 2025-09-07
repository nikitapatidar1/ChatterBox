



// // client/src/api.js
// const isIPv4 = (h) => /^\d{1,3}(\.\d{1,3}){3}$/.test(h);

// const pick = (local, ip, prod) => {
//   const host = window.location.hostname;
//   if (host === "localhost" || host === "127.0.0.1") return local;
//   if (isIPv4(host)) return ip;
//   return prod;
// };

// // REST base
// export const API_URL = pick(
//   process.env.REACT_APP_API_URL_LOCAL,
//   process.env.REACT_APP_API_URL_IP,
//   process.env.REACT_APP_API_URL_PROD
// );

// // Socket base
// export const WS_URL = pick(
//   process.env.REACT_APP_WS_URL_LOCAL,
//   process.env.REACT_APP_WS_URL_IP,
//   process.env.REACT_APP_WS_URL_PROD
// );

// console.log("🌐 API_URL =", API_URL);
// console.log("🔌 WS_URL  =", WS_URL);




import axios from 'axios';

// 🔑 Env se URLs nikaal lo
export const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:5000/api';

export const WS_URL = process.env.REACT_APP_WS_URL 
  ? process.env.REACT_APP_WS_URL
  : 'http://localhost:5000';

// Axios instance
const API = axios.create({
  baseURL: API_URL,
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
  (error) => Promise.reject(error)
);

// --- Your APIs ---
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
