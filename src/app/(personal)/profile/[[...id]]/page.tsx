"use client";

import ProfileCard from "@/components/features/ProfileCard";
import FriendCard from "@/components/features/FriendCard";
import RecipeDetailCard from "@/components/features/RecipeDetailCard";
import { Recipe } from "@/types/labo/recipe";
import { Button } from "@/components/ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useEffect } from "react";
// import {useRouter} from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import useAuth from "@/hooks/useAuth";
import {User} from "@/types/user";

// 🔹 Simulation des amis (à remplacer par une requête API plus tard)
const friends = Array.from({ length: 30 }, (_, index) => ({
    name: `Ami ${index + 1}`,
    mutualFriends: Math.floor(Math.random() * 50),
    avatar: "/assets/profile.jpg",
}));

// 🔹 Simulation des recettes (à remplacer par une requête API plus tard)
const recipes: Recipe[] = [
    {
        id: 1,
        title: "Ravitoto sy Henakisoa",
        author: "Haingonirina Raharisoa",
        avatar: "/assets/profile.jpg",
        date: "12 Février 2024",
        description: "Un plat traditionnel malagasy à base de feuilles de manioc pilées...",
        ingredients: ["Feuilles de manioc", "Viande de porc", "Ail", "Sel"],
        steps: ["Écraser les feuilles", "Cuire la viande", "Mélanger avec le ravitoto"],
        image: "/assets/ravitoto.jpg",
        likes: 120,
    },
    {
        id: 2,
        title: "Mofo Gasy",
        author: "Haingonirina Raharisoa",
        avatar: "/assets/profile.jpg",
        date: "8 Février 2024",
        description: "Délicieux beignets de riz fermenté, parfaits pour le petit-déjeuner...",
        ingredients: ["Riz", "Sucre", "Levure", "Eau"],
        steps: ["Faire fermenter le riz", "Préparer la pâte", "Faire frire"],
        image: "/assets/mofo-gasy.jpg",
        likes: 95,
    },
];
// Typage des props pour une route catch-all optionnelle
type ProfilePageProps = {
    params: {
        id?: string[]; // id est optionnel et sera un tableau (catch-all)
    };
};

export default function ProfilePage({ params }: ProfilePageProps) {
    const [visibleFriends, setVisibleFriends] = useState(6);
    const [isSingleColumn, setIsSingleColumn] = useState(false);
    const { user } = useAuth();

    // Extraire l'id du tableau params.id (undefined si absent)
    const id = params.id?.[0]; // params.id est un tableau ou undefined
    const userProfile = id ? null : user;
    

    // Gestion du responsive pour savoir s'il faut un scroll global ou indépendant
    useEffect(() => {
        const handleResize = () => {
            setIsSingleColumn(window.innerWidth < 768); // Moins de 768px = une seule colonne
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <ProtectedRoute>
            <div
                className={`flex flex-wrap gap-6 w-full m-0 bg-white md:px-7 lg:px-5 scrollbar-none ${
                    isSingleColumn ? "h-[calc(100vh-60px)] overflow-y-auto " : ""
                }`}
            >
                {/* 🔹 Section gauche (Profil + Amis) */}
                <aside
                    className={` m-0 py-6 flex flex-col md:w-1/2 lg:w-1/3 space-y-4 pb-28 scrollbar-none ${
                        isSingleColumn ? "w-full pb-10 px-5 pb-10 " : "h-[calc(100vh-60px)] overflow-y-auto sticky "
                    }`}
                >
                    {/* 🔹 Carte de profil */}
                    <ProfileCard user={userProfile}/>

                    {/* Liste d'amis */}
                    <div className=" dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col">
                        <h3 className="text-lg font-semibold mb-3">Follower</h3>

                        {/* Affichage dynamique des amis */}
                        <div className="space-y-3">
                            {friends.slice(0, visibleFriends).map((friend, index) => (
                                <FriendCard key={index} {...friend} />
                            ))}
                        </div>

                        {/* Boutons "Voir plus" et "Voir moins" */}
                        <div className="flex justify-center gap-3 mt-3">
                            {visibleFriends < friends.length && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => setVisibleFriends(visibleFriends + 6)}
                                >
                                    <FaChevronDown/>
                                </Button>
                            )}
                            {visibleFriends > 6 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => setVisibleFriends(6)}
                                >
                                    <FaChevronUp/>
                                </Button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* 🔹 Section droite (Recettes) */}
                <main
                    className={`flex-1 md:w-1/2 py-6 lg:w-2/3 space-y-6 pb-28 scrollbar-none ${
                        isSingleColumn ? "px-5 pb-18" : "h-[calc(100vh-60px)] overflow-y-auto"
                    }`}
                >
                    <h2 className="text-2xl font-bold">Mes Recettes</h2>

                    {/* Liste des recettes */}
                    {/*{recipes.map((recipe) => (*/}
                    {/*    <RecipeDetailCard key={recipe.id} recipe={recipe}/>*/}
                    {/*))}*/}
                </main>
            </div>
        </ProtectedRoute>

    );
}
