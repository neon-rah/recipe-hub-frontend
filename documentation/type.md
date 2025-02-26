Voici la **conversion des classes Java en interfaces TypeScript** pour ton projet **Next.js**.

---

## **📌 Organisation des fichiers TypeScript**
📂 `src/types/` (Dossier contenant tous les types TypeScript)
- 📄 `user.ts` → Interface `UserDTO`
- 📄 `recipe.ts` → Interface `RecipeDTO`
- 📄 `notification.ts` → Interface `NotificationDTO`

---

### 🔹 **1. Conversion de `UserDTO` → `user.ts`**
Fichier : `src/types/user.ts`

```typescript
import { RecipeDTO } from "./recipe";

export interface UserDTO {
  idUser: string; // UUID sous forme de string
  lastName: string;
  firstName: string;
  email: string;
  password?: string; // Facultatif car @JsonIgnore en backend
  address: string;
  profilePic: string;
  created: string; // LocalDateTime est stocké en string en JSON

  recipes?: RecipeDTO[]; // Liste des recettes créées par l'utilisateur
}
```

✅ **Remarque :**
- `UUID` en Java devient `string` en TypeScript.
- `LocalDateTime` devient `string` car JSON stocke les dates sous forme de texte.
- `password` est `optional (?)` car il est ignoré en JSON (`@JsonIgnore`).
- `recipes` est facultatif (`?`) car toutes les requêtes ne renvoient pas cet attribut.

---

### 🔹 **2. Conversion de `RecipeDTO` → `recipe.ts`**
Fichier : `src/types/recipe.ts`

```typescript
import { UserDTO } from "./user";

export interface RecipeDTO {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  preparation: string;
  category: string;
  region: string;
  image: string;
  creationDate: string; // LocalDateTime devient string
  updatedDate: string;

  user?: UserDTO; // L'utilisateur qui a publié la recette
}
```

✅ **Remarque :**
- `user` est facultatif (`?`) pour éviter des problèmes avec certaines requêtes API.

---

### 🔹 **3. Conversion de `NotificationDTO` → `notification.ts`**
Fichier : `src/types/notification.ts`

```typescript
export interface NotificationDTO {
  idNotif: number;
  senderId: string; // UUID
  senderLastName: string;
  senderFirstName: string;
  senderEmail: string;
  senderProfilePic: string;
  title: string;
  message: string;
  createdAt: string; // LocalDateTime devient string
  read: boolean;
  relatedEntityId?: number; // L'ID de la recette ou utilisateur lié à la notification
  entityType?: "user" | "recipe"; // Type d'entité (soit un user, soit une recette)
}
```

✅ **Remarque :**
- `relatedEntityId` et `entityType` sont facultatifs (`?`) pour gérer le cas où une notification n’a pas d'entité liée.
- `entityType` est limité à `"user"` ou `"recipe"` pour éviter des erreurs.

---

## **📌 Conclusion**
🚀 Maintenant, ton **frontend Next.js** a des interfaces **claires et robustes** qui correspondent exactement aux DTOs du **backend Spring Boot**.

### **Avantages**
✅ **Sécurise ton code avec TypeScript**  
✅ **Meilleure autocomplétion et détection d'erreurs**  
✅ **Facilité d’évolution en cas de changement du backend**

Tu veux aussi que je t’aide à implémenter la logique d'authentification (login, register) avec ces DTOs ? 😃