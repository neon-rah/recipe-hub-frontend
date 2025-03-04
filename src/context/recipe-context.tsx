// /app/contexts/recipe-context.tsx
"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Recipe, RecipeDTO } from "@/types/recipe";
import { getPublicRecipes, searchPublicRecipes } from "@/lib/api/recipeApi";

export const CATEGORIES = ["Appetizer", "Main Course", "Dessert", "Beverage", "Side Dish"];

interface RecipeContextState {
    recipes: Recipe[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    activeCategory: string;
    fetchRecipes: (page: number) => Promise<void>;
    searchRecipes: (query: string, page?: number) => Promise<void>;
    setPage: (page: number) => void;
    setError: (error: string|null) => void;
    resetRecipes: () => Promise<void>;
    setCategory: (category: string) => void;
}

const RecipeContext = createContext<RecipeContextState | undefined>(undefined);

export function RecipeProvider({ children, recipesPerPage = 12 }: { children: React.ReactNode; recipesPerPage?: number }) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const fetchRecipes = useCallback(async (page: number) => {
        console.log("[RecipeContext] fetchRecipes called with page:", page, "category:", activeCategory);
        try {
            setLoading(true);
            const data = await getPublicRecipes(page - 1, recipesPerPage, activeCategory);
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
    }, [recipesPerPage, activeCategory]);

    const searchRecipes = useCallback(async (query: string, page: number = 1) => {
        console.log("[RecipeContext] searchRecipes called with query:", query, "page:", page, "category:", activeCategory);
        try {
            setLoading(true);
            const data = await searchPublicRecipes(query, page - 1, recipesPerPage, activeCategory);
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
    }, [recipesPerPage, activeCategory]);

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
        setSearchQuery("");
        setCurrentPage(1);
        setActiveCategory("All");
        await fetchRecipes(1);
    }, [fetchRecipes]);

    const setCategory = (category: string) => {
        console.log("[RecipeContext] setCategory called with category:", category);
        setActiveCategory(category);
        setCurrentPage(1);
        if (searchQuery) {
            searchRecipes(searchQuery, 1);
        } else {
            fetchRecipes(1);
        }
    };

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
                activeCategory,
                fetchRecipes,
                searchRecipes,
                setPage,
                setError,
                resetRecipes,
                setCategory,
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