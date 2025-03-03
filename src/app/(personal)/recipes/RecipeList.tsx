// /app/components/features/recipe-list.tsx
"use client";

import { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/features/RecipeCard";
import { Pagination } from "@/components/ui/my-pagination";
import { useRecipeList } from "@/hooks/useRecipeList";
import { useRecipeSync } from "@/context/recipe-sync-context";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { isLikedByUser, getLikeCountByRecipe } from "@/lib/api/likeApi";
import { isRecipeSaved } from "@/lib/api/savedRecipeApi";

interface RecipeListProps {
    onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipeList({ onSelectRecipe }: RecipeListProps) {
    const { recipes, currentPage, totalPages, loading, error, setError, setCurrentPage } = useRecipeList(12);
    const { setInitialStates } = useRecipeSync();
    const [initialized, setInitialized] = useState(false); // Contrôle l’initialisation

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
                setInitialized(true); // Marque comme initialisé pour éviter les réappels
            } catch (err: any) {
                setError(err.message || "Failed to load recipe interactions");
            }
        }
    };

    // Appeler initializeStates uniquement au premier chargement ou changement de page
    if (!initialized && !loading && recipes.length > 0) {
        initializeStates();
    }

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
                            setCurrentPage(page);
                            setInitialized(false); // Réinitialiser pour charger les nouveaux états
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