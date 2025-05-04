"use client";

import { SubHeader } from "@/components/ui/subheader";
import RecipeCard from "@/components/features/RecipeCard";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Ajout de useState
import Link from "next/link";
import { useRecipeStore } from "@/stores/recipeStore";
import { useRecipeSyncStore } from "@/stores/recipeSyncStore";
import { isLikedByUser, getLikeCountByRecipe } from "@/lib/api/likeApi";
import { isRecipeSaved } from "@/lib/api/savedRecipeApi";
import { Recipe } from "@/types/recipe";

export default function HomePage() {
    const router = useRouter();
    const { recipes, loading, error, fetchRecipes, setSelectedRecipe } = useRecipeStore();
    const { setInitialStates } = useRecipeSyncStore();
    const [isInitialized, setIsInitialized] = useState(false); // État pour contrôler l’initialisation

    // Charger les recettes au montage
    useEffect(() => {
        fetchRecipes(1); // Charger les recettes une seule fois
    }, [fetchRecipes]);

    // Initialiser les états de synchronisation quand les recettes sont chargées
    useEffect(() => {
        const initializeSyncStates = async () => {
            if (!loading && recipes.length > 0 && !isInitialized) {
                try {
                    const recipeIds = recipes.slice(0, 18).map((r) => r.id);
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
                    setIsInitialized(true); // Marquer comme initialisé
                    console.log("[HomePage] States initialized:", { newLikedStates, newLikeCounts, newSavedStates });
                } catch (err: any) {
                    console.error("[HomePage] Error initializing states:", err);
                }
            }
        };

        initializeSyncStates();
    }, [loading, recipes, setInitialStates, isInitialized]);

    const handleCardClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        router.push("/recipes");
    };

    if (loading) {
        return <div className="p-4 text-center">Loading recipes...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="bg-background flex flex-col gap-4 p-6 dark:bg-background-dark">
            <SubHeader name={"Home"} icon={<FaHome size={20} />} sticky={true} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recipes.slice(0, 18).map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => handleCardClick(recipe)}
                    />
                ))}
            </div>
            <div className="mt-6 text-center">
                <Link href="/recipes" className="text-blue-500 hover:underline font-semibold">
                    Find More Recipes here -{">"}
                </Link>
            </div>
        </div>
    );
}