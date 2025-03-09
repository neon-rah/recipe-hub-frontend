// /app/(personal)/follow/page.tsx
"use client";

import { SubHeader } from "@/components/ui/subheader";
import { FaUsers } from "react-icons/fa";
// import ProtectedRoute from "@/components/layout/ProtectedRoute";
import FriendCard from "@/components/features/FriendCard";
import { useFollow } from "@/hooks/useFollow";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ExpandableSearchBar from "@/components/ui/expandable-search-bar";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";

export default function FollowPage() {
    const { user } = useAuth();
    const currentUserId = user?.idUser ? user?.idUser: "";
    const {
        users,
        loading,
        error,
        
        setFilter,
        searchQuery,
        setSearchQuery,
        handleFollow,
        handleUnfollow,
        handleSearch,
        resetSearch,
        isSearching,
    } = useFollow(currentUserId);

    const [activeFilter, setActiveFilter] = useState<"suggestions" | "following">("suggestions");

    const toggleFilter = (newFilter: "suggestions" | "following") => {
        setFilter(newFilter);
        setActiveFilter(newFilter);
        setSearchQuery("");
    };

    if (loading) {
        return <div className="p-4 text-center">Loading users...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        // <ProtectedRoute>
            <div className="flex justify-center flex-col">
                <SubHeader
                    name="Follow"
                    icon={<FaUsers size={20} />}
                    sticky={true}
                    rightContent={
                        <ExpandableSearchBar
                            placeholder="Search by name..."
                            value={searchQuery}
                            setValue={setSearchQuery}
                            onSearch={handleSearch}
                            onCancel={resetSearch} // Réinitialiser avec "X"
                        />
                    }
                />
                <div className="flex flex-col p-6 gap-5">
                    {!isSearching && ( // Masquer les filtres pendant la recherche
                        <div className="flex gap-2 p-2">
                            <Badge
                                variant={activeFilter === "suggestions" ? "default" : "outline"}
                                className={cn(
                                    "rounded-full cursor-pointer px-4 py-1 whitespace-nowrap",
                                    activeFilter === "suggestions" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                                )}
                                onClick={() => toggleFilter("suggestions")}
                            >
                                Suggestions
                            </Badge>
                            <Badge
                                variant={activeFilter === "following" ? "default" : "outline"}
                                className={cn(
                                    "rounded-full cursor-pointer px-4 py-1 whitespace-nowrap",
                                    activeFilter === "following" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                                )}
                                onClick={() => toggleFilter("following")}
                            >
                                Following
                            </Badge>
                        </div>
                    )}
                    <div className="flex flex-col justify-content items-center gap-2">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <FriendCard
                                    key={user.idUser}
                                    user={user}
                                    isFollowing={!!user.followedAt} // Utiliser followedAt pour déterminer si suivi
                                    onFollow={handleFollow}
                                    onUnfollow={handleUnfollow}
                                    className="lg:w-full md:w-[70%]"
                                />
                            ))
                        ) : (
                            <div>No users to show</div>
                        )}
                    </div>
                </div>
            </div>
        // </ProtectedRoute>
    );
}