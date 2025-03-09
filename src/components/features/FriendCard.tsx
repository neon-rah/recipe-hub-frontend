// /app/components/features/FriendCard.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface FriendCardProps {
    user: User;
    isFollowing: boolean;
    onFollow: (id: string) => void;
    onUnfollow: (id: string) => void;
    className?: string;
}

export default function FriendCard({ user, isFollowing, onFollow, onUnfollow, className = "" }: FriendCardProps) {
    const router = useRouter();

    // Point de débogage : Vérifier l’état de user
    console.log("[FriendCard] Received user:", user);

    // Vérification explicite pour éviter l’erreur
    if (!user) {
        console.error("[FriendCard] User is undefined or null");
        return <div className="p-4 text-red-500">User data unavailable</div>;
    }

    const handleNameClick = () => {
        console.log("[FriendCard] Navigating to profile for user:", user.idUser);
        router.push(`/profile/${user.idUser}`);
    };

    // Point de débogage : Vérifier profileUrl avant l’utilisation
    console.log("[FriendCard] User profileUrl:", user.profileUrl);

    return (
        <Card className={`flex items-center w-full gap-5 justify-between px-3 py-1 rounded-lg shadow-md bg-white dark:bg-gray-900 transition-colors duration-300 ${className}`}>
            <div className="flex items-center gap-2 dark:bg-gray-900">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 dark:bg-gray-900 dark:border-gray-900">
                    <Image
                        src={user.profileUrl || "/assets/profile-1.png"} // Fallback si profileUrl est undefined
                        alt={user.userName || "Unknown User"}
                        width={50}
                        height={50}
                        className="object-cover"
                    />
                </div>
                <div>
                    <h3
                        className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:underline"
                        onClick={handleNameClick}
                    >
                        {user.userName || "Unknown"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user.followerCount || 0} follower{user.followerCount !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>
            <Button
                className={`flex items-center gap-1 px-3 py-1 ${isFollowing ? "bg-red-500" : "border-gray-400 dark:bg-primary-dark dark:text-gray-900 text-gray-700"}`}
                onClick={() => {
                    console.log(`[FriendCard] Clicking ${isFollowing ? "Unfollow" : "Follow"} for user:`, user.idUser);
                    isFollowing ? onUnfollow(user.idUser) : onFollow(user.idUser);
                }}
            >
                {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
        </Card>
    );
}