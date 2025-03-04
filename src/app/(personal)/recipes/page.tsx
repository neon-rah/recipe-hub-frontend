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
import { RecipeProvider, useRecipes, CATEGORIES } from "@/context/recipe-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRecipeStore } from "@/store/recipe-store";

function RecipesPageContent() {
    const [selectedRecipeLocal, setSelectedRecipeLocal] = useState<Recipe | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const { searchRecipes, resetRecipes, activeCategory, setCategory } = useRecipes();
    const { selectedRecipe, setSelectedRecipe } = useRecipeStore();

    const handleSearch = (query: string) => {
        console.log("[RecipesPageContent] handleSearch called with query:", query);
        setSearchQuery(query);
        searchRecipes(query);
    };

    const handleCancelSearch = () => {
        console.log("[RecipesPageContent] handleCancelSearch called");
        setSearchQuery("");
        resetRecipes();
    };

    const displayedRecipe = selectedRecipe || selectedRecipeLocal;

    console.log("[RecipesPageContent] Rendered with searchQuery:", searchQuery, "activeCategory:", activeCategory);

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
                    <RecipeList onSelectRecipe={setSelectedRecipeLocal} />
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