import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:5000/api', // Backend URL
  baseURL: 'https://ams-backend-0y7i.onrender.com/api',
});

// Request interceptor to add token
api.interceptors.request.use(
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

export default api;
