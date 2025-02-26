import { createContext, useState, useEffect, useContext } from "react";
import api, { setAuthToken, refreshToken } from "@/config/api";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const newToken = await refreshToken();
            if (newToken) {
                setToken(newToken);
                setAuthToken(newToken);
                fetchUser();
            }
        };
        initializeAuth();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get("/user/me");
            setUser(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur", err);
        }
    };

    const login = async (credentials: { email: string; password: string }) => {
        const res = await api.post("/auth/login", credentials);
        setAuthToken(res.data.accessToken);
        setToken(res.data.accessToken);
        setUser(res.data.user);
    };

    const logout = () => {
        setToken(null);
        setAuthToken(null);
        setUser(null);
        api.post("/auth/logout");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
