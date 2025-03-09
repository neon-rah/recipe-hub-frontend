// /app/hooks/useFollow.ts
"use client";

import { useState, useEffect } from "react";
import { getSuggestedUsers, getFollowing, followUser, unfollowUser, searchUsers, getFollowerCount } from "@/lib/api/followApi";
import { User, Follower } from "@/types/user";

interface FollowState {
    suggestedUsers: User[];
    followingUsers: User[];
    loading: boolean;
    error: string | null;
}

export function useFollow(currentUserId: string) {
    const [state, setState] = useState<FollowState>({
        suggestedUsers: [],
        followingUsers: [],
        loading: true,
        error: null,
    });
    const [filter, setFilter] = useState<"suggestions" | "following">("suggestions");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const fetchUsers = async () => {
        try {
            setState((prev) => ({ ...prev, loading: true }));
            const [suggested, following] = await Promise.all([
                getSuggestedUsers(currentUserId),
                getFollowing(currentUserId),
            ]);

            console.log("[useFollow] Raw suggested users:", suggested);
            console.log("[useFollow] Raw following users:", following);

            const updatedSuggested = await Promise.all(
                suggested.map(async (user: User) => ({
                    ...user,
                    followerCount: await getFollowerCount(user.idUser),
                }))
            );
            const updatedFollowing = await Promise.all(
                following.map(async (follower: Follower) => {
                    const user = follower.followed;
                    return {
                        ...user,
                        followerCount: await getFollowerCount(user.idUser),
                        followedAt: follower.followedAt,
                    };
                })
            );

           /* const updatedSuggested = await Promise.all(
                suggested.map(async (user: User) => {
                    const followerCount = await getFollowerCount(user.idUser);
                    const updatedUser = {
                        ...user,
                        followerCount,
                    };
                    console.log("[useFollow] Updated suggested user:", updatedUser);
                    return updatedUser;
                })
            );
            const updatedFollowing = await Promise.all(
                following.map(async (follower: Follower) => {
                    const user = follower.followed;
                    const followerCount = await getFollowerCount(user.idUser);
                    const updatedUser = {
                        ...user,
                        followerCount,
                        followedAt: follower.followedAt,
                    };
                    console.log("[useFollow] Updated following user:", updatedUser);
                    return updatedUser;
                })
            );*/

            console.log("[useFollow] Final suggestedUsers:", updatedSuggested);
            console.log("[useFollow] Final followingUsers:", updatedFollowing);

            setState({
                suggestedUsers: updatedSuggested,
                followingUsers: updatedFollowing.sort((a, b) => new Date(b.followedAt!).getTime() - new Date(a.followedAt!).getTime()),
                loading: false,
                error: null,
            });
        } catch (err: any) {
            console.error("[useFollow] Error fetching users:", err);
            setState((prev) => ({ ...prev, loading: false, error: err.message || "Failed to load users" }));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentUserId]);

    const handleFollow = async (followedId: string) => {
        try {
            await followUser(currentUserId, followedId);
            const updatedFollowerCount = await getFollowerCount(followedId); // Récupérer depuis l'API
            const followedUser = (isSearching ? state.suggestedUsers : state.suggestedUsers).find((u) => u.idUser === followedId);

            if (followedUser) {
                const userWithFollowedAt = {
                    ...followedUser,
                    followerCount: updatedFollowerCount,
                    followedAt: new Date().toISOString(), // Marquer comme suivi
                };

                if (isSearching) {
                    // Pendant la recherche, mettre à jour l'utilisateur dans suggestedUsers
                    setState((prev) => ({
                        ...prev,
                        suggestedUsers: prev.suggestedUsers.map((u) =>
                            u.idUser === followedId ? userWithFollowedAt : u
                        ),
                        followingUsers: [...prev.followingUsers, userWithFollowedAt].sort((a, b) =>
                            new Date(b.followedAt!).getTime() - new Date(a.followedAt!).getTime()
                        ),
                    }));
                } else {
                    // Hors recherche, comportement classique
                    setState((prev) => ({
                        ...prev,
                        suggestedUsers: prev.suggestedUsers.filter((u) => u.idUser !== followedId),
                        followingUsers: [
                            userWithFollowedAt,
                            ...prev.followingUsers,
                        ].sort((a, b) => new Date(b.followedAt!).getTime() - new Date(a.followedAt!).getTime()),
                    }));
                }
                console.log("[useFollow] After follow - Updated state:", state);
            }
        } catch (err: any) {
            console.error("[useFollow] Error following user:", err);
            setState((prev) => ({ ...prev, error: err.message || "Failed to follow user" }));
        }
    };

    const handleUnfollow = async (followedId: string) => {
        try {
            await unfollowUser(currentUserId, followedId);
            const updatedFollowerCount = await getFollowerCount(followedId); // Récupérer depuis l'API
            const unfollowedUser = (isSearching ? state.suggestedUsers : state.followingUsers).find((u) => u.idUser === followedId);

            if (unfollowedUser) {
                const { followedAt, ...userWithoutFollowedAt } = unfollowedUser;
                const updatedUser = {
                    ...userWithoutFollowedAt,
                    followerCount: updatedFollowerCount,
                };

                if (isSearching) {
                    // Pendant la recherche, mettre à jour l'utilisateur dans suggestedUsers
                    setState((prev) => ({
                        ...prev,
                        suggestedUsers: prev.suggestedUsers.map((u) =>
                            u.idUser === followedId ? updatedUser : u
                        ),
                        followingUsers: prev.followingUsers.filter((u) => u.idUser !== followedId),
                    }));
                } else {
                    // Hors recherche, comportement classique
                    setState((prev) => ({
                        ...prev,
                        followingUsers: prev.followingUsers.filter((u) => u.idUser !== followedId),
                        suggestedUsers: [updatedUser, ...prev.suggestedUsers],
                    }));
                }
                console.log("[useFollow] After unfollow - Updated state:", state);
            }
        } catch (err: any) {
            console.error("[useFollow] Error unfollowing user:", err);
            setState((prev) => ({ ...prev, error: err.message || "Failed to unfollow user" }));
        }
    };

    const handleSearch = async (query: string) => {
        try {
            setState((prev) => ({ ...prev, loading: true }));
            setIsSearching(true); // Activer le mode recherche
            const searchResults = await searchUsers(currentUserId, query);
            const updatedResults = await Promise.all(
                searchResults.map(async (user: User) => ({
                    ...user,
                    followerCount: await getFollowerCount(user.idUser),
                    followedAt: state.followingUsers.find(f => f.idUser === user.idUser)?.followedAt, // Garder followedAt si suivi
                }))
            );

            // Trier par nom (userName) de A à Z
            const sortedResults = updatedResults.sort((a, b) =>
                a.userName.localeCompare(b.userName)
            );

            setState((prev) => ({
                ...prev,
                suggestedUsers: sortedResults, // On utilise suggestedUsers pour les résultats de recherche
                loading: false,
            }));
            console.log("[useFollow] After search - Updated state:", state);
        } catch (err: any) {
            console.error("[useFollow] Error searching users:", err);
            setState((prev) => ({ ...prev, loading: false, error: err.message || "Failed to search users" }));
        }
    };

   /* const handleSearch = async (query: string) => {
        try {
            setState((prev) => ({ ...prev, loading: true }));
            const searchResults = await searchUsers(currentUserId, query);
            const updatedResults = await Promise.all(
                searchResults.map(async (user: User) => ({
                    ...user,
                    followerCount: await getFollowerCount(user.idUser),
                }))
            );
            setState((prev) => ({
                ...prev,
                suggestedUsers: filter === "suggestions" ? updatedResults : prev.suggestedUsers,
                followingUsers: filter === "following" ? updatedResults.filter((u) => prev.followingUsers.some(f => f.idUser === u.idUser)) : prev.followingUsers,
                loading: false,
            }));
            console.log("[useFollow] After search - Updated state:", state);
        } catch (err: any) {
            console.error("[useFollow] Error searching users:", err);
            setState((prev) => ({ ...prev, loading: false, error: err.message || "Failed to search users" }));
        }
    };*/

    const resetSearch = () => {
        setIsSearching(false); // Désactiver le mode recherche
        setSearchQuery(""); // Réinitialiser la recherche
        fetchUsers(); // Recharger les données initiales
    };

    const displayedUsers = isSearching
        ? state.suggestedUsers
        : (filter === "suggestions" ? state.suggestedUsers : state.followingUsers);

    return {
        users: displayedUsers,
        loading: state.loading,
        error: state.error,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        handleFollow,
        handleUnfollow,
        handleSearch,
        resetSearch, 
        isSearching,
    };
}