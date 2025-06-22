// import axios from "axios";

// const instance = axios.create({
//     baseURL: '/api',
// })

// instance.interceptors.request.use((config) => {
//     const token = getAuthToken();

//     if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//         config.headers['X-Auth-Token'] = token;
//     }
//     return config;
// })

// export const getAllCats = () => instance.get('/cats');