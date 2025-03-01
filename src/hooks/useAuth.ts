import { useContext, useEffect } from "react";
import {AuthContext} from "@/context/AuthContext";
import api, {setAuthToken} from "@/config/api";
import {refreshToken} from "@/lib/api/authApi";


const useAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { isAuthenticated } = authContext;

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        if (isAuthenticated) {
                            console.log("Interceptor - Tentative de rafraîchissement car déjà authentifié");
                            const newAccessToken = await refreshToken();
                            if (newAccessToken) {
                                setAuthToken(newAccessToken);
                                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                                return api(originalRequest);
                            }
                        }
                    } catch (err) {
                        console.error("Interceptor - Rafraîchissement du token échoué:", err);
                        window.location.href = "/login";
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [isAuthenticated]);

    return authContext;
};

export default useAuth;

/*
import { useContext } from "react";
import {AuthContext} from "@/context/AuthContext";


const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default useAuth;
*/
