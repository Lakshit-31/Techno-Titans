import axios from 'axios';

const API = axios.create({
  baseURL: 'https://eventhub-backend-eofx.onrender.com/api',
});

// Interceptor to attach token to requests
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('eventhub_user');

    if (user) {
      const parsed = JSON.parse(user);

      if (parsed && parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;