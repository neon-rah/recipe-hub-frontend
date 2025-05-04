"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { getFollowerCount } from "@/lib/api/followApi";

interface FriendCardProps {
    user: User;
    isFollowing: boolean;
    onFollow: (id: string) => void;
    onUnfollow: (id: string) => void;
    currentUserId?: string; // Ajouté pour vérifier l’utilisateur connecté
    className?: string;
}

export default function FriendCard({ user, isFollowing, onFollow, onUnfollow, currentUserId, className = "" }: FriendCardProps) {
    const router = useRouter();

    if (!user) {
        console.error("[FriendCard] User is undefined or null");
        return <div className="p-4 text-red-500">User data unavailable</div>;
    }

    const handleNameClick = () => {
        console.log("[FriendCard] Navigating to profile for user:", user.idUser);
        router.push(`/profile/${user.idUser}`);
    };

    const handleFollowClick = async () => {
        onFollow(user.idUser);
        const updatedCount = await getFollowerCount(user.idUser);
        user.followerCount = updatedCount; // Mise à jour locale
    };

    const handleUnfollowClick = async () => {
        onUnfollow(user.idUser);
        const updatedCount = await getFollowerCount(user.idUser);
        user.followerCount = updatedCount; // Mise à jour locale
    };

    const isCurrentUser = currentUserId === user.idUser;

    return (
        <Card className={`flex items-center w-full gap-5 justify-between px-3 py-1 rounded-lg shadow-md bg-background-secondary dark:bg-primary-20 dark:border-none transition-colors duration-300 ${className}`}>
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 dark:bg-gray-900 dark:border-gray-900">
                    <Image
                        src={user.profileUrl || "/assets/profile-1.png"}
                        alt={user.userName || "Unknown User"}
                        width={50}
                        height={50}
                        className="object-cover"
                    />
                </div>
                <div>
                    <h3
                        className="text-sm text-wrap font-medium text-gray-900 dark:text-white cursor-pointer hover:underline"
                        onClick={handleNameClick}
                    >
                        {user.userName || "Unknown"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user.followerCount || 0} follower{user.followerCount !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>
            {!isCurrentUser && ( // Masquer les boutons si c’est l’utilisateur connecté
                <Button                    
                    className={`flex w-9 h-9 text-white text-small-2 items-center ${isFollowing ? "bg-alert dark:bg-alert-dark dark:hover:bg-alert" : "bg-primary dark:bg-primary-dark"}`}
                    onClick={isFollowing ? handleUnfollowClick : handleFollowClick}
                >
                    {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {/*{isFollowing ? "Unfollow" : "Follow"}*/}
                </Button>
            )}
        </Card>
    );
}