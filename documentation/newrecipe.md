Voici une implémentation complète et refactorisée pour la création (`New Recipe`) et la mise à jour (`Update Recipe`) des recettes, couvrant le backend et le frontend avec tous les fichiers nécessaires. Je vais m'assurer que tout est cohérent avec vos exigences : utilisation de JWT avec `JwtUtil`, gestion des erreurs via `GlobalExceptionHandler`, MapStruct pour le mapping, et intégration frontend avec `AlertDialog` pour afficher les erreurs ou succès. Cette version prend en compte les tableaux `ingredients` et `preparationSteps` dans le frontend et les traite comme des chaînes dans le backend.

---

### Backend : Implémentation complète

#### 1. `RecipeFormDTO.java`
DTO pour le formulaire avec des chaînes pour `ingredients` et `preparation`.

```java
// RecipeFormDTO.java
package org.schoolproject.backend.dto;

import lombok.Data;

@Data
public class RecipeFormDTO {
    private String title;
    private String description;
    private String ingredients; // Chaîne séparée par des virgules
    private String preparation; // Chaîne séparée par des points-virgules
    private String category;
}
```

#### 2. `RecipeMapper.java`
Mapper MapStruct pour convertir `RecipeFormDTO` en `RecipeDTO`.

```java
// RecipeMapper.java
package org.schoolproject.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.schoolproject.backend.dto.RecipeDTO;
import org.schoolproject.backend.dto.RecipeFormDTO;

@Mapper(componentModel = "spring")
public interface RecipeMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "user", ignore = true)
    RecipeDTO toRecipeDTO(RecipeFormDTO formDTO);
}
```

#### 3. `RecipeController.java`
Contrôleur avec création et mise à jour.

```java
// RecipeController.java
package org.schoolproject.backend.controllers;

import org.schoolproject.backend.config.JwtUtil;
import org.schoolproject.backend.dto.RecipeDTO;
import org.schoolproject.backend.dto.RecipeFormDTO;
import org.schoolproject.backend.mappers.RecipeMapper;
import org.schoolproject.backend.services.RecipeService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;
    private final JwtUtil jwtUtil;

    public RecipeController(RecipeService recipeService, RecipeMapper recipeMapper, JwtUtil jwtUtil) {
        this.recipeService = recipeService;
        this.recipeMapper = recipeMapper;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecipeDTO> createRecipe(
            @ModelAttribute RecipeFormDTO formDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpServletRequest request) {
        String token = extractToken(request);
        if (!jwtUtil.validateToken(token)) {
            throw new SecurityException("Invalid JWT token");
        }
        UUID userId = jwtUtil.extractUserId(token);

        RecipeDTO recipeDTO = recipeMapper.toRecipeDTO(formDTO);
        RecipeDTO createdRecipe = recipeService.createRecipe(recipeDTO, image, userId);
        return ResponseEntity.ok(createdRecipe);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecipeDTO> updateRecipe(
            @PathVariable int id,
            @ModelAttribute RecipeFormDTO formDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpServletRequest request) {
        String token = extractToken(request);
        if (!jwtUtil.validateToken(token)) {
            throw new SecurityException("Invalid JWT token");
        }
        UUID userId = jwtUtil.extractUserId(token);

        RecipeDTO recipeDTO = recipeMapper.toRecipeDTO(formDTO);
        RecipeDTO updatedRecipe = recipeService.updateRecipe(id, recipeDTO, image, userId);
        return ResponseEntity.ok(updatedRecipe);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> findRecipeById(@PathVariable int id) {
        return recipeService.findRecipeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<RecipeDTO>> findAllRecipes() {
        return ResponseEntity.ok(recipeService.findAllRecipes());
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new SecurityException("Missing or invalid Authorization header");
        }
        return authHeader.substring(7);
    }
}
```

#### 4. `RecipeServiceImpl.java`
Service avec gestion des erreurs.

```java
// RecipeServiceImpl.java
package org.schoolproject.backend.services.impl;

import org.schoolproject.backend.dto.RecipeDTO;
import org.schoolproject.backend.entities.Recipe;
import org.schoolproject.backend.mappers.RecipeMapper;
import org.schoolproject.backend.repositories.RecipeRepository;
import org.schoolproject.backend.services.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final FileStorageService fileStorageService;
    private final RecipeMapper recipeMapper;

    public RecipeServiceImpl(RecipeRepository recipeRepository, FileStorageService fileStorageService, 
                             RecipeMapper recipeMapper) {
        this.recipeRepository = recipeRepository;
        this.fileStorageService = fileStorageService;
        this.recipeMapper = recipeMapper;
    }

    @Override
    public RecipeDTO createRecipe(RecipeDTO recipeDTO, MultipartFile recipeImage, UUID userId) {
        String imgUrl = null;
        if (recipeImage != null && !recipeImage.isEmpty()) {
            imgUrl = fileStorageService.storeFile(recipeImage, "recipe", null);
        }

        Recipe recipe = recipeMapper.toEntity(recipeDTO);
        recipe.setImage(imgUrl);
        recipe.setUserId(userId);

        Recipe savedRecipe = recipeRepository.save(recipe);
        return recipeMapper.toDto(savedRecipe);
    }

    @Override
    @Transactional
    public RecipeDTO updateRecipe(int recipeId, RecipeDTO updatedRecipeDTO, MultipartFile newRecipeImage, UUID userId) {
        return recipeRepository.findById(recipeId).map(existingRecipe -> {
            if (!existingRecipe.getUserId().equals(userId)) {
                throw new SecurityException("You are not authorized to update this recipe");
            }

            existingRecipe.setTitle(updatedRecipeDTO.getTitle());
            existingRecipe.setDescription(updatedRecipeDTO.getDescription());
            existingRecipe.setCategory(updatedRecipeDTO.getCategory());
            existingRecipe.setIngredients(updatedRecipeDTO.getIngredients());
            existingRecipe.setPreparation(updatedRecipeDTO.getPreparation());

            if (newRecipeImage != null && !newRecipeImage.isEmpty()) {
                String newImgUrl = fileStorageService.storeFile(newRecipeImage, "recipe", existingRecipe.getImage());
                existingRecipe.setImage(newImgUrl);
            }

            return recipeMapper.toDto(recipeRepository.save(existingRecipe));
        }).orElseThrow(() -> new IllegalArgumentException("Recipe not found"));
    }

    @Override
    public Optional<RecipeDTO> findRecipeById(int recipeId) {
        return recipeRepository.findById(recipeId).map(recipeMapper::toDto);
    }

    @Override
    public List<RecipeDTO> findAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(recipeMapper::toDto)
                .collect(Collectors.toList());
    }
}
```

#### 5. `RecipeService.java`
Interface du service.

```java
// RecipeService.java
package org.schoolproject.backend.services;

import org.schoolproject.backend.dto.RecipeDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecipeService {
    RecipeDTO createRecipe(RecipeDTO recipeDTO, MultipartFile recipeImage, UUID userId);
    RecipeDTO updateRecipe(int recipeId, RecipeDTO recipeDTO, MultipartFile recipeImage, UUID userId);
    Optional<RecipeDTO> findRecipeById(int recipeId);
    List<RecipeDTO> findAllRecipes();
}
```

---

### Frontend : Implémentation complète

#### 1. `recipe-validation.ts`
Règles adaptées aux tableaux.

```ts
// /app/lib/recipe-validation.ts
export const VALIDATION_RULES = {
  title: { required: "Title is required", minLength: 3, minLengthMessage: "Title must be at least 3 characters" },
  description: { required: "Description is required", minLength: 10, minLengthMessage: "Description must be at least 10 characters" },
  ingredients: { required: "At least one ingredient is required", minLength: 2, minLengthMessage: "Each ingredient must be at least 2 characters" },
  preparationSteps: { required: "At least one preparation step is required", minLength: 5, minLengthMessage: "Each step must be at least 5 characters" },
  category: { required: "Category is required", minLength: 2, minLengthMessage: "Category must be at least 2 characters" },
  image: { required: "Image is required" },
};
```

#### 2. `recipeApi.ts`
Appels API avec gestion des erreurs.

```ts
// /app/lib/recipeApi.ts
import api from "@/lib/api";

export const createRecipe = async (formData: FormData) => {
  try {
    const response = await api.post("/recipes", formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create recipe");
  }
};

export const updateRecipe = async (id: number, formData: FormData) => {
  try {
    const response = await api.put(`/recipes/${id}`, formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update recipe");
  }
};

export const getRecipeById = async (id: number) => {
  try {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch recipe");
  }
};
```

#### 3. `use-recipe-form.ts`
Hook pour gérer création et mise à jour.

```ts
// /app/hooks/use-recipe-form.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VALIDATION_RULES } from "@/lib/recipe-validation";
import { createRecipe, updateRecipe, getRecipeById } from "@/lib/recipeApi";

type RecipeFormData = {
  title: string;
  description: string;
  ingredients: string[];
  preparationSteps: string[];
  category: string;
  image: File | null;
};

type ValidationErrors = Partial<Record<keyof RecipeFormData, string>>;

export function useRecipeForm(recipeId?: number) {
  const router = useRouter();
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    ingredients: [""],
    preparationSteps: [""],
    category: "",
    image: null,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (recipeId) {
      const fetchRecipe = async () => {
        try {
          const data = await getRecipeById(recipeId);
          setFormData({
            title: data.title || "",
            description: data.description || "",
            ingredients: data.ingredients ? data.ingredients.split(", ") : [""],
            preparationSteps: data.preparation ? data.preparation.split("; ") : [""],
            category: data.category || "",
            image: null,
          });
        } catch (error: any) {
          setErrors({ title: error.message });
        }
      };
      fetchRecipe();
    }
  }, [recipeId]);

  const validateField = (name: keyof RecipeFormData, value: string | string[] | File | null) => {
    const rule = VALIDATION_RULES[name];
    if (!value || (Array.isArray(value) && value.every((v) => v.trim() === ""))) return rule.required;
    if (typeof value === "string" && value.length < rule.minLength) return rule.minLengthMessage;
    if (Array.isArray(value)) {
      const invalid = value.some((v) => v.trim().length < rule.minLength && v.trim() !== "");
      if (invalid) return rule.minLengthMessage;
    }
    return "";
  };

  const handleChange = (name: keyof RecipeFormData, value: string | string[] | File | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      ingredients: [""],
      preparationSteps: [""],
      category: "",
      image: null,
    });
    setErrors({});
    setSubmitStatus(null);
  };

  const handleSubmit = async () => {
    const newErrors: ValidationErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof RecipeFormData, value);
      if (error) newErrors[key as keyof RecipeFormData] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitStatus({ success: false, message: "Please fix the errors in the form" });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("ingredients", formData.ingredients.filter((ing) => ing.trim() !== "").join(", "));
    data.append("preparation", formData.preparationSteps.filter((step) => step.trim() !== "").join("; "));
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);

    try {
      if (recipeId) {
        await updateRecipe(recipeId, data);
        setSubmitStatus({ success: true, message: "Recipe updated successfully!" });
      } else {
        await createRecipe(data);
        setSubmitStatus({ success: true, message: "Recipe created successfully!" });
      }
      setTimeout(() => router.push("/profile"), 2000);
    } catch (error: any) {
      setSubmitStatus({ success: false, message: error.message });
    }
  };

  return { formData, errors, submitStatus, handleChange, handleSubmit, resetForm };
}
```

#### 4. `new-recipe.tsx`
Composant complet avec création et mise à jour.

```ts
// /app/components/features/new-recipe.tsx
"use client";

import { useRecipeForm } from "@/hooks/use-recipe-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";
import { CATEGORIES } from "@/config/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NewRecipeProps {
  onSubmit: () => void;
  initialId?: number;
}

export default function NewRecipe({ onSubmit, initialId }: NewRecipeProps) {
  const { formData, errors, submitStatus, handleChange, handleSubmit, resetForm } = useRecipeForm(initialId);

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    handleChange("ingredients", updatedIngredients);
  };

  const handleAddIngredient = () => {
    if (formData.ingredients.some((ing) => ing.trim() === "")) return;
    const updatedIngredients = [...formData.ingredients, ""];
    handleChange("ingredients", updatedIngredients);
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
    handleChange("ingredients", updatedIngredients);
  };

  const handlePreparationStepChange = (index: number, value: string) => {
    const updatedSteps = [...formData.preparationSteps];
    updatedSteps[index] = value;
    handleChange("preparationSteps", updatedSteps);
  };

  const handleAddPreparationStep = () => {
    if (formData.preparationSteps.some((step) => step.trim() === "")) return;
    const updatedSteps = [...formData.preparationSteps, ""];
    handleChange("preparationSteps", updatedSteps);
  };

  const handleRemovePreparationStep = (index: number) => {
    const updatedSteps = formData.preparationSteps.filter((_, i) => i !== index);
    handleChange("preparationSteps", updatedSteps);
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="shadow-gray-700 w-full dark:bg-background-dark/80 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-primary mb-4">{initialId ? "Edit Recipe" : "New Recipe"}</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 space-y-4 min-w-[300px]">
            <div>
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter recipe title"
                errorMessage={errors.title}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your recipe"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label>Ingredients</Label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveIngredient(index)}
                      className="bg-red-400 hover:bg-red-300 dark:bg-primary-dark"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients}</p>}
              <Button
                type="button"
                onClick={handleAddIngredient}
                className="bg-secondary hover:bg-gray-400 dark:bg-secondary-dark dark:hover:bg-gray-400 text-white"
              >
                <PlusIcon className="w-4 h-4 mr-2" /> Add Ingredient
              </Button>
            </div>

            <div className="space-y-4">
              <Label>Preparation</Label>
              {formData.preparationSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={step}
                    onChange={(e) => handlePreparationStepChange(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                  />
                  {formData.preparationSteps.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="bg-red-400 hover:bg-red-300 dark:bg-primary-dark"
                      onClick={() => handleRemovePreparationStep(index)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.preparationSteps && <p className="text-red-500 text-sm">{errors.preparationSteps}</p>}
              <Button
                type="button"
                onClick={handleAddPreparationStep}
                className="bg-secondary hover:bg-gray-400 dark:bg-secondary-dark dark:hover:bg-gray-400 text-white"
              >
                <PlusIcon className="w-4 h-4 mr-2" /> Add Step
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-4 min-w-[250px]">
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-100 dark:bg-black/90">
                  {CATEGORIES.map((c) => (
                    <SelectItem className="hover:bg-gray-600" key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div>
              <Label>Image</Label>
              <ImageUpload
                className="w-full h-[200px]"
                shape="square"
                onImageSelect={(file) => handleChange("image", file)}
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" className="w-40" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="w-40">
            {initialId ? "Update" : "Publish"}
          </Button>
        </div>

        {submitStatus && (
          <AlertDialog open={!!submitStatus}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{submitStatus.success ? "Success" : "Error"}</AlertDialogTitle>
                <AlertDialogDescription>{submitStatus.message}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSubmitStatus(null)}>Close</AlertDialogCancel>
                {submitStatus.success && (
                  <AlertDialogAction onClick={onSubmit}>Go to Profile</AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </form>
    </div>
  );
}
```

#### 5. `publish/page.tsx`
Page avec gestion des paramètres pour création/mise à jour.

```ts
// /app/publish/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import NewRecipe from "@/components/features/new-recipe";
import ProtectedRoute from "@/components/layout/protected-route";

export default function PublishPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id") ? Number(searchParams.get("id")) : undefined;

  const handlePostSubmit = () => {
    router.push("/profile");
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6 pb-20">
        <NewRecipe onSubmit={handlePostSubmit} initialId={recipeId} />
      </div>
    </ProtectedRoute>
  );
}
```

---

### Frontend : Dépendances supplémentaires

#### `api.ts`
Assurez-vous que votre instance Axios est bien configurée comme suit :

```ts
// /app/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true,
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = () => authToken;

export const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await api.post("/auth/refresh-token");
    const newAccessToken = res.data.accessToken;
    setAuthToken(newAccessToken);
    return newAccessToken;
  } catch (err) {
    throw new Error("Token refresh failed");
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### `constants.ts`
Exemple de constantes pour `CATEGORIES`.

```ts
// /app/config/constants.ts
export const CATEGORIES = ["Dessert", "Main Course", "Appetizer", "Breakfast"];
```

---

### Flux complet

1. **Création** :
    - Accès à `/publish`.
    - Remplissage du formulaire.
    - Validation locale → `FormData` envoyé à `/api/recipes` avec le token JWT.
    - Backend valide le token, crée la recette, retourne `RecipeDTO`.
    - Succès : `AlertDialog` avec "Recipe created successfully!" → redirection vers `/profile`.
    - Erreur : `AlertDialog` avec message (ex. "Invalid JWT token").

2. **Mise à jour** :
    - Accès à `/publish?id=123`.
    - Formulaire pré-rempli avec les données de la recette via `getRecipeById`.
    - Modifications → `FormData` envoyé à `/api/recipes/123` avec le token JWT.
    - Backend valide le token et l’autorisation, met à jour la recette.
    - Succès : `AlertDialog` avec "Recipe updated successfully!" → redirection.
    - Erreur : `AlertDialog` avec message (ex. "You are not authorized to update this recipe").

---

### Gestion des erreurs
- **Backend** : `GlobalExceptionHandler` renvoie des JSON structurés (ex. `{"status": "400", "error": "Bad Request", "message": "Invalid JWT token"}`).
- **Frontend** : Les erreurs sont capturées dans `recipeApi.ts` et affichées via `AlertDialog`. Les `try/catch` empêchent les crashs.

---

### Conclusion
Cette implémentation couvre :
- **Création et mise à jour** des recettes avec prise en charge des tableaux `ingredients` et `preparationSteps`.
- **Backend** : JWT avec `JwtUtil`, MapStruct, et gestion des erreurs centralisée.
- **Frontend** : Formulaire dynamique, validation, et affichage des erreurs/succès avec `AlertDialog`.

Testez avec différents scénarios (token invalide, champs manquants, mise à jour non autorisée) pour valider la robustesse ! Si vous avez besoin d’ajustements (ex. gérer les tableaux différemment au backend), faites-moi signe.