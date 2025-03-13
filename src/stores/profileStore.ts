"use client";

import { create } from "zustand";
import { getFollowers, getFollowing, getFollowerCount, isFollowingUser, followUser, unfollowUser } from "@/lib/api/followApi";
import { findRecipesByUserId } from "@/lib/api/recipeApi";
import { Recipe, RecipeDTO } from "@/types/recipe";
import { Follower, User } from "@/types/user";

interface ProfileState {
    recipes: Recipe[];
    followers: Follower[];
    following: Follower[];
    isFollowingProfile: boolean;
    currentProfileId: string | null;
    loading: boolean;
    error: string | null;
    fetchProfileData: (userId: string, currentUserId?: string) => Promise<void>;
    updateFollowStatus: (followedId: string, action: "follow" | "unfollow", currentUserId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    recipes: [],
    followers: [],
    following: [],
    isFollowingProfile: false,
    currentProfileId: null,
    loading: false,
    error: null,
    fetchProfileData: async (userId: string, currentUserId?: string) => {
        set({ loading: true, error: null });
        try {
            const [recipesData, followersData, followingData, isFollowing] = await Promise.all([
                findRecipesByUserId(userId),
                getFollowers(userId),
                currentUserId === userId ? getFollowing(userId) : Promise.resolve([]),
                currentUserId && currentUserId !== userId ? isFollowingUser(currentUserId, userId) : Promise.resolve(false),
            ]);

            const updatedFollowers = await Promise.all(
                followersData.map(async (f: Follower) => ({
                    ...f,
                    follower: { ...f.follower, followerCount: await getFollowerCount(f.follower.idUser) },
                }))
            );
            const updatedFollowing = await Promise.all(
                followingData.map(async (f: Follower) => ({
                    ...f,
                    followed: { ...f.followed, followerCount: await getFollowerCount(f.followed.idUser) },
                }))
            );

            set({
                recipes: recipesData.map((r: RecipeDTO) => new Recipe(r)),
                followers: updatedFollowers,
                following: updatedFollowing,
                isFollowingProfile: isFollowing,
                currentProfileId: userId,
                loading: false,
            });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch profile data", loading: false });
            throw err;
        }
    },
    updateFollowStatus: async (followedId: string, action: "follow" | "unfollow", currentUserId: string) => {
        const { followers, following, currentProfileId } = get();
        try {
            if (action === "follow") {
                await followUser(currentUserId, followedId);
                const updatedCount = await getFollowerCount(followedId);
                const followedUser = followers.find(f => f.follower.idUser === followedId)?.follower || {
                    idUser: followedId,
                    userName: "Unknown",
                    profileUrl: "/assets/profile-1.png",
                    followerCount: updatedCount,
                    lastName: "",
                    firstName: "",
                    email: "",
                    address: "",
                    created: new Date().toISOString(),
                };

                // Mettre à jour le followerCount dans la liste des followers si l’utilisateur est présent
                const updatedFollowers = followers.map(f => {
                    if (f.follower.idUser === followedId) {
                        return { ...f, follower: { ...f.follower, followerCount: updatedCount } };
                    }
                    return f;
                });

                set({
                    followers: updatedFollowers, // Mettre à jour la liste des followers
                    following: [
                        {
                            idFollow: Date.now(),
                            follower: {
                                idUser: currentUserId,
                                userName: "",
                                profileUrl: "/assets/profile-1.png",
                                lastName: "",
                                firstName: "",
                                email: "",
                                address: "",
                                created: new Date().toISOString(),
                                followerCount: await getFollowerCount(currentUserId),
                            },
                            followed: { ...followedUser, followerCount: updatedCount },
                            followedAt: new Date().toISOString(),
                        },
                        ...following,
                    ],
                    isFollowingProfile: followedId === currentProfileId ? true : get().isFollowingProfile,
                });
            } else {
                await unfollowUser(currentUserId, followedId);
                const updatedCount = await getFollowerCount(followedId);

                // Mettre à jour le followerCount dans la liste des followers si l’utilisateur est présent
                const updatedFollowers = followers.map(f => {
                    if (f.follower.idUser === followedId) {
                        return { ...f, follower: { ...f.follower, followerCount: updatedCount } };
                    }
                    return f;
                });

                set({
                    followers: updatedFollowers, // Mettre à jour la liste des followers
                    following: following.filter(f => f.followed.idUser !== followedId),
                    isFollowingProfile: followedId === currentProfileId ? false : get().isFollowingProfile,
                });
            }
        } catch (err: any) {
            set({ error: err.message || `Failed to ${action} user` });
        }
    },
}));