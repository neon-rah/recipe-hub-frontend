import {LoginResponse, User, UserDTO} from "@/types/user";

import { AxiosError } from "axios";
import api from "@/config/api";

// Inscription
export const register = async (formData: FormData): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        const { accessToken, user } = res.data;
        console.log("Réponse register reçue:", { accessToken, user });
        return { 
            accessToken,
            user: new User(user as UserDTO)
        };
    } catch (err) {
        console.error("Erreur lors de l'inscription:", err);
        throw new Error("Registration failed");
    }
};

// Connexion
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/login", { email, password });
        const { accessToken, user } = res.data;
        console.log("Réponse login reçue:", { accessToken, user });
        return {
            accessToken,
            user: new User(user as UserDTO)
        };
    } catch (err) {
        console.error("Erreur lors de la connexion:", err);
        const axiosError = err as AxiosError<{ message: string }>;
        if (axiosError.response) {
            throw new Error(axiosError.response.data.message || "Login failed");
        }
        throw new Error("Network error");
    }
};

// Vérifier la validité du refreshToken (cookie envoyé automatiquement)
export const verifyRefreshToken = async (refreshToken:string|null): Promise<boolean> => {
    try {
        const res = await api.post("/auth/verify-refresh-token", {refreshToken});
        console.log("Validité refreshToken:", res.data.valid);
        return res.data.valid;
    } catch (err) {
        console.error("Erreur lors de la vérification du refreshToken:", err);
        return false;
    }
};

// Rafraîchir le token (cookie envoyé automatiquement)
export const refreshToken = async (): Promise<string | null> => {
    try {
        const res = await api.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;
        console.log("Nouveau accessToken reçu:", newAccessToken);
        return newAccessToken;
    } catch (err) {
        console.error("Erreur lors du rafraîchissement du token:", err);
        throw new Error("Token refresh failed");
    }
};

// Déconnexion
export const logout = async () => {
    try {
        await api.post("/auth/logout");
        console.log("Déconnexion demandée au backend");
    } catch (err) {
        console.error("Erreur lors de la déconnexion:", err);
    }
};

/*// Récupérer un cookie (côté client uniquement)
const getCookie = (name: string): string | undefined => {
    try {
        const value = document.cookie
            .split("; ")
            .find(row => row.startsWith(`${name}=`))
            ?.split("=")[1];
        console.log(`Cookie ${name} récupéré:`, value || "non trouvé");
        return value;
    } catch (err) {
        console.error("Erreur lors de la récupération du cookie:", err);
        return undefined;
    }
};

// Inscription
export const register = async (formData: FormData): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        const { accessToken, user } = res.data;
        console.log("Réponse register reçue:", { accessToken, user });
        return { accessToken, user };
    } catch (err) {
        console.error("Erreur lors de l'inscription:", err);
        throw new Error("Registration failed");
    }
};

// Connexion
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/login", { email, password });
        const { accessToken, user } = res.data;
        console.log("Réponse login reçue:", { accessToken, user });
        return { accessToken, user };
    } catch (err) {
        console.error("Erreur lors de la connexion:", err);
        const axiosError = err as AxiosError<{ message: string }>;
        if (axiosError.response) {
            throw new Error(axiosError.response.data.message || "Login failed");
        }
        throw new Error("Network error");
    }
};

// Vérifier la validité du refreshToken
export const verifyRefreshToken = async (token :string|null = null): Promise<boolean> => {
    try {
        const refreshToken = token ? token : getCookie("refreshToken");
        if (!refreshToken) {
            console.log("Aucun refreshToken trouvé dans les cookies");
            return false;
        }
        const res = await api.post("/auth/verify-refresh-token", { refreshToken });
        console.log("Validité refreshToken:", res.data.valid);
        return res.data.valid;
    } catch (err) {
        console.error("Erreur lors de la vérification du refreshToken:", err);
        return false;
    }
};

// Rafraîchir le token
export const refreshToken = async (token :string |null = null): Promise<string | null> => {
    try {
        const refreshToken = token ? token : getCookie("refreshToken");
        if (!refreshToken) {
            console.log("Aucun refreshToken trouvé pour le rafraîchissement");
            throw new Error("No refresh token available");
        }
        const res = await api.post("/auth/refresh-token", { refreshToken });
        const newAccessToken = res.data.accessToken;
        console.log("Nouveau accessToken reçu:", newAccessToken);
        return newAccessToken;
    } catch (err) {
        console.error("Erreur lors du rafraîchissement du token:", err);
        throw new Error("Token refresh failed");
    }
};

// Déconnexion
export const logout = async () => {
    try {
        await api.post("/auth/logout");
        console.log("Déconnexion demandée au backend");
    } catch (err) {
        console.error("Erreur lors de la déconnexion:", err);
    }
};*/


/*import {LoginResponse} from "@/types/user";
import api from "@/config/api";
import axios, {AxiosError} from "axios";

// Inscription
export const register = async (
    formData: FormData
): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        const { accessToken, refreshToken } = res.data;
        console.log("Réponse login reçue:", { accessToken, refreshToken });

        await storeToken(refreshToken);

        return { accessToken, user: res.data.user };
    } catch (err) {
        console.error("Erreur lors de l'inscription", err);
        throw new Error("Registration failed");
    }
};

// Connexion
export const login = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/login", { email, password });
        const { accessToken, refreshToken } = res.data;
        console.log("Réponse login reçue:", { accessToken, refreshToken });

        await storeToken(refreshToken);

        return { accessToken, user: res.data.user };
    } catch (err) {
        console.error("Erreur lors de la connexion", err);
        const axiosError = err as AxiosError<{ message: string }>;
        if (axiosError.response) {
            throw new Error(axiosError.response.data.message || "Login failed");
        }
        throw new Error("Network error");
    }
};

const storeToken = async (refreshToken:string)=>{
    // Stocker le cookie via l'API interne
    await axios.post("http://localhost:3000/api/set-cookie", { refreshToken }, {
        withCredentials: true,
    });
    console.log("Cookie refreshToken stocké via API interne");
}

// Déconnexion
export const logout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (err) {
        console.error("Erreur lors de la déconnexion", err);
    }
};*/
