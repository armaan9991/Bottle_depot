import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5158',
});

// This "interceptor" runs before every single API request
API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('jwt_token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;