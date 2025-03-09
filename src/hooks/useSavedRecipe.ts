"use client";

import { useState } from "react";
import { toggleSavedRecipe, isRecipeSaved } from "@/lib/api/savedRecipeApi";
import { useRecipeSyncStore } from "@/stores/recipeSyncStore"; // Remplacement de useRecipeSync

export function useSavedRecipe(recipeId: number) {
    const { savedStates, setSaved } = useRecipeSyncStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggleSaved = async () => {
        try {
            setLoading(true);
            await toggleSavedRecipe(recipeId);
            const newSaved = await isRecipeSaved(recipeId); // Vérification explicite
            setSaved(recipeId, newSaved);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to toggle saved");
        } finally {
            setLoading(false);
        }
    };

    return {
        saved: savedStates[recipeId] || false,
        loading,
        error,
        setError,
        handleToggleSaved,
    };
}