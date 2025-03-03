// /app/lib/likeApi.ts


import api from "@/config/api";

export const toggleLike = async (recipeId: number) => {
    const response = await api.post(`/likes/recipe/${recipeId}`);
    return response.data; // Retourne null (unlike) ou Like (like)
};

export const deleteLike = async (recipeId: number) => {
    await api.delete(`/likes/recipe/${recipeId}`);
};

export const isLikedByUser = async (recipeId: number) => {
    const response = await api.get(`/likes/recipe/${recipeId}`);
    return response.data; // Retourne un booléen
};

export const getLikeCountByRecipe = async (recipeId: number) => {
    const response = await api.get(`/likes/recipe/${recipeId}/count`);
    return response.data; // Retourne un entier
};