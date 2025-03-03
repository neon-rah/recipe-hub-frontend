// /app/hooks/useRecipeList.ts
"use client";

import { useState, useEffect } from "react";
import { getPublicRecipes, searchPublicRecipes } from "@/lib/api/recipeApi";
import { Recipe, RecipeDTO } from "@/types/recipe";

export function useRecipeList(recipesPerPage: number = 12) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false); // Initialement false pour éviter le chargement immédiat
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchRecipes = async (page: number, query: string = "") => {
        try {
            setLoading(true);
            let data;
            if (query) {
                data = await searchPublicRecipes(query, page - 1, recipesPerPage);
                console.log("[useRecipeList] Search fetched with query:", query, "Recipes:", data.content.length);
            } else {
                data = await getPublicRecipes(page - 1, recipesPerPage);
                console.log("[useRecipeList] Initial fetch, Recipes:", data.content.length);
            }
            const recipeInstances = data.content.map((dto: RecipeDTO) => new Recipe(dto));
            setRecipes(recipeInstances);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            console.error("[useRecipeList] Error fetching recipes:", err);
            setError(err.message || "Failed to load recipes");
        } finally {
            setLoading(false);
        }
    };

    // Chargement initial au montage
    useEffect(() => {
        console.log("[useRecipeList] Initial useEffect triggered");
        fetchRecipes(currentPage);
    }, []); // Exécuté une seule fois au montage

    // Gestion des changements de page
    const setPage = (page: number) => {
        console.log("[useRecipeList] setPage called with page:", page);
        setCurrentPage(page);
        fetchRecipes(page, searchQuery); // Recharge avec la requête actuelle
    };

    // Recherche explicite
    const search = (query: string) => {
        console.log("[useRecipeList] search called with query:", query);
        setSearchQuery(query);
        setCurrentPage(1); // Réinitialise à la première page
        fetchRecipes(1, query); // Déclenche la recherche
    };

    return { recipes, currentPage, totalPages, loading, error, setError, setCurrentPage: setPage, search };
}