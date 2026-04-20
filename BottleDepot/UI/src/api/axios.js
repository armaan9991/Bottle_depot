import axios from 'axios';

const API = axios.create({
    baseURL: 'https://bottle-depot.onrender.com',
});

// This "interceptor" runs before every single API request
API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('jwt_token');
        console.log("TOKEN FROM STORAGE:", token);
           
        if (token && token !== "null") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("HEADERS:", config.headers);

        return config;
    },
    (error) => {
        console.log("rejected here!")
        return Promise.reject(error);
    }
);

// API.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('jwt_token');
//             localStorage.removeItem('user');
//             window.location.href = '/';
//         }
//         return Promise.reject(error);
//     }
// );

export default API;