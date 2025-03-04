// /app/contexts/selected-recipe-context.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { Recipe } from "@/types/recipe";

interface SelectedRecipeContextState {
    selectedRecipe: Recipe | null;
    setSelectedRecipe: (recipe: Recipe | null) => void;
    handleSelectRecipe: (recipe: Recipe | null) => void;
}

const SelectedRecipeContext = createContext<SelectedRecipeContextState | undefined>(undefined);

export function SelectedRecipeProvider({ children }: { children: React.ReactNode }) {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    
    const handleSelectRecipe = (selected:Recipe|null) =>{
        console.log("[RecipeContext] selectRecipe", selected);
        setSelectedRecipe(selected);
    };

    return (
        <SelectedRecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe,handleSelectRecipe }}>
            {children}
        </SelectedRecipeContext.Provider>
    );
}

export function useSelectedRecipe() {
    const context = useContext(SelectedRecipeContext);
    if (!context) {
        throw new Error("useSelectedRecipe must be used within a SelectedRecipeProvider");
    }
    return context;
}