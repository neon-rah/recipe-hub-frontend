import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Envoie les cookies (Refresh Token)
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// Fonction pour rafraîchir l'Access Token
export const refreshToken = async (): Promise<string | null> => {
    try {
        const res = await api.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;
        setAuthToken(newAccessToken);
        return newAccessToken;
    } catch (err) {
        console.error("Erreur lors du rafraîchissement du token", err);
        return null;
    }
};

// Intercepteur pour rafraîchir le token automatiquement
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
