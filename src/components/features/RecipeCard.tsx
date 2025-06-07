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
import {Button} from "@/components/ui/button";

interface RecipeCardProps {
    recipe: Recipe;
    className?: string;
    onClick?: () => void;
}

export default function RecipeCard({ recipe, onClick, className = "" }: RecipeCardProps) {
    const { liked, likeCount, loading: likeLoading, error: likeError, setError: setLikeError, handleToggleLike } = useLike(recipe.id);
    const { saved, loading: savedLoading, error: savedError, setError: setSavedError, handleToggleSaved } = useSavedRecipe(recipe.id);

    return (
        <Card className={`flex flex-col cursor-pointer m-0 p-0 bg-background-secondary rounded-lg overflow-hidden border-none shadow-soft bg-white dark:bg-primary-20 ${className}`} onClick={onClick}>
            <div className="relative h-[250px]">
                <Image
                    src={recipe.image || "/placeholder.jpg"}
                    alt={recipe.title}
                    fill
                    className="dark:opacity-90 w-full h-full object-cover"
                />
                <button
                    className="absolute top-3 right-3 bg-gray-800/70 dark:bg-gray-200/70  p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 transition"
                    onClick={(e) => { e.stopPropagation(); handleToggleSaved(); }}
                    disabled={savedLoading}
                >
                    <Bookmark className={`w-5 h-5 ${saved ? "fill-blue-500 text-blue-500" : ""}`} />
                </button>
            </div>

            <div className={" flex flex-1 flex-col"}>
                <div className="px-6 py-4 flex flex-1 flex-col">
                    <div className={"self-start"}>
                        <h2 className="text-lg place-self-start font-semibold text-gray-900 dark:text-white hover:text-indigo-600 transition duration-300">
                            {recipe.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {recipe.description.length > 100 ? `${recipe.description.substring(0, 100)}...` : recipe.description}
                        </p>
                    </div>

                </div>
                <div
                    className="px-4 py-1 b-0 m-0 p-0 flex items-center justify-between bg-gray-100 dark:bg-primary-40 text-gray-700 dark:text-gray-300 text-sm">
                    <button
                        className="flex shadow-none hover:bg-transparent border-none hover:border-none ring-none items-center gap-1 transition text-text bg-transparent dark:bg-transparent dark:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLike();
                        }}
                        disabled={likeLoading}
                    >
                        {liked ? <FaHeart className="w-5 h-5 text-red-500"/> : <FaRegHeart className="w-5 h-5"/>}
                        <span>{likeCount}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4"/>
                        <span>{timeSince(recipe.updatedDate)}</span>
                    </div>
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
                            <AlertDialogCancel onClick={() => {
                                setLikeError(null);
                                setSavedError(null);
                            }}>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Card>
    );
}