"use client";

import { create } from "zustand";
import { getSavedRecipesPaged } from "@/lib/api/savedRecipeApi";
import {Recipe, RecipeDTO} from "@/types/recipe";

interface SavedRecipeState {
    savedRecipes: Recipe[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    activeCategory: string;
    fetchSavedRecipes: (page: number, category?: string) => Promise<void>;
    setCategory: (category: string) => void;
    setPage: (page: number) => void;
}

export const useSavedRecipeStore = create<SavedRecipeState>((set) => ({
    savedRecipes: [],
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
    activeCategory: "All",
    fetchSavedRecipes: async (page: number, category?: string) => {
        set({ loading: true, error: null });
        try {
            const data = await getSavedRecipesPaged(page - 1, 12, category);
            set({
                savedRecipes: data.content.map((sr: RecipeDTO) => new Recipe(sr)),
                currentPage: page,
                totalPages: data.totalPages,
                loading: false,
            });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch saved recipes", loading: false });
        }
    },
    setCategory: (category: string) => set({ activeCategory: category, currentPage: 1 }),
    setPage: (page: number) => set({ currentPage: page }),
}));