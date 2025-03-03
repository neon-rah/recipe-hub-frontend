// /lib/api/recipeApi.ts
import api from "@/config/api";

export const createRecipe = async (formData: FormData) => {
    try {
        const response = await api.post("/recipes", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Explicitement défini, mais optionnel avec Axios
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create recipe");
    }
};

export const updateRecipe = async (id: number, formData: FormData) => {
    try {
        const response = await api.put(`/recipes/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Explicitement défini, mais optionnel avec Axios
            },
        });
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
        console.debug("getRecipeById: Error status:", error.response?.status);
        if (error.response?.status === 403) {
            throw error; // Propager l'erreur brute avec response intacte
        }
        throw error; // Propager l'erreur brute pour autres cas
    }
};

export const deleteRecipe = async (recipeId: number) => {
    await api.delete(`/recipes/${recipeId}`);
};

export const getPublicRecipes = async (page: number, size: number) => {
    const response = await api.get(`/recipes/public?page=${page}&size=${size}`);
    console.log("information du recipe, recipeapi ",response.data);
    return response.data; // Retourne { content: RecipeDTO[], totalPages: number, ... }
};