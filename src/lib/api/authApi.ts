// authApi.ts
import {LoginResponse, ResetResponse, User, UserDTO} from "@/types/user";
import { AxiosError } from "axios";
import api, {setAuthToken} from "@/config/api";



// Inscription
export const initiateRegistration = async (email: string): Promise<void> => {
    try {
        const res = await api.post("/auth/register", { email });
        console.log("Réponse initiateRegistration reçue:", res.data);
    } catch (err) {
        console.error("Erreur lors de l'initiation de l'inscription:", err);
        const axiosError = err as AxiosError<{ message: string, error?: string }>;
        if (axiosError.response) {
            const { message, error } = axiosError.response.data;
            throw new Error(message || error || "Initiation failed");
        }
        throw new Error("Network error during initiation");
    }
};

export const completeRegistration = async (formData: FormData): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/complete-registration", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        const { accessToken, user } = res.data;
        console.log("Réponse completeRegistration reçue:", { accessToken, user });
        return {
            accessToken,
            user: new User(user as UserDTO)
        };
    } catch (err) {
        console.error("Erreur lors de la finalisation de l'inscription:", err);
        const axiosError = err as AxiosError<{ message: string, error?: string }>;
        if (axiosError.response) {
            const { message, error } = axiosError.response.data;
            throw new Error(message || error || "Registration failed");
        }
        throw new Error("Network error during registration");
    }
};

export const resendCode = async (email: string): Promise<void> => {
    try {
        const res = await api.post("/auth/resend-code", { email });
        console.log("Réponse resendCode reçue:", res.data);
    } catch (err) {
        console.error("Erreur lors du renvoi du code:", err);
        const axiosError = err as AxiosError<{ message: string, error?: string }>;
        if (axiosError.response) {
            const { message, error } = axiosError.response.data;
            throw new Error(message || error || "Resend code failed");
        }
        throw new Error("Network error during resend code");
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
        const axiosError = err as AxiosError<{ message: string, error?: string }>;
        if (axiosError.response) {
            const { message, error } = axiosError.response.data;
            throw new Error(message || error || "Login failed");
        }
        throw new Error("Network error during login");
    }
};

// Vérifier la validité du refreshToken
export const verifyRefreshToken = async (refreshToken: string | null): Promise<boolean> => {
    try {
        const res = await api.post("/auth/verify-refresh-token", { refreshToken });
        console.log("Validité refreshToken:", res.data.valid);
        return res.data.valid;
    } catch (err) {
        console.error("Erreur lors de la vérification du refreshToken:", err);
        return false;
    }
};

// Rafraîchir le token
export const refreshToken = async (): Promise<string | null> => {
    try {
        const res = await api.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;
        console.log("Nouveau accessToken reçu:", newAccessToken);
        setAuthToken(newAccessToken);
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

// Réinitialisation du mot de passe
export const initiatePasswordReset = async (email: string): Promise<ResetResponse> => {
    try {
        const res = await api.post("/auth/forgot-password", { email });
        console.log("Réponse initiatePasswordReset reçue:", res.data);
        return res.data as ResetResponse;
    } catch (err) {
        console.error("Erreur lors de l'initiation de la réinitialisation:", err);
        const axiosError = err as AxiosError<{ message: string, error?: string }>;
        if (axiosError.response) {
            const { message, error } = axiosError.response.data;
            throw new Error(message || error || "Password reset initiation failed");
        }
        throw new Error("Network error during password reset initiation");
    }
};

export const resetPassword = async (token: string, newPassword: string): Promise<ResetResponse> => {
    try {
        const res = await api.post("/auth/reset-password", { token, newPassword });
        console.log("Réponse resetPassword reçue:", res.data);
        return res.data as ResetResponse;
    } catch (err) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", err);
        const axiosError = err as AxiosError<{ message: string, error?: string }>;
        if (axiosError.response) {
            const { message, error } = axiosError.response.data;
            throw new Error(message || error || "Password reset failed");
        }
        throw new Error("Network error during password reset");
    }
};