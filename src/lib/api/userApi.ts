import api from "@/config/api";
import {ErrorResponse, User, UserDTO} from "@/types/user";
import {AxiosError} from "axios";


export const getUserById = async (userId: string): Promise<User> => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
};

// Mise à jour du profil utilisateur
export const updateUserProfile = async (userId: string, formData: FormData): Promise<UserDTO> => {
    try {
        const res = await api.put(`/user/${userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Réponse updateUserProfile reçue:", res.data);
        return res.data as UserDTO;
    } catch (err) {
        console.error("Erreur lors de la mise à jour du profil:", err);
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            const { message } = axiosError.response.data;
            throw new Error(message || "Profile update failed");
        }
        throw new Error("Network error during profile update");
    }
};

// Changement de mot de passe
export const changeUserPassword = async (userId: string, data: { currentPassword: string; newPassword: string }): Promise<void> => {
    try {
        const res = await api.put(`/user/${userId}/change-password`, data);
        console.log("Réponse changeUserPassword reçue:", res.data);
    } catch (err) {
        console.error("Erreur lors du changement de mot de passe:", err);
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            const { message } = axiosError.response.data;
            throw new Error(message || "Password change failed");
        }
        throw new Error("Network error during password change");
    }
};