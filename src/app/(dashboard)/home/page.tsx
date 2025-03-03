"use client";


import { SubHeader } from "@/components/ui/subheader";
import RecipeCard from "@/components/features/RecipeCard";
import {FaHome} from "react-icons/fa";
import {recipes} from "@/data/recipes";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import {RecipeSyncProvider} from "@/context/recipe-sync-context";

export default function HomePage() {


    return (
        <ProtectedRoute>
            <RecipeSyncProvider>
            <div className=" flex flex-col gap-4 p-6">
                <SubHeader name={"Home"} icon={<FaHome size={20}/>} sticky={true}/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/*{recipes.map((recipe) => (*/}
                    {/*    <RecipeCard key={recipe.id} recipe={null}/>*/}
                    {/*))}*/}
                </div>
            </div>
            </RecipeSyncProvider>
        </ProtectedRoute>
    );
}
