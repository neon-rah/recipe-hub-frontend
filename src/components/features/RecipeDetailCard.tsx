"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, Heart, UserCircle, Bookmark, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
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
import CommentSection from "@/components/features/CommentSection";
import { useComments } from "@/hooks/useComment";

interface RecipeDetailCardProps {
    recipe: Recipe;
    expand?: boolean;
}

export default function RecipeDetailCard({ recipe, expand = false }: RecipeDetailCardProps) {
    const [expanded, setExpanded] = useState(expand);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const { user } = useAuth();
    const { liked, likeCount, loading: likeLoading, error: likeError, setError: setLikeError, handleToggleLike } = useLike(recipe.id);
    const { saved, loading: savedLoading, error: savedError, setError: setSavedError, handleToggleSaved } = useSavedRecipe(recipe.id);
    const { handleUpdate, handleDelete } = useRecipeActions(recipe.id);
    const { commentCount } = useComments(recipe.id);

    const shortDescription = recipe.description.slice(0, 170) + (recipe.description.length > 170 ? "..." : "");
    const isOwner = user?.idUser === recipe.userId;

    // Reset comment section when recipe changes
    useEffect(() => {
        setShowComments(false);
    }, [recipe.id]);

    const handleConfirmDelete = async () => {
        try {
            await handleDelete();
            setShowDeleteConfirm(false);
        } catch (err) {
            setLikeError(err instanceof Error ? err.message : "Échec de la suppression de la recette");
        }
    };

    const handleCommentClick = () => {
        setShowComments(prev => !prev);
    };

    return (
        <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {recipe.owner?.profileUrl ? (
                        <img src={recipe.owner?.profileUrl} alt={recipe.owner?.userName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <UserCircle className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                    )}
                    <div>
                        <Link href={`/profile/${recipe.userId}`} className="text-gray-900 dark:text-gray-100 font-semibold hover:underline">
                            {recipe.owner?.userName}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{timeSince(recipe.updatedDate)}</p>
                    </div>
                </div>

                {isOwner ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                            <button onClick={handleUpdate} className="block text-gray-900 dark:text-gray-100 w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                Modifier
                            </button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="block text-red-600 w-full text-left px-2 py-1 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                                Supprimer
                            </button>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Button variant="ghost" size="icon" onClick={handleToggleSaved} disabled={savedLoading}>
                        <Bookmark className={`w-6 h-6 ${saved ? "text-blue-600 fill-blue-600" : "text-gray-500 dark:text-gray-400"}`} />
                    </Button>
                )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{recipe.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{expanded ? recipe.description : shortDescription}</p>

            {expanded && (
                <>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Ingrédients :</h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300">
                        {recipe.ingredientsList.map((ingredient, index) => (
                            <li key={index} className="text-sm">{ingredient}</li>
                        ))}
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Préparation :</h3>
                    <ol className="list-decimal pl-5 mb-4 text-gray-700 dark:text-gray-300">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="text-sm">{step}</li>
                        ))}
                    </ol>
                </>
            )}

            <button onClick={() => setExpanded(!expanded)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                {expanded ? "Voir moins" : "Voir plus"}
            </button>

            <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mt-3" />

            <div className="flex items-center gap-20 mt-3 text-gray-600 dark:text-gray-400">
                <Button variant="ghost" size="icon" onClick={handleToggleLike} disabled={likeLoading}>
                    <Heart className={`w-6 h-6 ${liked ? "text-red-500 fill-red-500" : ""}`} />
                    <span>{likeCount}</span>
                </Button>

                <Button variant="ghost" size="icon" onClick={handleCommentClick}>
                    <MessageCircle className="w-6 h-6" />
                    <span className="ml-1">{commentCount} Commentaires</span>
                </Button>
            </div>

            {showComments && (
                <div id={`comments-${recipe.id}`}>
                    <CommentSection recipeId={recipe.id} />
                </div>
            )}

            {(likeError || savedError) && (
                <AlertDialog open={!!(likeError || savedError)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Erreur</AlertDialogTitle>
                            <AlertDialogDescription>{likeError || savedError}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { setLikeError(null); setSavedError(null); }}>Fermer</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {showDeleteConfirm && (
                <AlertDialog open={showDeleteConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Card>
    );
}
