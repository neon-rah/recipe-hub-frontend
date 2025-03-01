import axios from "axios";

// Créer une instance axios
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    withCredentials: true, // Activer l'envoi des cookies dans les headers
    headers: {
        "Content-Type": "application/json",
    },
});

// Définir un token d'authentification en mémoire
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export const getAuthToken = () => authToken;

export default api;



// authApi.ts
/*
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    withCredentials: true,
});

// Définir un token d'authentification en mémoire
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export const getAuthToken = () => authToken;

// Vérifier la validité du refreshToken
export const verifyRefreshToken = async (refreshToken:string): Promise<boolean> => {
    try {
        const res = await api.post("/auth/verify-refresh-token", {refreshToken});
        return res.data.valid;
    } catch (err) {
        console.error("Erreur lors de la vérification du refreshToken", err);
        return false;
    }
};

// Rafraîchir le token
export const refreshToken = async (): Promise<string | null> => {
    try {
        const res = await api.post("/auth/refresh-token"); // Le refreshToken est envoyé via le cookie
        const newAccessToken = res.data.accessToken;
        setAuthToken(newAccessToken);
        return newAccessToken;
    } catch (err) {
        console.error("Erreur lors du rafraîchissement du token", err);
        throw new Error("Token refresh failed");
    }
};

// Intercepteur
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                console.error("Rafraîchissement du token échoué", err);
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;*/
