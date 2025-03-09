"use client";

import { useState } from "react";
import { toggleLike, isLikedByUser, getLikeCountByRecipe } from "@/lib/api/likeApi";
import { useRecipeSyncStore } from "@/stores/recipeSyncStore"; // Remplacement de useRecipeSync

export function useLike(recipeId: number) {
    const { likedStates, likeCounts, setLiked, setLikeCount } = useRecipeSyncStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggleLike = async () => {
        try {
            setLoading(true);
            const currentLiked = likedStates[recipeId] || false;
            const currentCount = likeCounts[recipeId] || 0;
            const result = await toggleLike(recipeId);

            // Vérifier l’état réel après le toggle
            const newLiked = await isLikedByUser(recipeId); // Vérification explicite
            const newCount = await getLikeCountByRecipe(recipeId); // Récupérer le vrai compte

            setLiked(recipeId, newLiked);
            setLikeCount(recipeId, newCount);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to toggle like");
        } finally {
            setLoading(false);
        }
    };

    return {
        liked: likedStates[recipeId] || false,
        likeCount: likeCounts[recipeId] || 0,
        loading,
        error,
        setError,
        handleToggleLike,
    };
}