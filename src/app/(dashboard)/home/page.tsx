// /app/(personal)/home/page.tsx
"use client";

import { SubHeader } from "@/components/ui/subheader";
import RecipeCard from "@/components/features/RecipeCard";
import { FaHome } from "react-icons/fa";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { RecipeSyncProvider } from "@/context/recipe-sync-context";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getPublicRecipes } from "@/lib/api/recipeApi";
import { Recipe } from "@/types/recipe";
import { useRecipeStore } from "@/store/recipe-store";

export default function HomePage() {
    const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setSelectedRecipe } = useRecipeStore();

    useEffect(() => {
        const fetchRecentRecipes = async () => {
            try {
                setLoading(true);
                const data = await getPublicRecipes(0, 18); // Page 0, 18 recettes
                setRecentRecipes(data.content.map((dto: any) => new Recipe(dto)));
            } catch (err: any) {
                setError(err.message || "Failed to load recent recipes");
            } finally {
                setLoading(false);
            }
        };
        fetchRecentRecipes();
    }, []);

    const handleCardClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        router.push("/recipes");
    };

    if (loading) {
        return <div className="p-4 text-center">Loading recipes...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <ProtectedRoute>
            <RecipeSyncProvider>
                <div className="flex flex-col gap-4 p-6">
                    <SubHeader name={"Home"} icon={<FaHome size={20} />} sticky={true} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onClick={() => handleCardClick(recipe)}
                            />
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <Link href="/recipes" className="text-blue-500 hover:underline font-semibold">
                            Find More Recipe here
                        </Link>
                    </div>
                </div>
            </RecipeSyncProvider>
        </ProtectedRoute>
    );
}