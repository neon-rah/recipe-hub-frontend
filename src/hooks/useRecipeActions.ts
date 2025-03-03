// /app/hooks/useRecipeActions.ts
"use client";

import { useRouter } from "next/navigation";
import { deleteRecipe } from "@/lib/api/recipeApi";
import {useState} from "react";

export function useRecipeActions(recipeId: number) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = () => {
        router.push(`/publish?id=${recipeId}`);
    };

    const handleDelete = async () => {
        try {
            await deleteRecipe(recipeId);
            router.push("/profile"); // Redirection après suppression
        } catch (err: any) {
            setError(err.message || "Failed to delete recipe");
        }
    };

    return { handleUpdate, handleDelete, error, setError };
}