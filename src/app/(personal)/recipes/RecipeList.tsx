"use client";

import { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/features/RecipeCard";
import { Pagination } from "@/components/ui/my-pagination";
import { useRecipeStore } from "@/stores/recipeStore"; // Remplacement de useRecipes
import { useRecipeSyncStore } from "@/stores/recipeSyncStore"; // Remplacement de useRecipeSync
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react"; // Ajout de useEffect
import { isLikedByUser, getLikeCountByRecipe } from "@/lib/api/likeApi";
import { isRecipeSaved } from "@/lib/api/savedRecipeApi";

interface RecipeListProps {
    onSelectRecipe: (recipe: Recipe) => void;
    recipesOverride?: Recipe[]; // Optionnel pour SavedRecipesPage
    loadingOverride?: boolean;
    errorOverride?: string | null;
}

export default function RecipeList({ onSelectRecipe, recipesOverride, loadingOverride, errorOverride }: RecipeListProps) {
    const { recipes: storeRecipes, currentPage, totalPages, loading: storeLoading, error: storeError, setError, setPage } = useRecipeStore();
    const { setInitialStates } = useRecipeSyncStore();
    const [initialized, setInitialized] = useState(false);

    const recipes = recipesOverride || storeRecipes;
    const loading = loadingOverride !== undefined ? loadingOverride : storeLoading;
    const error = errorOverride !== undefined ? errorOverride : storeError;

    const initializeStates = async () => {
        if (!loading && recipes.length > 0 && !initialized) {
            try {
                const recipeIds = recipes.map((r) => r.id);
                const [likedStates, likeCounts, savedStates] = await Promise.all([
                    Promise.all(recipeIds.map((id) => isLikedByUser(id))),
                    Promise.all(recipeIds.map((id) => getLikeCountByRecipe(id))),
                    Promise.all(recipeIds.map((id) => isRecipeSaved(id))),
                ]);

                const newLikedStates = recipeIds.reduce((acc, id, index) => {
                    acc[id] = likedStates[index];
                    return acc;
                }, {} as Record<number, boolean>);

                const newLikeCounts = recipeIds.reduce((acc, id, index) => {
                    acc[id] = likeCounts[index];
                    return acc;
                }, {} as Record<number, number>);

                const newSavedStates = recipeIds.reduce((acc, id, index) => {
                    acc[id] = savedStates[index];
                    return acc;
                }, {} as Record<number, boolean>);

                setInitialStates(newLikedStates, newSavedStates, newLikeCounts);
                setInitialized(true);
                console.log("[RecipeList] States initialized:", { newLikedStates, newLikeCounts, newSavedStates });
            } catch (err: any) {
                setError(err.message || "Failed to load recipe interactions");
                console.error("[RecipeList] Error initializing states:", err);
            }
        }
    };

    // Utiliser useEffect pour initialiser les états quand les recettes changent
    useEffect(() => {
        initializeStates();
    }, [loading, recipes, initialized]);

    console.log("[RecipeList] Rendered with recipes:", recipes.length);
    console.log("[RecipeList] Rendered with recipes list:", recipes);

    if (loading) {
        return <div className="p-4 text-center">Loading recipes...</div>;
    }

    if (recipes.length === 0 && !error) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No recipes found from other users yet.
            </div>
        );
    }

    return (
        <div className="p-4 w-full h-full flex flex-col pb-24">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onSelectRecipe(recipe)} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={(page) => {
                            console.log("[RecipeList] Page changed to:", page);
                            setPage(page);
                        }}
                    />
                </div>
            )}

            {error && (
                <AlertDialog open={!!error}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Error</AlertDialogTitle>
                            <AlertDialogDescription>{error}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setError(null)}>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}