// /app/(personal)/recipes/page.tsx
"use client";

import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { SubHeader } from "@/components/ui/subheader";
import { FaUtensils } from "react-icons/fa";
import { RecipeSyncProvider } from "@/context/recipe-sync-context";
import RecipeList from "@/app/(personal)/recipes/RecipeList";
import RecipeDetailSidebar from "@/app/(personal)/recipes/RecipeDetailSidebar";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import ExpandableSearchBar from "@/components/ui/expandable-search-bar";
import { RecipeProvider, useRecipes } from "@/context/recipe-context";

function RecipesPageContent() {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const { searchRecipes, resetRecipes } = useRecipes();

    const handleSearch = (query: string) => {
        console.log("[RecipesPageContent] handleSearch called with query:", query);
        setSearchQuery(query);
        searchRecipes(query); // Déclenche directement la recherche
    };

    const handleCancelSearch = () => {
        console.log("[RecipesPageContent] handleCancelSearch called");
        setSearchQuery("");
        resetRecipes(); // Restaure les recettes initiales
    };

    console.log("[RecipesPageContent] Rendered with searchQuery:", searchQuery);

    return (
        <>
            <SubHeader
                icon={<FaUtensils size={20} />}
                name={searchQuery ? `Search: "${searchQuery}"` : "Recipes"}
                sticky={true}
                rightContent={
                    <ExpandableSearchBar
                        placeholder="Search by title or ingredients..."
                        value={searchQuery}
                        setValue={setSearchQuery}
                        onSearch={handleSearch}
                        onCancel={handleCancelSearch}
                    />
                }
            />
            <div className="flex flex-1 justify-center gap-4 overflow-hidden scrollbar-none">
                <section className="flex-1 bg-white overflow-auto scrollbar-none shadow-sm rounded-lg dark:bg-gray-900">
                    <RecipeList onSelectRecipe={setSelectedRecipe} />
                </section>
                <aside className="overflow-auto">
                    {selectedRecipe && (
                        <RecipeDetailSidebar
                            recipe={selectedRecipe}
                            onClose={() => setSelectedRecipe(null)}
                        />
                    )}
                </aside>
            </div>
        </>
    );
}

export default function RecipesPage() {
    return (
        <ProtectedRoute>
            <RecipeSyncProvider>
                <RecipeProvider>
                    <RecipesPageContent />
                </RecipeProvider>
            </RecipeSyncProvider>
        </ProtectedRoute>
    );
}