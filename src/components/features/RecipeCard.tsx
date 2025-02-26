"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import {Bookmark, Clock} from "lucide-react";
import { useState } from "react";
import { Recipe } from "@/types/labo/recipe";
import {FaHeart, FaRegHeart} from "react-icons/fa";

interface RecipeCardProps {
    recipe: Recipe;
    className?: string;
    onClick?: () => void;
}

export default function RecipeCard({ recipe, onClick, className = "" }: RecipeCardProps) {
    const [liked, setLiked] = useState(false);

    return (
        <Card className={`cursor-pointer rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-900 ${className}`} onClick={onClick}>
            {/* Image + Save Button */}
            <div className="relative h-[200px] bg-gray-200 dark:bg-gray-800">
                <Image
                    src={recipe.image || "/placeholder.jpg"}
                    alt={recipe.title}
                    fill
                    className="dark:opacity-90 object-cover w-full h-full"
                />
                <button className="absolute top-3 right-3 bg-gray-800/70 dark:bg-gray-200/70 text-white dark:text-gray-900 p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 transition">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 transition duration-300">
                    {recipe.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {recipe.description.length > 100 ? `${recipe.description.substring(0, 100)}...` : recipe.description}
                </p>
                {/*<Link href="#" className="text-blue-500 text-sm font-medium hover:underline">*/}
                {/*    Lire plus*/}
                {/*</Link>*/}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex items-center justify-between bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
                {/* Like Button */}
                <button
                    className="flex items-center gap-1 transition bg-transparent dark:bg-transparent"
                    onClick={() => setLiked(!liked)}
                >
                    {liked ? <FaHeart className="w-5 h-5 text-red-500" /> : <FaRegHeart className="w-5 h-5" />}
                    <span>{recipe.likes + (liked ? 1 : 0)}</span>
                </button>
                {/* Date */}
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.date}</span>
                </div>
            </div>
        </Card>
    );
}
