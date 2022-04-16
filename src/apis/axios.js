import axios from 'axios';
import { TOKEN_KEY } from '../constant';

const hosts = {
  prod: 'https://api.imi.ai/v2',
  dev: 'https://dev-api.imi.ai/v2',
  local: 'http://localhost:5000/v2',
};

const instance = axios.create({
  baseURL: hosts[process.env.REACT_APP_STAGE],
});

instance.interceptors.request.use(
  (config) => {
    if (!config.isPublic) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    switch (error.response?.status) {
      case 401: {
        localStorage.removeItem(TOKEN_KEY);
        return (window.location.href = '/');
      }
      default:
        return Promise.reject(error.response?.data);
    }
  }
);

export default instance;
