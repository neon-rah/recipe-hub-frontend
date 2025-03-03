// /app/hooks/useRecipeList.ts
"use client";

import { useState, useEffect } from "react";
import { getPublicRecipes } from "@/lib/api/recipeApi";
import { Recipe, RecipeDTO } from "@/types/recipe";

export function useRecipeList(recipesPerPage: number = 12) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const data = await getPublicRecipes(currentPage - 1, recipesPerPage); // page - 1 car backend commence à 0
                const recipeInstances = data.content.map((dto: RecipeDTO) => new Recipe(dto));
                setRecipes(recipeInstances);
                setTotalPages(data.totalPages);
            } catch (err: any) {
                console.log("userecipe error", err);
                setError(err.message || "Failed to load recipes");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [currentPage, recipesPerPage]);

    return { recipes, currentPage, totalPages, loading, error,setError, setCurrentPage };
}