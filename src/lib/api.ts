import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://whatsappapi.qwizfun.com',
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // Replace 'token' with your actual key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);