// /app/store/recipe-store.ts
import { create } from "zustand";
import { Recipe } from "@/types/recipe";

interface RecipeState {
    selectedRecipe: Recipe | null;
    setSelectedRecipe: (recipe: Recipe | null) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
    selectedRecipe: null,
    setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),
}));