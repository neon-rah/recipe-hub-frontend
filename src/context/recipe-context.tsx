// /app/contexts/recipe-context.tsx
"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Recipe, RecipeDTO } from "@/types/recipe";
import { getPublicRecipes, searchPublicRecipes } from "@/lib/api/recipeApi";

interface RecipeContextState {
    recipes: Recipe[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    fetchRecipes: (page: number) => Promise<void>;
    searchRecipes: (query: string, page?: number) => Promise<void>;
    setPage: (page: number) => void;
    setError:(error:string|null)=> void;
    resetRecipes: () => Promise<void>; // Nouvelle fonction pour annuler la recherche
}

const RecipeContext = createContext<RecipeContextState | undefined>(undefined);

export function RecipeProvider({ children, recipesPerPage = 12 }: { children: React.ReactNode; recipesPerPage?: number }) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchRecipes = useCallback(async (page: number) => {
        console.log("[RecipeContext] fetchRecipes called with page:", page);
        try {
            setLoading(true);
            const data = await getPublicRecipes(page - 1, recipesPerPage);
            const recipeInstances = data.content.map((dto: RecipeDTO) => new Recipe(dto));
            setRecipes(recipeInstances);
            setTotalPages(data.totalPages);
            console.log("[RecipeContext] Recipes fetched:", recipeInstances.length, "Total pages:", data.totalPages);
        } catch (err: any) {
            console.error("[RecipeContext] Error fetching recipes:", err);
            setError(err.message || "Failed to load recipes");
        } finally {
            setLoading(false);
        }
    }, [recipesPerPage]);

    const searchRecipes = useCallback(async (query: string, page: number = 1) => {
        console.log("[RecipeContext] searchRecipes called with query:", query, "page:", page);
        try {
            setLoading(true);
            const data = await searchPublicRecipes(query, page - 1, recipesPerPage);
            const recipeInstances = data.content.map((dto: RecipeDTO) => new Recipe(dto));
            setRecipes(recipeInstances);
            setTotalPages(data.totalPages);
            setSearchQuery(query);
            setCurrentPage(page);
            console.log("[RecipeContext] Search results fetched:", recipeInstances.length, "Total pages:", data.totalPages);
        } catch (err: any) {
            console.error("[RecipeContext] Error searching recipes:", err);
            setError(err.message || "Failed to load recipes");
        } finally {
            setLoading(false);
        }
    }, [recipesPerPage]);

    const setPage = (page: number) => {
        console.log("[RecipeContext] setPage called with page:", page);
        setCurrentPage(page);
        if (searchQuery) {
            searchRecipes(searchQuery, page);
        } else {
            fetchRecipes(page);
        }
    };

    const resetRecipes = useCallback(async () => {
        console.log("[RecipeContext] resetRecipes called");
        setSearchQuery(""); // Réinitialise la requête
        setCurrentPage(1); // Revient à la première page
        await fetchRecipes(1); // Recharge toutes les recettes non filtrées
    }, [fetchRecipes]);

    // Chargement initial
    useEffect(() => {
        fetchRecipes(1);
    }, [fetchRecipes]);

    return (
        <RecipeContext.Provider
            value={{
                recipes,
                currentPage,
                totalPages,
                loading,
                error,
                searchQuery,
                fetchRecipes,
                searchRecipes,
                setPage,
                setError,
                resetRecipes,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipes() {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error("useRecipes must be used within a RecipeProvider");
    }
    return context;
}