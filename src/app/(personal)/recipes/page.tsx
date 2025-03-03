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

function RecipesPageContent() {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    return (
        <>
            <SubHeader icon={<FaUtensils size={20} />} name={"Recipes"} sticky={true} rightContent={
                <ExpandableSearchBar/>
            }/>
            <div className="flex flex-1 justify-center gap-4 overflow-hidden scrollbar-none">
                <section className="flex-1 bg-white overflow-auto scrollbar-none shadow-sm rounded-lg dark:bg-gray-900">
                    <RecipeList onSelectRecipe={setSelectedRecipe} />
                </section>
                <aside className="overflow-auto">
                    {selectedRecipe && (
                        <RecipeDetailSidebar recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
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
                <RecipesPageContent />
            </RecipeSyncProvider>
        </ProtectedRoute>
    );
}