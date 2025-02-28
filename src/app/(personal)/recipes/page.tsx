"use client";

import { useState } from "react";
import RecipeList from "./RecipeList";
import {Recipe} from "@/types/labo/recipe";
import {recipes} from "@/data/recipes";
import RecipeDetailSidebar from "@/app/(personal)/recipes/RecipeDetailSidebar";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function RecipesPage() {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    return (
        <ProtectedRoute>
            <div className="flex flex-1 justify-center gap-4 overflow-hidden scrollbar-none">
                {/* Liste des recettes */}
                <section
                    className={`flex-1 bg-white  overflow-auto scrollbar-none shadow-sm  rounded-lg dark:bg-gray-900`}>
                    <RecipeList recipes={recipes} onSelectRecipe={setSelectedRecipe}/>
                </section>

                <aside className={"overflow-auto"}>
                    {/* Sidebar des détails */}
                    {selectedRecipe &&
                        <RecipeDetailSidebar recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)}/>}
                </aside>


            </div>

        </ProtectedRoute>

    );
}
