
import {LoginResponse} from "@/types/user";
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
};
