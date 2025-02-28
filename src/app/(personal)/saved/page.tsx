"use client";


import { SubHeader } from "@/components/ui/subheader";

export default function SavedPage() {
    return (
        <div>
            <SubHeader name="Saved" icon="bi bi-bookmark" />
            <h1 className="text-2xl font-bold mt-4">Saved Recipes</h1>
            <p>Vos recettes sauvegardées.</p>
        </div>
    );
}
