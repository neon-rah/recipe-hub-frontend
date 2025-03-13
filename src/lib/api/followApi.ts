// /app/lib/api/followApi.ts
import api from "@/config/api";
import { User, Follower } from "@/types/user";

export const followUser = async (followerId: string, followedId: string): Promise<string> => {
    const response = await api.post(`/followers/${followerId}/follow/${followedId}`);
    return response.data;
};

export const unfollowUser = async (followerId: string, followedId: string): Promise<string> => {
    const response = await api.delete(`/followers/${followerId}/unfollow/${followedId}`);
    return response.data;
};

export const isFollowingUser = async (followerId: string, followedId: string): Promise<boolean> => {
    const response = await api.get(`/followers/${followerId}/is-following/${followedId}`);
    return response.data;
};

export const getFollowers = async (userId: string): Promise<Follower[]> => {
    const response = await api.get(`/followers/${userId}/followers`);
    return response.data.map((f: any) => ({
        idFollow: f.idFollow,
        follower: new User({
            idUser: f.follower.idUser,
            lastName: f.follower.lastName,
            firstName: f.follower.firstName,
            email: f.follower.email || "",
            password: undefined,
            address: f.follower.address || "",
            profilePic: f.follower.profilePic || "",
            created: f.follower.created || new Date().toISOString(),
            followerCount: f.follower.followerCount || 0,
        }),
        followed: new User({
            idUser: f.followed.idUser,
            lastName: f.followed.lastName,
            firstName: f.followed.firstName,
            email: f.followed.email || "",
            password: undefined,
            address: f.followed.address || "",
            profilePic: f.followed.profilePic || "",
            created: f.followed.created || new Date().toISOString(),
            followerCount: f.followed.followerCount || 0,
        }),
        followedAt: f.followedAt,
    }));
};

export const getFollowing = async (userId: string): Promise<Follower[]> => {
    const response = await api.get(`/followers/${userId}/following`);
    return response.data.map((f: any) => ({
        idFollow: f.idFollow,
        follower: new User({
            idUser: f.follower.idUser,
            lastName: f.follower.lastName,
            firstName: f.follower.firstName,
            email: f.follower.email || "",
            password: undefined,
            address: f.follower.address || "",
            profilePic: f.follower.profilePic || "",
            created: f.follower.created || new Date().toISOString(),
            followerCount: f.follower.followerCount || 0,
        }),
        followed: new User({
            idUser: f.followed.idUser,
            lastName: f.followed.lastName,
            firstName: f.followed.firstName,
            email: f.followed.email || "",
            password: undefined,
            address: f.followed.address || "",
            profilePic: f.followed.profilePic || "",
            created: f.followed.created || new Date().toISOString(),
            followerCount: f.followed.followerCount || 0,
        }),
        followedAt: f.followedAt,
    }));
};

export const getFollowerCount = async (userId: string): Promise<number> => {
    const response = await api.get(`/followers/${userId}/followers/count`);
    return response.data;
};

export const getFollowingCount = async (userId: string): Promise<number> => {
    const response = await api.get(`/followers/${userId}/following/count`);
    return response.data;
};

export const getSuggestedUsers = async (userId: string): Promise<User[]> => {
    const response = await api.get(`/followers/${userId}/suggestions`);
    console.log("[followApi] Raw suggested users response:", response.data);
    return response.data.map((u: any) => new User(u));
};


export const getRandomSuggestedUsers = async (userId: string): Promise<User[]> => {
    const response = await api.get(`/followers/${userId}/random-suggestions`);
    return response.data.map((u: any) => new User(u));
};

export const searchUsers = async (userId: string, query: string): Promise<User[]> => {
    const response = await api.get(`/followers/${userId}/search?query=${encodeURIComponent(query)}`);
    console.log("[followApi] Raw search users response:", response.data);
    return response.data.map((u: any) => new User(u));
};