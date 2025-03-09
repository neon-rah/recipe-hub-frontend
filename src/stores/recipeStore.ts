"use client";

import { create } from "zustand";
import { Recipe, RecipeDTO } from "@/types/recipe";
import { getPublicRecipes, searchPublicRecipes } from "@/lib/api/recipeApi";

export const CATEGORIES = ["Appetizer", "Main Course", "Dessert", "Beverage", "Side Dish"];

interface RecipeState {
    recipes: Recipe[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    activeCategory: string;
    recipesPerPage: number;
    fetchRecipes: (page: number) => Promise<void>;
    searchRecipes: (query: string, page?: number) => Promise<void>;
    setPage: (page: number) => void;
    setError: (error: string | null) => void;
    resetRecipes: () => Promise<void>;
    setCategory: (category: string) => void;
    selectedRecipe: Recipe | null;
    setSelectedRecipe: (recipe: Recipe | null) => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
    recipes: [],
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
    searchQuery: "",
    activeCategory: "All",
    recipesPerPage: 12,
    selectedRecipe: null,


    setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),

    fetchRecipes: async (page: number) => {
        console.log("[useRecipeStore] fetchRecipes called with page:", page, "category:", get().activeCategory);
        try {
            set({ loading: true });
            const data = await getPublicRecipes(page - 1, get().recipesPerPage, get().activeCategory);
            const recipeInstances = data.content.map((dto: RecipeDTO) => new Recipe(dto));
            set({
                recipes: recipeInstances,
                totalPages: data.totalPages,
                currentPage: page,
                loading: false,
                error: null,
            });
            console.log("[useRecipeStore] Recipes fetched:", recipeInstances.length, "Total pages:", data.totalPages);
        } catch (err: any) {
            console.error("[useRecipeStore] Error fetching recipes:", err);
            set({ error: err.message || "Failed to load recipes", loading: false });
        }
    },

    searchRecipes: async (query: string, page: number = 1) => {
        console.log("[useRecipeStore] searchRecipes called with query:", query, "page:", page, "category:", get().activeCategory);
        try {
            set({ loading: true });
            const data = await searchPublicRecipes(query, page - 1, get().recipesPerPage, get().activeCategory);
            const recipeInstances = data.content.map((dto: RecipeDTO) => new Recipe(dto));
            set({
                recipes: recipeInstances,
                totalPages: data.totalPages,
                searchQuery: query,
                currentPage: page,
                loading: false,
                error: null,
            });
            console.log("[useRecipeStore] Search results fetched:", recipeInstances.length, "Total pages:", data.totalPages);
        } catch (err: any) {
            console.error("[useRecipeStore] Error searching recipes:", err);
            set({ error: err.message || "Failed to load recipes", loading: false });
        }
    },

    setPage: (page: number) => {
        console.log("[useRecipeStore] setPage called with page:", page);
        set({ currentPage: page });
        const { searchQuery, fetchRecipes, searchRecipes } = get();
        if (searchQuery) {
            searchRecipes(searchQuery, page);
        } else {
            fetchRecipes(page);
        }
    },

    setError: (error: string | null) => {
        set({ error });
    },

    resetRecipes: async () => {
        console.log("[useRecipeStore] resetRecipes called");
        set({ searchQuery: "", currentPage: 1, activeCategory: "All" });
        await get().fetchRecipes(1);
    },

    setCategory: (category: string) => {
        console.log("[useRecipeStore] setCategory called with category:", category);
        set({ activeCategory: category, currentPage: 1 });
        const { searchQuery, fetchRecipes, searchRecipes } = get();
        if (searchQuery) {
            searchRecipes(searchQuery, 1);
        } else {
            fetchRecipes(1);
        }
    },
}));