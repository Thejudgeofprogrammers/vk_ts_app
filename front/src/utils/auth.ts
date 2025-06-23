const TOKEN_KEY = 'x-auth-token';

export const setAuthToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};