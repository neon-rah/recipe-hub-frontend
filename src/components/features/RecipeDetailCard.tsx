// /app/components/features/recipe-detail-card.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, Heart, UserCircle, Bookmark } from "lucide-react";
import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { timeSince } from "@/lib/utils";
import { useLike } from "@/hooks/useLike";
import { useSavedRecipe } from "@/hooks/useSavedRecipe";
import { useRecipeActions } from "@/hooks/useRecipeActions";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import useAuth from "@/hooks/useAuth";

interface RecipeDetailCardProps {
    recipe: Recipe;
}

export default function RecipeDetailCard({ recipe }: RecipeDetailCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { user } = useAuth();
    const { liked, likeCount, loading: likeLoading, error: likeError, setError: setLikeError, handleToggleLike } = useLike(recipe.id);
    const { saved, loading: savedLoading, error: savedError, setError: setSavedError, handleToggleSaved } = useSavedRecipe(recipe.id);
    const { handleUpdate, handleDelete } = useRecipeActions(recipe.id);

    const shortDescription = recipe.description.slice(0, 70) + (recipe.description.length > 100 ? "..." : "");
    const isOwner = user?.idUser === recipe.userId;

    const handleConfirmDelete = async () => {
        await handleDelete();
        setShowDeleteConfirm(false);
    };

    return (
        <Card className="p-4 bg-white m-0  max-w-[700px] dark:bg-gray-900 dark:text-white rounded-lg shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {recipe.owner?.profileUrl ? (
                        <img src={recipe.owner?.profileUrl} alt={recipe.owner?.userName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <UserCircle className="w-10 h-10 text-gray-500" />
                    )}
                    <div>
                        <Link href={`/profile/${recipe.userId}`} className="font-semibold hover:underline">
                            {recipe.owner?.userName}
                        </Link>
                        <p className="text-xs text-gray-500">{timeSince(recipe.updatedDate)}</p>
                    </div>
                </div>

                {isOwner ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-lg shadow-md">
                            <button onClick={handleUpdate} className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                Update
                            </button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                Delete
                            </button>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Button variant="ghost" size="icon" onClick={handleToggleSaved} disabled={savedLoading}>
                        <Bookmark className={`w-6 h-6 ${saved ? "text-blue-500 fill-blue-500" : "text-gray-500"}`} />
                    </Button>
                )}
            </div>

            <h2 className="text-lg font-semibold mt-2">{recipe.title}</h2>
            <p className="text-sm mt-2">{expanded ? recipe.description : shortDescription}</p>

            {expanded && (
                <>
                    <h3 className="mt-3 font-semibold">Ingredients :</h3>
                    <ul className="list-disc pl-5">
                        {recipe.ingredientsList.map((ingredient, index) => (
                            <li key={index} className="text-sm">{ingredient}</li>
                        ))}
                    </ul>

                    <h3 className="mt-3 font-semibold">Preparation :</h3>
                    <ol className="list-decimal pl-5">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="text-sm">{step}</li>
                        ))}
                    </ol>
                </>
            )}

            <button onClick={() => setExpanded(!expanded)} className="text-blue-500 hover:underline mt-2 text-sm">
                {!expanded ? "Read more" : "Read less"}
            </button>

            <img src={recipe.image} alt={recipe.title} className="w-full h-[250px] object-cover rounded-lg mt-3" />

            <div className="mt-3 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleToggleLike} disabled={likeLoading}>
                    <Heart className={`w-6 h-6 ${liked ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
                </Button>
                <span className="text-sm">{likeCount} Likes</span>
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

            {showDeleteConfirm && (
                <AlertDialog open={showDeleteConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this recipe? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Card>
    );
}