import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update with your backend URL

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default authService;



// // src/services/auth.js
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api'; // Make sure this matches your backend URL

// const authService = {
//   register: async (userData) => {
//     try {
//       const response = await axios.post(`${API_URL}/auth/register`, userData);
//       if (response.data.token) {
//         localStorage.setItem('user', JSON.stringify(response.data));
//       }
//       return response.data;
//     } catch (error) {
//       // Improved error handling
//       const errorMessage = error.response?.data?.message || 'Registration failed';
//       throw new Error(errorMessage);
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await axios.post(`${API_URL}/auth/login`, credentials);
//       if (response.data.token) {
//         localStorage.setItem('user', JSON.stringify(response.data));
//       }
//       return response.data;
//     } catch (error) {
//       // Improved error handling
//       const errorMessage = error.response?.data?.message || 'Login failed';
//       throw new Error(errorMessage);
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('user');
//   },

//   getCurrentUser: () => {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   }
// };

// export default authService;