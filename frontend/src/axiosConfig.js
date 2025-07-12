import axios from 'axios';
import { getUser } from './utils/auth';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.interceptors.request.use(
    (config) => {
        const userInfo = getUser();
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;