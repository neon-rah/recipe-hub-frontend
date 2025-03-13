"use client";

import { useState, useEffect } from "react";
import { SubHeader } from "@/components/ui/subheader";
import { FaBookmark } from "react-icons/fa";
import RecipeList from "@/app/(personal)/recipes/RecipeList";
import RecipeDetailSidebar from "@/app/(personal)/recipes/RecipeDetailSidebar";
import { useSavedRecipeStore } from "@/stores/savedRecipeStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useRecipeSyncStore } from "@/stores/recipeSyncStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/stores/recipeStore";
import { Pagination } from "@/components/ui/my-pagination";
import { Recipe } from "@/types/recipe";

function SavedRecipesPageContent() {
    const [selectedRecipeLocal, setSelectedRecipeLocal] = useState<Recipe | null>(null);
    const { savedRecipes, currentPage, totalPages, loading, error, activeCategory, fetchSavedRecipes, setCategory, setPage } = useSavedRecipeStore();
    const { selectedRecipe, setSelectedRecipe } = useRecipeStore();

    useEffect(() => {
        fetchSavedRecipes(currentPage, activeCategory);
    }, [currentPage, activeCategory, fetchSavedRecipes]);

    useEffect(() => {
        const unsubscribe = useRecipeSyncStore.subscribe((state) => {
            console.log("[SavedRecipesPage] savedStates changed, refreshing...");
            fetchSavedRecipes(currentPage, activeCategory);
        });
        return () => unsubscribe();
    }, [currentPage, activeCategory, fetchSavedRecipes]);

    const displayedRecipe = selectedRecipe || selectedRecipeLocal;

    return (
        <>
            <SubHeader
                icon={<FaBookmark size={20} />}
                name="Saved Recipes"
                sticky={true}
            />
            <div className="px-4 py-2 flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 gap-2">
                <Badge
                    variant={activeCategory === "All" ? "default" : "outline"}
                    className={cn(
                        "rounded-full cursor-pointer px-4 py-1 whitespace-nowrap",
                        activeCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                    )}
                    onClick={() => setCategory("All")}
                >
                    All
                </Badge>
                {CATEGORIES.map((category) => (
                    <Badge
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        className={cn(
                            "rounded-full cursor-pointer px-4 py-1 whitespace-nowrap",
                            activeCategory === category ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                        )}
                        onClick={() => setCategory(category)}
                    >
                        {category}
                    </Badge>
                ))}
            </div>
            <div className="flex flex-1 justify-center gap-4 overflow-hidden scrollbar-none">
                <section className="flex-1 bg-white overflow-auto scrollbar-none shadow-sm rounded-lg dark:bg-gray-900">
                    <RecipeList onSelectRecipe={setSelectedRecipeLocal} recipesOverride={savedRecipes} loadingOverride={loading} errorOverride={error} />
                </section>
                <aside className="overflow-auto">
                    {displayedRecipe && (
                        <RecipeDetailSidebar
                            recipe={displayedRecipe}
                            onClose={() => {
                                setSelectedRecipeLocal(null);
                                setSelectedRecipe(null);
                            }}
                        />
                    )}
                </aside>
            </div>
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            )}
        </>
    );
}

export default function SavedRecipesPage() {
    return <SavedRecipesPageContent />;
}