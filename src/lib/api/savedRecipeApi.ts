// /app/lib/savedRecipeApi.ts
import api from "@/config/api";

export const toggleSavedRecipe = async (recipeId: number) => {
    const response = await api.post(`/saved-recipes/recipe/${recipeId}`);
    return response.data; // Retourne SavedRecipe ou null
};

export const isRecipeSaved = async (recipeId: number) => {
    const response = await api.get(`/saved-recipes/exists/${recipeId}`);
    return response.data; // Retourne un booléen
};

export const getSavedRecipesPaged = async (page: number, size: number = 12, category?: string) => {
    const url = category && category !== "All"
        ? `/saved-recipes/paged?page=${page}&size=${size}&category=${encodeURIComponent(category)}`
        : `/saved-recipes/paged?page=${page}&size=${size}`;
    const response = await api.get(url);
    return response.data;
};

export const removeSavedRecipe = async (recipeId: number) => {
    await api.delete(`/saved-recipes/recipe/${recipeId}`);
};

export const getSavedRecipes = async () => {
    const response = await api.get("/saved-recipes");
    return response.data;
};



export const clearAllSavedRecipes = async () => {
    await api.delete("/saved-recipes");
};

