import axios from "axios";
import { getAuthToken, setAuthToken } from "../utils/auth";
import { Cat, CatApiResponse, LikesResponse } from "../types/types";

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

// userModule
export const userRegister = async (login: string, password: string) => {
    const response = await instance.post('/user', { login, password });

    const token = response.headers['x-auth-token'];
    if (token) {
        setAuthToken(token);
    }

    return { token };
}

// catsModule
export const getFavorites = async (): Promise<any> => {
  return await instance.get<LikesResponse>('/likes');
}
export const addFavorite = async (cat_id: string) => await instance.post('/likes', { cat_id });
export const removeFavorite = async (cat_id: string) => await instance.delete(`/likes/${cat_id}`);

export async function fetchCats(page: number, count: number): Promise<Cat[]> {
    const limit = 10;
    const offset = (page - 1) * limit;

    const res = await axios.get<CatApiResponse[]>(
        `https://api.thecatapi.com/v1/images/search?limit=${count}&has_breeds=1&offset=${offset}`,
        {
            headers: {
                'x-api-key': import.meta.env.VITE_CAT_API_KEY,
            }
        }
    );

    return res.data.map((item) => ({
        id: item.id,
        name: item.breeds[0]?.name ?? 'Unknown',
        imageUrl: item.url,
        isFavorite: false,
    }))
}
