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
        <div className="fixed z-40 right-0 w-full sm:w-[500px] md:w-[550px] lg:w-[700px]
                       bg-background dark:bg-background-dark-tertiary shadow-xl flex flex-col
                       top-0 h-full md:top-[60px] md:h-[calc(100vh-60px)]">

            
            <div className="flex bg-background dark:bg-background-dark  justify-between items-center p-4 sticky top-0 bg-white  shadow-md z-10">
                <h2 className="text-subtitle-2 font-semibold">Recipe details</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-6 h-6"/>
                </Button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 pb-28">
                <RecipeDetailCard recipe={recipe} expand={true} />
            </div>
        </div>
    );
}
