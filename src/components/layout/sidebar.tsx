"use client";

import RecipeCard from "@/components/features/RecipeCard";
import FriendCard from "@/components/features/FriendCard";
import { useEffect, useState } from "react";
import { getRandomRecipe } from "@/lib/api/recipeApi";
import { getRandomSuggestedUsers } from "@/lib/api/followApi";
import { Recipe } from "@/types/recipe";
import { User } from "@/types/user";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { followUser } from "@/lib/api/followApi";

export default function SideBar() {
    const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe | null>(null);
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [visibleSuggestions, setVisibleSuggestions] = useState(6);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipeData = await getRandomRecipe();
                setRecipeOfTheDay(new Recipe(recipeData));
                if (user?.idUser) {
                    const usersData = await getRandomSuggestedUsers(user.idUser);
                    setSuggestedUsers(usersData);
                }
            } catch (err) {
                console.error("Error fetching sidebar data:", err);
            }
        };
        fetchData();
    }, [user]);

    const handleFollow = async (followedId: string) => {
        if (!user?.idUser) return;
        await followUser(user.idUser, followedId);
        setSuggestedUsers(suggestedUsers.filter((u) => u.idUser !== followedId));
    };

    const handleUnfollow = async () => {
        // Non utilisé ici car suggestions sont non suivies
    };

    return (
        <div className="flex bg-gray-50 p-5 shadow-xl shadow-gray-200 items-center flex-col gap-5">
            <div className="flex w-full flex-col gap-5">
                <h1 className="text-primary text-xl font-bold">Recipe of the Day</h1>
                {recipeOfTheDay && <RecipeCard recipe={recipeOfTheDay} />}
            </div>
            <div className="flex w-full flex-col gap-5">
                <h1 className="text-primary text-xl font-bold">Follow Someone</h1>
                <div className="space-y-3">
                    {suggestedUsers.slice(0, visibleSuggestions).map((suggestedUser) => (
                        <FriendCard
                            key={suggestedUser.idUser}
                            user={suggestedUser}
                            isFollowing={false}
                            onFollow={handleFollow}
                            onUnfollow={handleUnfollow}
                        />
                    ))}
                </div>
                <div className="flex justify-center gap-3 mt-3">
                    {visibleSuggestions < suggestedUsers.length && (
                        <Button variant="ghost" size="icon" onClick={() => setVisibleSuggestions(visibleSuggestions + 6)}>
                            <FaChevronDown />
                        </Button>
                    )}
                    {visibleSuggestions > 6 && (
                        <Button variant="ghost" size="icon" onClick={() => setVisibleSuggestions(6)}>
                            <FaChevronUp />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}