"use client";


import { useRouter } from "next/navigation";
import NewPost from "@/components/features/NewRecipe";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function PublishPage() {
    const router = useRouter();

    // Fonction pour gérer la soumission du formulaire
    const handlePostSubmit = async (postData: any) => {
        try {
            console.log("Données envoyées :", postData);

            // TODO: Envoyer les données au backend via une API
            // const response = await fetch("/api/recipes", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(postData),
            // });

            // if (!response.ok) throw new Error("Erreur lors de l'envoi des données");

            // Rediriger vers la page des recettes après la soumission
            router.push("/dashboard");
        } catch (error) {
            console.error("Erreur lors de la publication :", error);
        }
    };

    return (
        <ProtectedRoute>
            <div className="max-w-4xl mx-auto p-6">
                <NewPost onSubmit={handlePostSubmit}/>
            </div>

        </ProtectedRoute>
    );
}
