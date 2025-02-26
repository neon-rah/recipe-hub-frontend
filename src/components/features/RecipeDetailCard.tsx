"use client";

import { Recipe } from "@/types/labo/recipe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, Heart, UserCircle } from "lucide-react";
import { useState } from "react";

interface RecipeDetailCardProps {
    recipe: Recipe;
}

export default function RecipeDetailCard({ recipe }: RecipeDetailCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(recipe.likes);

    const shortDescription = recipe.description.slice(0, 70) + (recipe.description.length > 100 ? "..." : "");

    const toggleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    return (
        <Card className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-md">
            {/* Infos de l'auteur */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {recipe.avatar ? (
                        <img src={recipe.avatar} alt={recipe.author} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <UserCircle className="w-10 h-10 text-gray-500" />
                    )}
                    <div>
                        <p className="font-semibold">{recipe.author}</p>
                        <p className="text-xs text-gray-500">{recipe.date}</p>
                    </div>
                </div>

                {/* Options (Modifier/Supprimer) */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-lg shadow-md">
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Modifier</button>
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Supprimer</button>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Titre */}
            <h2 className="text-lg font-semibold mt-2">{recipe.title}</h2>

            {/* Description */}
            <p className="text-sm mt-2">{expanded ? recipe.description : shortDescription}</p>

            {/* Affichage des ingrédients et étapes si "expanded" */}
            {expanded && (
                <>
                    <h3 className="mt-3 font-semibold">Ingrédients :</h3>
                    <ul className="list-disc pl-5">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-sm">{ingredient}</li>
                        ))}
                    </ul>

                    <h3 className="mt-3 font-semibold">Préparation :</h3>
                    <ol className="list-decimal pl-5">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="text-sm">{step}</li>
                        ))}
                    </ol>
                </>
            )}

            {/* Bouton "Lire plus" / "Lire moins" */}
            <button onClick={() => setExpanded(!expanded)} className="text-blue-500 hover:underline mt-2 text-sm">
                {expanded ? "Lire moins" : "Lire plus"}
            </button>

            {/* Image de la recette */}
            <img src={recipe.image} alt={recipe.title} className="w-full h-[250px] object-cover rounded-lg mt-3" />

            {/* Bouton Like */}
            <div className="mt-3 flex items-center">
                <Button variant="ghost" size="icon" onClick={toggleLike}>
                    <Heart className={`w-6 h-6 ${liked ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
                </Button>
                <span className="text-sm">{likeCount} Likes</span>
            </div>
        </Card>
    );
}
