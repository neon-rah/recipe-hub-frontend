import axios from "axios";

// Créer une instance axios
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Envoie des cookies (refresh token)
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

// Fonction pour récupérer le token en mémoire
export const getAuthToken = () => authToken;

// Rafraîchir le token
export const refreshToken = async (): Promise<string | null> => {
    try {
        const res = await api.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;
        setAuthToken(newAccessToken);
        return newAccessToken;
    } catch (err) {
        console.error("Erreur lors du rafraîchissement du token", err);
        throw new Error("Token refresh failed");
    }
};

// Intercepteur pour gérer les erreurs et le rafraîchissement du token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si une erreur 401 se produit, essayer de rafraîchir le token
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
                // Ici, gérer la déconnexion ou redirection en cas d'échec
            }
        }

        // Retourner l'erreur à l'appelant
        return Promise.reject(error);
    }
);

export default api;
