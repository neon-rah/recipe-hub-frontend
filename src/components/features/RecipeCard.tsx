// /app/components/features/recipe-card.tsx
"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Bookmark, Clock } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Recipe } from "@/types/recipe";
import { timeSince } from "@/lib/utils";
import { useLike } from "@/hooks/useLike";
import { useSavedRecipe } from "@/hooks/useSavedRecipe";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface RecipeCardProps {
    recipe: Recipe;
    className?: string;
    onClick?: () => void;
}

export default function RecipeCard({ recipe, onClick, className = "" }: RecipeCardProps) {
    const { liked, likeCount, loading: likeLoading, error: likeError, setError: setLikeError, handleToggleLike } = useLike(recipe.id);
    const { saved, loading: savedLoading, error: savedError, setError: setSavedError, handleToggleSaved } = useSavedRecipe(recipe.id);

    return (
        <Card className={`cursor-pointer rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-900 ${className}`} onClick={onClick}>
            <div className="relative h-[200px] bg-gray-200 dark:bg-gray-800">
                <Image
                    src={recipe.image || "/placeholder.jpg"}
                    alt={recipe.title}
                    fill
                    className="dark:opacity-90 object-cover w-full h-full"
                />
                <button
                    className="absolute top-3 right-3 bg-gray-800/70 dark:bg-gray-200/70 text-white dark:text-gray-900 p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 transition"
                    onClick={(e) => { e.stopPropagation(); handleToggleSaved(); }}
                    disabled={savedLoading}
                >
                    <Bookmark className={`w-5 h-5 ${saved ? "fill-blue-500 text-blue-500" : ""}`} />
                </button>
            </div>

            <div className="px-6 py-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 transition duration-300">
                    {recipe.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {recipe.description.length > 100 ? `${recipe.description.substring(0, 100)}...` : recipe.description}
                </p>
            </div>

            <div className="px-6 py-3 flex items-center justify-between bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
                <button
                    className="flex items-center gap-1 transition bg-transparent dark:bg-transparent"
                    onClick={(e) => { e.stopPropagation(); handleToggleLike(); }}
                    disabled={likeLoading}
                >
                    {liked ? <FaHeart className="w-5 h-5 text-red-500" /> : <FaRegHeart className="w-5 h-5" />}
                    <span>{likeCount}</span>
                </button>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{timeSince(recipe.updatedDate)}</span>
                </div>
            </div>

            {(likeError || savedError) && (
                <AlertDialog open={!!(likeError || savedError)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Error</AlertDialogTitle>
                            <AlertDialogDescription>{likeError || savedError}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { setLikeError(null); setSavedError(null); }}>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Card>
    );
}