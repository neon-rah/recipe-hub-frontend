"use client";

import { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import RecipeDetailCard from "@/components/features/RecipeDetailCard";

interface RecipeDetailSidebarProps {
    recipe: Recipe;
    onClose: () => void;
}

export default function RecipeDetailSidebar({ recipe, onClose }: RecipeDetailSidebarProps) {
    return (
        <div className="fixed  z-40 right-0 w-full sm:w-[400px] md:w-[450px] lg:w-[500px]
                       bg-white dark:bg-gray-900 shadow-xl flex flex-col
                       top-0 h-full md:top-[60px] md:h-[calc(100vh-60px)]">

            {/* Bouton Fermer (reste visible en haut) */}
            <div className="flex justify-between items-center p-4 sticky top-0 bg-white dark:bg-gray-900 shadow-md z-10">
                <h2 className="text-lg font-semibold">Détails de la Recette</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-6 h-6"/>
                </Button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 pb-28">
                <RecipeDetailCard recipe={recipe} />
            </div>
        </div>
    );
}
