// /app/publish/page.tsx
"use client";

import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import NewRecipe from "@/components/features/NewRecipe";
import {use} from "react";


// Typage des props pour une route catch-all optionnelle
type PublishPageProps = {
    params: Promise<{ id?: string[] }>; // params est maintenant une Promise
};

export default function PublishPage({ params }: PublishPageProps) {
    const router = useRouter();

    // Déballer params avec React.use()
    const resolvedParams = use(params);
    const id = resolvedParams.id?.[0]; // Accéder à id après déballage
    const recipeId = id ? Number(id) : undefined;

    const handlePostSubmit = () => {
        router.push("/profile");
    };

    return (
        <ProtectedRoute>
            <div className="max-w-4xl mx-auto p-6 pb-20">
                <NewRecipe onSubmit={handlePostSubmit} initialId={recipeId} />
            </div>
        </ProtectedRoute>
    );
}