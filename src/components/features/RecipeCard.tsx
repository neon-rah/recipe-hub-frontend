"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Bookmark, Clock, MessageSquare } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Recipe } from "@/types/recipe";
import { timeSince } from "@/lib/utils";
import { useLike } from "@/hooks/useLike";
import { useSavedRecipe } from "@/hooks/useSavedRecipe";
import { useComments } from "@/hooks/useComment";
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
    const { commentCount } = useComments(recipe.id);

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
                    className="absolute top-3 right-3 bg-gray-800/70 dark:bg-gray-200/70 p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 transition"
                    onClick={(e) => { e.stopPropagation(); handleToggleSaved(); }}
                    disabled={savedLoading}
                >
                    <Bookmark className={`w-5 h-5 ${saved ? "fill-secondary text-secondary" : "text-neutral"}`} />
                </button>
            </div>

            <div className="flex flex-1 flex-col">
                <div className="px-6 py-4 flex flex-1 flex-col">
                    <div className="self-start">
                        <h2 className="text-lg font-semibold text-text dark:text-dark hover:text-secondary transition duration-300">
                            {recipe.title}
                        </h2>
                        <p className="text-sm text-neutral-60 dark:text-neutral-60">
                            {recipe.description.length > 100 ? `${recipe.description.substring(0, 100)}...` : recipe.description}
                        </p>
                    </div>
                </div>
                <div className="px-4 py-1 flex items-center justify-between bg-gray-100 dark:bg-primary-40 text-neutral-60 dark:text-neutral-60 text-sm">
                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center gap-1 transition text-text bg-transparent dark:bg-transparent dark:text-dark"
                            onClick={(e) => { e.stopPropagation(); handleToggleLike(); }}
                            disabled={likeLoading}
                        >
                            {liked ? <FaHeart className="w-5 h-5 text-alert" /> : <FaRegHeart className="w-5 h-5 text-neutral" />}
                            <span>{likeCount}</span>
                        </button>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="w-5 h-5 text-neutral" />
                            <span>{commentCount}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral" />
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
                            <AlertDialogCancel onClick={() => { setLikeError(null); setSavedError(null); }}>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Card>
    );
}