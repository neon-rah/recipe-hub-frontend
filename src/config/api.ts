import axios from "axios";
import { refreshToken } from "@/lib/api/authApi";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    withCredentials: true,
});

let authToken: string | null = null;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export const getAuthToken = () => authToken;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Gérer les codes 401 (Unauthorized) et 403 (Forbidden)
        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                    setAuthToken(newAccessToken);
                    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);

                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                processQueue(err, null);
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;



// import axios from "axios";
// import {refreshToken} from "@/lib/api/authApi";
//
// // Créer une instance axios
// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
//     withCredentials: true, // Activer l'envoi des cookies dans les headers
//   
// });
//
// // Définir un token d'authentification en mémoire
// let authToken: string | null = null;
//
// export const setAuthToken = (token: string | null) => {
//     authToken = token;
//     if (token) {
//         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//         delete api.defaults.headers.common["Authorization"];
//     }
// };
//
// export const getAuthToken = () => authToken;
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const newAccessToken = await refreshToken();
//                 originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//                 return api(originalRequest);
//             } catch (err) {
//                 if (typeof window !== "undefined") {
//                     window.location.href = "/login";
//                 }
//                 return Promise.reject(err);
//             }
//         }
//         return Promise.reject(error);
//     }
// );
//
// export default api;
//
//
//
// // authApi.ts
// /*
// import axios from "axios";
//
// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
//     withCredentials: true,
// });
//
// // Définir un token d'authentification en mémoire
// let authToken: string | null = null;
//
// export const setAuthToken = (token: string | null) => {
//     authToken = token;
//     if (token) {
//         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//         delete api.defaults.headers.common["Authorization"];
//     }
// };
//
// export const getAuthToken = () => authToken;
//
// // Vérifier la validité du refreshToken
// export const verifyRefreshToken = async (refreshToken:string): Promise<boolean> => {
//     try {
//         const res = await api.post("/auth/verify-refresh-token", {refreshToken});
//         return res.data.valid;
//     } catch (err) {
//         console.error("Erreur lors de la vérification du refreshToken", err);
//         return false;
//     }
// };
//
// // Rafraîchir le token
// export const refreshToken = async (): Promise<string | null> => {
//     try {
//         const res = await api.post("/auth/refresh-token"); // Le refreshToken est envoyé via le cookie
//         const newAccessToken = res.data.accessToken;
//         setAuthToken(newAccessToken);
//         return newAccessToken;
//     } catch (err) {
//         console.error("Erreur lors du rafraîchissement du token", err);
//         throw new Error("Token refresh failed");
//     }
// };
//
// // Intercepteur
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const newAccessToken = await refreshToken();
//                 if (newAccessToken) {
//                     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//                     return api(originalRequest);
//                 }
//             } catch (err) {
//                 console.error("Rafraîchissement du token échoué", err);
//                 if (typeof window !== "undefined") {
//                     window.location.href = "/login";
//                 }
//             }
//         }
//         return Promise.reject(error);
//     }
// );
//
// export default api;*/
