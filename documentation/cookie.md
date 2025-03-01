Si `document.cookie` ne retourne pas le cookie `refreshToken` stocké dans le navigateur dans votre application Next.js, même si vous pouvez le voir dans "Application" > "Cookies" dans les outils de développement, cela peut être dû à plusieurs raisons spécifiques au fonctionnement des cookies et à la configuration de Next.js. Analysons pourquoi cela se produit et comment récupérer correctement un cookie dans Next.js, en particulier dans votre cas où le backend le stocke via `Set-Cookie`.

---

### Pourquoi `document.cookie` ne retourne pas le cookie ?
1. **Cookie `HttpOnly`** :
    - Si le backend définit le cookie `refreshToken` avec l’attribut `HttpOnly` (comme dans `refreshTokenCookie.setHttpOnly(true)`), ce cookie est inaccessible via `document.cookie` côté client. L’attribut `HttpOnly` empêche JavaScript d’y accéder pour des raisons de sécurité (protection contre XSS).

2. **Domaine ou chemin incorrect** :
    - Si le cookie est défini avec un `Path` ou un `Domain` qui ne correspond pas à la page actuelle, `document.cookie` ne le verra pas. Par exemple, si `Path=/api` et que vous êtes sur `/home`, il ne sera pas visible.

3. **Contexte d’exécution** :
    - Si vous appelez `document.cookie` dans un contexte côté serveur (par exemple, dans une API Route ou une fonction exécutée avant le rendu client), `document` n’est pas défini, et vous ne verrez rien.

4. **Synchronisation client/serveur** :
    - Dans Next.js, le rendu initial peut être côté serveur (SSR), et `document.cookie` ne reflète les cookies qu’après le montage côté client. Si vous essayez de l’appeler trop tôt, il peut être vide.

---

### Vos logs confirment le problème
Dans vos logs précédents :
- `"Middleware - refreshToken dans cookies: eyJhbGciOiJIUzI1NiJ9..."` : Le middleware (côté serveur) voit le cookie dans `req.cookies`, car il est envoyé dans les headers HTTP par le navigateur.
- `"Cookie refreshToken récupéré: non trouvé"` : `getCookie` côté client ne le trouve pas, ce qui suggère que `document.cookie` ne reflète pas le cookie, probablement à cause de `HttpOnly`.

---

### Solution : Récupérer le cookie dans Next.js
Puisque le cookie `refreshToken` est défini par le backend avec `HttpOnly`, vous ne pouvez pas le récupérer directement avec `document.cookie`. Voici comment ajuster votre approche pour récupérer et utiliser le cookie correctement dans Next.js :

#### Option 1 : Supprimer `HttpOnly` (si acceptable)
Si vous acceptez que le cookie soit accessible côté client (moins sécurisé mais plus simple) :
1. **Backend - Supprimer `HttpOnly`** :
   ```java
   Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
   // refreshTokenCookie.setHttpOnly(true); // Commenté pour rendre accessible à document.cookie
   refreshTokenCookie.setPath("/");
   refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
   refreshTokenCookie.setSecure(false); // False en local, true en prod avec HTTPS
   response.addCookie(refreshTokenCookie);
   ```

2. **Frontend - Utiliser `document.cookie`** :
   ```tsx
   const getCookie = (name: string): string | undefined => {
       const value = document.cookie
           .split("; ")
           .find(row => row.startsWith(`${name}=`))
           ?.split("=")[1];
       console.log(`Cookie ${name} récupéré:`, value || "non trouvé");
       return value;
   };
   ```

    - Cela fonctionnera si `HttpOnly` est désactivé, et vous pourrez voir le cookie dans `document.cookie`.

   **Inconvénient** : Moins sécurisé, car le cookie devient vulnérable aux attaques XSS.

#### Option 2 : Garder `HttpOnly` et passer par une API interne (recommandé)
Pour garder `HttpOnly` (sécurisé) et récupérer le cookie côté client :
1. **Créer une API interne dans Next.js** :
   Créez une route API qui lit le cookie depuis les headers de la requête (`req.cookies`) et le renvoie au client.

   ```tsx
   // pages/api/get-refresh-token.ts
   import { NextApiRequest, NextApiResponse } from "next";

   export default function handler(req: NextApiRequest, res: NextApiResponse) {
       const refreshToken = req.cookies.refreshToken;
       if (!refreshToken) {
           return res.status(400).json({ error: "No refresh token found" });
       }
       res.status(200).json({ refreshToken });
   }
   ```

2. **Frontend - Appeler l’API interne** :
   Ajoutez une fonction dans `authApi.ts` pour récupérer le cookie via cette API.

   ```tsx
   // authApi.ts
   import { LoginResponse } from "@/types/user";
   import api from "./api";
   import { AxiosError } from "axios";

   // Récupérer le refreshToken via une API interne
   export const getRefreshToken = async (): Promise<string | null> => {
       try {
           const res = await api.get("/api/get-refresh-token");
           const { refreshToken } = res.data;
           console.log("refreshToken récupéré via API interne:", refreshToken);
           return refreshToken;
       } catch (err) {
           console.error("Erreur lors de la récupération du refreshToken:", err);
           return null;
       }
   };

   // Inscription
   export const register = async (formData: FormData): Promise<LoginResponse> => {
       try {
           const res = await api.post("/auth/register", formData, {
               headers: { "Content-Type": "multipart/form-data" },
           });
           const { accessToken, user } = res.data;
           console.log("Réponse register reçue:", { accessToken, user });
           return { accessToken, user };
       } catch (err) {
           console.error("Erreur lors de l'inscription:", err);
           throw new Error("Registration failed");
       }
   };

   // Connexion
   export const login = async (email: string, password: string): Promise<LoginResponse> => {
       try {
           const res = await api.post("/auth/login", { email, password });
           const { accessToken, user } = res.data;
           console.log("Réponse login reçue:", { accessToken, user });
           return { accessToken, user };
       } catch (err) {
           console.error("Erreur lors de la connexion:", err);
           const axiosError = err as AxiosError<{ message: string }>;
           if (axiosError.response) {
               throw new Error(axiosError.response.data.message || "Login failed");
           }
           throw new Error("Network error");
       }
   };

   // Vérifier la validité du refreshToken
   export const verifyRefreshToken = async (): Promise<boolean> => {
       try {
           const refreshToken = await getRefreshToken();
           if (!refreshToken) {
               console.log("Aucun refreshToken trouvé");
               return false;
           }
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
           const refreshToken = await getRefreshToken();
           if (!refreshToken) {
               console.log("Aucun refreshToken trouvé pour le rafraîchissement");
               throw new Error("No refresh token available");
           }
           const res = await api.post("/auth/refresh-token", { refreshToken });
           const newAccessToken = res.data.accessToken;
           console.log("Nouveau accessToken reçu:", newAccessToken);
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
   ```

---

### Étape 3 : Ajuster `authContext.tsx`
Mettre à jour pour utiliser `getRefreshToken` au lieu de `document.cookie`.

```tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { UserDTO } from "../types/user";
import { setAuthToken, getAuthToken } from "./api";
import { login, logout, register, verifyRefreshToken, refreshToken, getRefreshToken } from "./authApi";

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
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const restoreAuth = async () => {
            try {
                const currentAccessToken = getAuthToken();
                if (currentAccessToken) {
                    const res = await api.get("/user/profile");
                    setUser(res.data);
                    console.log("AuthProvider - État restauré avec accessToken existant, user:", res.data);
                } else {
                    const refreshTokenValue = await getRefreshToken();
                    console.log("restoreAuth - refreshToken initial:", refreshTokenValue);
                    if (refreshTokenValue) {
                        const isValid = await verifyRefreshToken();
                        console.log("restoreAuth - Token valide:", isValid);
                        if (isValid) {
                            const newAccessToken = await refreshToken();
                            if (newAccessToken) {
                                setAuthToken(newAccessToken);
                                const res = await api.get("/user/profile");
                                setUser(res.data);
                                console.log("AuthProvider - État restauré avec refreshToken, user:", res.data);
                            } else {
                                throw new Error("Failed to refresh access token");
                            }
                        } else {
                            console.log("restoreAuth - Token invalide, déconnexion");
                            logoutHandler();
                        }
                    }
                }
            } catch (err) {
                console.error("restoreAuth - Erreur lors de la restauration:", err);
                setError("Erreur lors de la vérification initiale");
                logoutHandler();
            } finally {
                setLoading(false);
            }
        };

        restoreAuth();
    }, []);

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
```

---

### Tester
1. **Effacer les cookies** :
    - "Application" > "Cookies" > `http://localhost:3000` > "Clear All".
2. **Relancer** :
    - Backend et `npm run dev`.
3. **Login** :
    - Connectez-vous via `LoginPage`.
    - Vérifiez "Application" > "Cookies" : `refreshToken` doit apparaître avec `HttpOnly`.
4. **Recharger ou accéder à `/home`** :
    - Vérifiez les logs :
        - `"refreshToken récupéré via API interne:"` dans `authApi.ts`.
        - `"Middleware - refreshToken dans cookies:"` dans `middleware.ts`.

---

### Pourquoi cela fonctionne ?
- **Backend stocke le cookie** : `Set-Cookie` dans `/auth/login` met le `refreshToken` dans le navigateur avec `HttpOnly`.
- **API interne** : `/api/get-refresh-token` permet au frontend de lire le cookie côté serveur via `req.cookies`, contournant la limitation de `HttpOnly`.
- **Envoi dans le corps** : `verifyRefreshToken` et `refreshToken` envoient le `refreshToken` dans le corps JSON, compatible avec le backend mis à jour.

Cela devrait résoudre votre problème tout en gardant `HttpOnly` pour la sécurité. Testez et confirmez ! Si le cookie n’est toujours pas récupéré, partagez les logs pour un débogage précis.