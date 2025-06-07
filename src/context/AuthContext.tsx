"use client";

import React, {createContext, ReactNode, useEffect, useState} from "react";
import api, {getAuthToken, setAuthToken} from "@/config/api";
import {
    completeRegistration,
    initiatePasswordReset,
    initiateRegistration,
    login,
    logout,
    refreshToken,
    resendCode,
    resetPassword,
    verifyRefreshToken,
} from "@/lib/api/authApi";
import {ResetResponse, User, UserDTO} from "@/types/user";
import {changeUserPassword, updateUserProfile} from "@/lib/api/userApi";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    initiateRegistration: (email: string) => Promise<void>;
    completeRegistration: (userDTO: FormData) => Promise<void>;
    resendCode: (email: string) => Promise<void>;
    initiatePasswordReset: (email: string) => Promise<ResetResponse>;
    resetPassword: (token: string, newPassword: string) => Promise<ResetResponse>;
    updateUserProfile: (userId: string, formData: FormData) => Promise<UserDTO>;
    changeUserPassword: (userId: string, data: { currentPassword: string; newPassword: string }) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const restoreAuth = async () => {
            try {
                const currentAccessToken = getAuthToken();
                console.log("restoreAuth - AccessToken initial:", currentAccessToken);
                if (currentAccessToken) {
                    try {
                        const res = await api.get("/user/profile", {
                            headers: {
                                "Authorization": `Bearer ${currentAccessToken}`,
                                "Content-Type": "application/json",
                            },
                        });
                        setUser(new User(res.data));
                        console.log("AuthProvider - État restauré avec accessToken existant, user:", res.data);
                    } catch (err) {
                        console.warn("restoreAuth - AccessToken invalide, tentative de rafraîchissement:", err);
                        const isValid = await verifyRefreshToken(null);
                        console.log("restoreAuth - Token valide:", isValid);
                        if (isValid) {
                            const newAccessToken = await refreshToken();
                            if (newAccessToken) {
                                setAuthToken(newAccessToken);
                                const res = await api.get("/user/profile", {
                                    headers: {
                                        "Authorization": `Bearer ${newAccessToken}`,
                                        "Content-Type": "application/json",
                                    },
                                });
                                setUser(new User(res.data));
                                console.log("AuthProvider - État restauré avec refreshToken, user:", res.data);
                            } else {
                                throw new Error("Failed to refresh access token");
                            }
                        } else {
                            console.log("restoreAuth - Token invalide, déconnexion");
                            logoutHandler();
                        }
                    }
                } else {
                    const isValid = await verifyRefreshToken(null);
                    console.log("restoreAuth - Token valide:", isValid);
                    if (isValid) {
                        const newAccessToken = await refreshToken();
                        if (newAccessToken) {
                            setAuthToken(newAccessToken);
                            const res = await api.get("/user/profile", {
                                headers: {
                                    "Authorization": `Bearer ${newAccessToken}`,
                                    "Content-Type": "application/json",
                                },
                            });
                            setUser(new User(res.data));
                            console.log("AuthProvider - État restauré avec refreshToken, user:", res.data);
                        } else {
                            throw new Error("Failed to refresh access token");
                        }
                    } else {
                        console.log("restoreAuth - Aucun token valide");
                    }
                }
            } catch (err) {
                console.error("restoreAuth - Erreur lors de la restauration:", err);
                setError("Erreur lors de la vérification initiale");
            } finally {
                setLoading(false);
            }
        };

        // Appeler la restauration initiale
        restoreAuth();

        // Rafraîchissement proactif toutes les 14 minutes (840000 ms)
        const refreshInterval = setInterval(async () => {
            const currentToken = getAuthToken();
            if (currentToken && user) { // Vérifier qu'il y a un utilisateur authentifié
                try {
                    console.log("Rafraîchissement proactif - Début");
                    const isValid = await verifyRefreshToken(null);
                    if (isValid) {
                        const newAccessToken = await refreshToken();
                        if (newAccessToken) {
                            setAuthToken(newAccessToken);
                            console.log("Rafraîchissement proactif - Nouveau token:", newAccessToken);
                        } else {
                            throw new Error("Échec du rafraîchissement du token");
                        }
                    } else {
                        console.log("Rafraîchissement proactif - Refresh token invalide, déconnexion");
                        logoutHandler();
                    }
                } catch (err) {
                    console.error("Rafraîchissement proactif - Erreur:", err);
                    logoutHandler();
                }
            }
        }, 14 * 60 * 1000); // 14 minutes

        // Nettoyer l'intervalle lors du démontage
        return () => clearInterval(refreshInterval);
    }, []); // Dépendance vide car c'est une initialisation unique

    const loginHandler = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { accessToken, user } = await login(email, password);
            setUser(user);
            setAuthToken(accessToken);
            console.log("AuthProvider - Connexion réussie, user:", user);
        } catch (err) {
            setError("Erreur lors de la connexion");
            console.error("AuthProvider - Erreur de connexion:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const initiateRegistrationHandler = async (email: string) => {
        setLoading(true);
        try {
            await initiateRegistration(email);
        } catch (err) {
            setError("Erreur lors de l'initiation de l'inscription");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const completeRegistrationHandler = async (userDTO: FormData) => {
        setLoading(true);
        try {
            const { accessToken, user } = await completeRegistration(userDTO);
            setUser(user);
            setAuthToken(accessToken);
        } catch (err) {
            setError("Erreur lors de l'inscription");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resendCodeHandler = async (email: string) => {
        setLoading(true);
        try {
            await resendCode(email);
        } catch (err) {
            setError("Erreur lors du renvoi du code");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const initiatePasswordResetHandler = async (email: string) => {
        setLoading(true);
        try {
            return await initiatePasswordReset(email);
        } catch (err) {
            setError("Erreur lors de l'initiation de la réinitialisation");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPasswordHandler = async (token: string, newPassword: string) => {
        setLoading(true);
        try {
            return await resetPassword(token, newPassword);
        } catch (err) {
            setError("Erreur lors de la réinitialisation du mot de passe");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfileHandler = async (userId: string, formData: FormData) => {
        // setLoading(true);
        try {
            const updatedUser = await updateUserProfile(userId, formData);
            setUser(new User(updatedUser));
            return updatedUser;
        } catch (err) {
            setError("Erreur lors de la mise à jour du profil");
            throw err;
        } finally {
            // setLoading(false);
        }
    };

    const changeUserPasswordHandler = async (userId: string, data: { currentPassword: string; newPassword: string }) => {

        try {
            await changeUserPassword(userId, data);
        } catch (err) {
            setError("Erreur lors du changement de mot de passe");
            throw err;
        }
    };

    const logoutHandler = () => {
        setUser(null);
        setAuthToken(null);
        logout();
        console.log("AuthProvider - Déconnexion effectuée");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login: loginHandler,
                initiateRegistration: initiateRegistrationHandler,
                completeRegistration: completeRegistrationHandler,
                resendCode: resendCodeHandler,
                initiatePasswordReset: initiatePasswordResetHandler,
                resetPassword: resetPasswordHandler,
                updateUserProfile: updateUserProfileHandler,
                changeUserPassword: changeUserPasswordHandler,
                logout: logoutHandler,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};