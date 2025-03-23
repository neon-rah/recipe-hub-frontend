// pages/profile/[id].tsx
"use client";

import ProfileCard from "@/components/features/ProfileCard";
import FriendCard from "@/components/features/FriendCard";
import RecipeDetailCard from "@/components/features/RecipeDetailCard";
import { Button } from "@/components/ui/button";
import { FaBookmark, FaChevronDown, FaChevronUp } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useProfileStore } from "@/stores/profileStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Recipe } from "@/types/recipe";
import { getUserById } from "@/lib/api/userApi";
import { User } from "@/types/user";
import { SubHeader } from "@/components/ui/subheader";

type ProfilePageProps = { params: Promise<{ id?: string[] }> };

export default function ProfilePage({ params }: ProfilePageProps) {
    const [visibleFollowers, setVisibleFollowers] = useState(6);
    const [visibleFollowing, setVisibleFollowing] = useState(6);
    const [isSingleColumn, setIsSingleColumn] = useState(false);
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const { user } = useAuth();
    const { recipes, followers, following, isFollowingProfile, loading, error, fetchProfileData, updateFollowStatus } = useProfileStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const recipeId = searchParams.get("recipeId");

    const resolvedParams = React.use(params);
    const profileIdFromParams = resolvedParams.id && resolvedParams.id.length > 0 ? resolvedParams.id[0] : undefined;
    const currentUserId = user?.idUser;
    const profileId = profileIdFromParams || currentUserId;
    const isOwnProfile = !profileIdFromParams || profileIdFromParams === currentUserId;

    useEffect(() => {
        if (profileId) {
            fetchProfileData(profileId, currentUserId).catch(() => router.push("/404"));
            if (!isOwnProfile) {
                getUserById(profileId)
                    .then((data) => setProfileUser(new User(data)))
                    .catch((error) => console.error("[ProfilePage] Erreur:", error));
            }
        } else {
            router.push("/404");
        }
    }, [profileId, currentUserId, fetchProfileData, router]);

    useEffect(() => {
        const handleResize = () => setIsSingleColumn(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFollow = async (followedId: string) => {
        if (!currentUserId) return;
        await updateFollowStatus(followedId, "follow", currentUserId);
    };

    const handleUnfollow = async (followedId: string) => {
        if (!currentUserId) return;
        await updateFollowStatus(followedId, "unfollow", currentUserId);
    };

    if (loading) return <div className="text-center py-10">Chargement...</div>;
    if (error) {
        router.push("/404");
        return null;
    }

    const sortedRecipes = recipeId
        ? [...recipes].sort((a, b) => (a.id === Number(recipeId) ? -1 : b.id === Number(recipeId) ? 1 : 0))
        : recipes;

    return (
        <div className={`flex flex-wrap gap-6 w-full m-0 bg-white md:px-7 lg:px-5 scrollbar-none ${isSingleColumn ? "h-[calc(100vh-60px)] overflow-y-auto" : ""}`}>
            <aside className={`m-0 py-6 flex flex-col md:w-1/2 lg:w-1/3 space-y-4 pb-28 scrollbar-none ${isSingleColumn ? "w-full pb-10 px-5" : "h-[calc(100vh-60px)] overflow-y-auto sticky"}`}>
                <ProfileCard user={isOwnProfile ? user : profileUser} currentUserId={currentUserId} isProfileOwner={isOwnProfile} isFollowing={isFollowingProfile} />
                <div className="dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col">
                    <h3 className="text-lg font-semibold mb-3">Followers ({followers.length})</h3>
                    <div className="space-y-3">
                        {followers.slice(0, visibleFollowers).map((follower) => (
                            <FriendCard key={follower.follower.idUser} user={follower.follower} isFollowing={following.some(f => f.followed.idUser === follower.follower.idUser)} onFollow={handleFollow} onUnfollow={handleUnfollow} currentUserId={currentUserId} />
                        ))}
                    </div>
                    <div className="flex justify-center gap-3 mt-3">
                        {visibleFollowers < followers.length && <Button variant="ghost" size="icon" onClick={() => setVisibleFollowers(visibleFollowers + 6)}><FaChevronDown /></Button>}
                        {visibleFollowers > 6 && <Button variant="ghost" size="icon" onClick={() => setVisibleFollowers(6)}><FaChevronUp /></Button>}
                    </div>
                </div>
                {isOwnProfile && (
                    <div className="dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col">
                        <h3 className="text-lg font-semibold mb-3">Following ({following.length})</h3>
                        <div className="space-y-3">
                            {following.slice(0, visibleFollowing).map((followed) => (
                                <FriendCard key={followed.followed.idUser} user={followed.followed} isFollowing={true} onFollow={handleFollow} onUnfollow={handleUnfollow} currentUserId={currentUserId} />
                            ))}
                        </div>
                        <div className="flex justify-center gap-3 mt-3">
                            {visibleFollowing < following.length && <Button variant="ghost" size="icon" onClick={() => setVisibleFollowing(visibleFollowing + 6)}><FaChevronDown /></Button>}
                            {visibleFollowing > 6 && <Button variant="ghost" size="icon" onClick={() => setVisibleFollowing(6)}><FaChevronUp /></Button>}
                        </div>
                    </div>
                )}
            </aside>
            <main className={`flex-1 md:w-1/2 py-6 lg:w-2/3 space-y-6 pb-28 scrollbar-none flex flex-col items-center ${isSingleColumn ? "px-5 pb-18" : "h-[calc(100vh-60px)] overflow-y-auto"}`}>
                <SubHeader icon={<FaBookmark size={20} />} name={isOwnProfile ? "Vos recettes" : "Recettes publiées"} sticky={isSingleColumn} />
                <div className="flex flex-col gap-5 w-full max-w-[700px]">
                    {sortedRecipes.map((recipe: Recipe) => (
                        <RecipeDetailCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            </main>
        </div>
    );
}