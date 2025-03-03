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