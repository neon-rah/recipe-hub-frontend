
import {LoginResponse} from "@/types/user";
import api from "@/config/api";

// Inscription
export const register = async (
    userDTO: FormData
): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/register", userDTO, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
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
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la connexion", err);
        throw new Error("Login failed");
    }
};

// Déconnexion
export const logout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (err) {
        console.error("Erreur lors de la déconnexion", err);
    }
};
