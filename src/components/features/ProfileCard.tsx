"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Pencil, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { followUser, unfollowUser, getFollowerCount, isFollowingUser } from "@/lib/api/followApi";

interface ProfileCardProps {
    user: User | null;
    currentUserId?: string;
    isProfileOwner?: boolean;
    isFollowing?: boolean; // Statut de suivi passé depuis ProfilePage
}

export default function ProfileCard({ user, currentUserId, isProfileOwner = true, isFollowing: initialIsFollowing = false }: ProfileCardProps) {
    const router = useRouter();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followerCount, setFollowerCount] = useState(0);

    useEffect(() => {
        if (user) {
            getFollowerCount(user.idUser).then((count) => {
                setFollowerCount(count);
            });
            if (!isProfileOwner && currentUserId) {
                isFollowingUser(currentUserId, user.idUser).then(setIsFollowing);
            }
        }
    }, [user, currentUserId, isProfileOwner]);

    if (!user) {
        console.error("[ProfileCard] User is null");
        return <div className="p-4 text-red-500">User data unavailable</div>;
    }

    const handleFollow = async () => {
        if (!currentUserId) return;
        try {
            await followUser(currentUserId, user.idUser);
            const updatedCount = await getFollowerCount(user.idUser);
            setIsFollowing(true);
            setFollowerCount(updatedCount);
        } catch (err) {
            console.error("[ProfileCard] Error following user:", err);
        }
    };

    const handleUnfollow = async () => {
        if (!currentUserId) return;
        try {
            await unfollowUser(currentUserId, user.idUser);
            const updatedCount = await getFollowerCount(user.idUser);
            setIsFollowing(false);
            setFollowerCount(updatedCount);
        } catch (err) {
            console.error("[ProfileCard] Error unfollowing user:", err);
        }
    };

    return (
        <Card className="w-full mx-auto shadow-lg border-none rounded-xl bg-white dark:bg-primary-20 text-gray-900 dark:text-white transition-colors duration-300">
            <div className="relative h-32 bg-gray-200 rounded-t-xl dark:bg-gray-800 overflow-hidden">
                <Image
                    src="/assets/back-5.jpg"
                    alt="Cover image"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-80 dark:opacity-60"
                />
            </div>
            <CardContent className="relative p-4">
                <div className="relative w-28 h-28 -mt-16 mb-2 border-4 border-gray-300 dark:border-gray-700 rounded-full overflow-hidden">
                    <Image
                        src={user.profileUrl || "/assets/profile-1.png"}
                        alt="Profile picture"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {user.userName || `${user.firstName} ${user.lastName}`}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{followerCount} Follower{followerCount !== 1 ? "s" : ""}</span>
                </p>
                <div className="text-gray-700 dark:text-gray-300 mt-2">
                    <div className="flex items-center text-sm gap-1 mb-1">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>Live at <strong>{user.address || "Unknown"}</strong></span>
                    </div>
                    <div className="flex items-center text-sm gap-1">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span>Member since <strong>{user.created || "N/A"}</strong></span>
                    </div>
                </div>
                <div className="mt-4 flex flex-col md:flex-row gap-2">
                    {isProfileOwner ? (
                        <Button
                            onClick={() => router.push("/publish")}
                            variant={"default"}
                            className="w-full bg-accent hover:bg-accent-80 dark:text-gray-700 dark:bg-accent dark:hover:bg-accent-80 dark:outline-none dark:text-white"
                        >
                            <Pencil className="w-4 h-4 mr-2" /> New Post
                        </Button>
                    ) : (
                        <Button
                            className={`w-full ${isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-orange-300 dark:bg-gray-700 dark:hover:bg-gray-600"}`}
                            onClick={isFollowing ? handleUnfollow : handleFollow}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}