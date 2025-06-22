import axios from "axios";
import { getAuthToken } from "../utils/auth";

const instance = axios.create({
    baseURL: '/api',
})

instance.interceptors.request.use((config: any) => {
    const token = getAuthToken();

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['X-Auth-Token'] = token;
    }
    return config;
})

const externalCatAPI = axios.create({
    baseURL: "https://api.thecatapi.com/v1",
    headers: {
        "x-api-key": import.meta.env.VITE_CAT_API_KEY,
    },
});

// userModule
export const userRegister = (login: string, password: string) => instance.post('/user', { login, password })

// catsModule
export const getFavorites = () => instance.get('/likes');
export const addFavorite = (cat_id: string) => instance.post('/likes', { cat_id });
export const removeFavorite = (cat_id: string) => instance.delete(`/likes/${cat_id}`);

// Внешнее API котов
export const fetchCats = () => externalCatAPI.get('/image/search?limit=10')
