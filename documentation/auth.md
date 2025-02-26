Pour sécuriser les routes et configurer ton projet Next.js pour qu'il fonctionne correctement avec ton backend Spring Boot, voici les bonnes pratiques à suivre :

### 1. **Stockage des Tokens (Access & Refresh)**
- **Access Token** : À stocker en **mémoire** (state ou context dans Next.js) pour éviter les attaques XSS.
- **Refresh Token** : Stocké dans un **cookie HTTP-only, Secure** (géré par le backend) pour éviter le vol de session.

### 2. **Configuration du Projet Next.js**
Dans ton fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
Puis dans `next.config.js`, si besoin :
```javascript
module.exports = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
```

### 3. **Gestion des Requêtes Authentifiées**
Créer un utilitaire pour gérer les appels API avec l'Access Token :
```javascript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Permet d'envoyer les cookies (Refresh Token)
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
```

### 4. **Middleware pour Protéger les Routes**
Créer un middleware pour protéger certaines pages :
Dans `middleware.ts` :
```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken"); // Vérifier le token dans les cookies

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
}

// Appliquer le middleware à certaines routes
export const config = {
  matcher: ["/dashboard/:path*"], // Toutes les routes sous /dashboard sont protégées
};
```

### 5. **Gestion Globale de l'Auth dans Next.js (Context)**
Créer un **AuthProvider** (`context/AuthContext.js`) :
```javascript
import { createContext, useState, useEffect, useContext } from "react";
import api, { setAuthToken } from "@/utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAuthToken(storedToken);
      setToken(storedToken);
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    setAuthToken(res.data.accessToken);
    localStorage.setItem("accessToken", res.data.accessToken);
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 6. **Utilisation dans une Page Protégée**
```javascript
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return (
    <div>
      <h1>Bienvenue {user?.name}</h1>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
};

export default Dashboard;
```

---

Avec cette structure :
✅ **Sécurité** : Access Token stocké en mémoire, Refresh Token en cookie HTTP-only  
✅ **Routing sécurisé** : Middleware pour protéger les routes sensibles  
✅ **Bonne organisation** : Auth gérée avec Context API

Tu veux que je t'aide à intégrer ça progressivement dans ton projet ? 🚀

Bonne question ! ✅  
Voici pourquoi et comment bien gérer l'authentification en Next.js avec un backend Spring Boot.

---

## 🚀 **Pourquoi stocker l'Access Token en mémoire et pas en localStorage ?**
1. **Sécurité contre le XSS (Cross-Site Scripting)**
    - Si l’Access Token est dans `localStorage`, un attaquant qui injecte du code malveillant dans ton site peut y accéder et voler le token.
    - En **stockant l’Access Token en mémoire (state, context, Redux, etc.)**, il est inaccessible au JavaScript malveillant.

2. **Le Refresh Token est plus sécurisé en Cookie HTTP-only**
    - Le **Refresh Token** permet d'obtenir un nouvel **Access Token** et doit être sécurisé pour éviter le vol de session.
    - Un **cookie HTTP-only + Secure + SameSite=strict** empêche l'accès via JavaScript et les attaques CSRF.

---

## 🔄 **Comment rafraîchir l’Access Token après son expiration ?**
👉 **Flow recommandé :**
1. L'Access Token est en mémoire et expire après **15 minutes**.
2. Lorsque l’Access Token expire, une requête est envoyée pour récupérer un nouveau **Access Token** via le **Refresh Token** (stocké en cookie).
3. Le **backend Spring Boot** vérifie le Refresh Token et génère un nouvel Access Token.
4. Le frontend met à jour l'Access Token en mémoire.

---

## 🏗 **Implémentation en Next.js**
### **1️⃣ API pour rafraîchir le token (`utils/api.js`)**
```javascript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Permet d'envoyer les cookies (Refresh Token)
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Fonction pour rafraîchir l'Access Token
export const refreshToken = async () => {
  try {
    const res = await api.post("/auth/refresh"); // Le backend envoie un nouvel Access Token
    const newAccessToken = res.data.accessToken;
    setAuthToken(newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error("Error refreshing token", err);
    return null;
  }
};

export default api;
```

---

### **2️⃣ Gestion globale de l’auth (`context/AuthContext.js`)**
```javascript
import { createContext, useState, useEffect, useContext } from "react";
import api, { setAuthToken, refreshToken } from "@/utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Charger le token initialement
  useEffect(() => {
    const loadUser = async () => {
      const newToken = await refreshToken(); // Essayer de récupérer un nouveau token
      if (newToken) {
        setToken(newToken);
        setAuthToken(newToken);
        fetchUser();
      }
    };
    loadUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    setAuthToken(res.data.accessToken);
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = () => {
    setToken(null);
    setAuthToken(null);
    setUser(null);
    api.post("/auth/logout"); // Supprime le Refresh Token côté backend
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

### **3️⃣ Middleware pour protéger les routes (`middleware.ts`)**
```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("refreshToken"); // Vérifier seulement le Refresh Token

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

### **4️⃣ Gestion automatique du rafraîchissement (axios interceptor)**
Si une requête est renvoyée avec un Access Token expiré, on récupère un nouveau token **automatiquement** :
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Réessayer la requête avec le nouveau token
      }
    }
    return Promise.reject(error);
  }
);
```

---

## ✅ **Récapitulatif de la gestion des tokens**
| **Type de Token**   | **Où le stocker ?** | **Pourquoi ?** |
|---------------------|-------------------|----------------|
| Access Token (15 min)  | **Mémoire (state/context)** | Éviter les attaques XSS |
| Refresh Token (7 jours) | **Cookie HTTP-only, Secure** | Sécurisé contre XSS et CSRF |

## 🔥 **Avantages de cette approche**
- **Sécurité maximale** ✅
- **Rafraîchissement du token automatique** ✅
- **Bonne séparation des responsabilités** (backend = gestion des tokens, frontend = affichage) ✅

---

👉 Tu veux que je t’aide à l’intégrer étape par étape ? 🚀