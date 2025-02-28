"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { UserDTO } from "../types/user";
import api, { getAuthToken, setAuthToken } from "@/config/api";
import { login, logout, register } from "@/lib/api/authApi";

interface AuthContextType {
    user: UserDTO | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userDTO: FormData) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);  // Ajout de l'état `loading`

    // Vérifier si l'utilisateur est authentifié au chargement
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true); // Début du chargement
            try {
                const token = getAuthToken();  // Récupérer le token en mémoire
                if (token) {
                    setAuthToken(token);
                    const response = await api.get("/user/profile");
                    setUser(response.data);  // Mettre à jour l'état avec les infos de l'utilisateur
                }
            } catch (err) {
                console.error("Erreur lors de la récupération du profil", err);
                setError("Erreur de récupération du profil utilisateur");
                setUser(null);
            } finally {
                setLoading(false); // Fin du chargement
            }
        };

        fetchUserProfile();
    }, []);

    const loginHandler = async (email: string, password: string) => {
        setLoading(true);
        try {
            const data = await login(email, password);
            setUser(data.user);
            setAuthToken(data.accessToken);
        } catch (err) {
            setError("Erreur lors de la connexion");
            console.error("Erreur de connexion", err);
        } finally {
            setLoading(false);
        }
    };

    const registerHandler = async (userDTO: FormData) => {
        setLoading(true);
        try {
            const data = await register(userDTO);
            setUser(data.user);
            setAuthToken(data.accessToken);
        } catch (err) {
            setError("Erreur lors de l'inscription");
            console.error("Erreur d'inscription", err);
        } finally {
            setLoading(false);
        }
    };

    const logoutHandler = () => {
        setUser(null);
        setAuthToken(null);
        logout();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login: loginHandler,
                register: registerHandler,
                logout: logoutHandler,
                loading, // Ajout du `loading` dans le contexte
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
