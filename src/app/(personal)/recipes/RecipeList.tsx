"use client";

import { useState } from "react";

import { Recipe } from "@/types/labo/recipe";
import RecipeCard from "@/components/features/RecipeCard";
import {Pagination} from "@/components/ui/my-pagination";

interface RecipeListProps {
    recipes: Recipe[];
    onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipeList({ recipes, onSelectRecipe }: RecipeListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 12;
    const totalPages = Math.ceil(recipes.length / recipesPerPage);

    // Pagination : Extraire les recettes pour la page actuelle
    const startIndex = (currentPage - 1) * recipesPerPage;
    const selectedRecipes = recipes.slice(startIndex, startIndex + recipesPerPage);

    return (
        <div className="p-4 w-full h-full flex flex-col pb-24 ">
            {/* Grille des recettes */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onSelectRecipe(recipe)} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}

