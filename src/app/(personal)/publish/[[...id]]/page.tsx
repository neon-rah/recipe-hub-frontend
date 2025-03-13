// /app/publish/page.tsx
"use client";

import { useRouter } from "next/navigation";
// import ProtectedRoute from "@/components/layout/ProtectedRoute";
import NewRecipe from "@/components/features/NewRecipe";
import {use} from "react";


// Typage des props pour une route catch-all optionnelle
type PublishPageProps = {
    searchParams: Promise<{ id?: string | string[] }>; // params est maintenant une Promise
};

export default function PublishPage({ searchParams }: PublishPageProps) {
    const router = useRouter();
    const resolvedSearchParams = use(searchParams);
    const id = resolvedSearchParams.id as string | undefined; // Forcer comme string ou undefined
    const recipeId = id ? Number(id) : undefined;
    
    console.log("recipeid", recipeId)
    console.log("idparams", id)

    const handlePostSubmit = () => {
        router.push("/profile");
    };

    return (
        // <ProtectedRoute>
            <div className="max-w-4xl mx-auto p-6 pb-20">
                <NewRecipe onSubmit={handlePostSubmit} initialId={recipeId} />
            </div>
        // </ProtectedRoute>
    );
}