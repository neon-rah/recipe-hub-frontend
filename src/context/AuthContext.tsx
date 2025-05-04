"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import api, { setAuthToken, getAuthToken } from "@/config/api";
import { login, logout, register, verifyRefreshToken, refreshToken } from "@/lib/api/authApi";
import { User } from "@/types/user";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userDTO: FormData) => Promise<void>;
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

    const registerHandler = async (userDTO: FormData) => {
        setLoading(true);
        try {
            const { accessToken, user } = await register(userDTO);
            setUser(user);
            setAuthToken(accessToken);
            console.log("AuthProvider - Inscription réussie, user:", user);
        } catch (err) {
            setError("Erreur lors de l'inscription");
            console.error("AuthProvider - Erreur d'inscription:", err);
            throw err;
        } finally {
            setLoading(false);
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
                register: registerHandler,
                logout: logoutHandler,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};