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

export const isFollowing = async (followerId: string, followedId: string): Promise<boolean> => {
    const response = await api.get(`/followers/${followerId}/is-following/${followedId}`);
    return response.data;
};

export const getFollowers = async (userId: string): Promise<Follower[]> => {
    const response = await api.get(`/followers/${userId}/followers`);
    console.log("[followApi] Raw followers response:", response.data);
    return response.data.map((f: any) => new Follower(f));
};

export const getFollowing = async (userId: string): Promise<Follower[]> => {
    const response = await api.get(`/followers/${userId}/following`);
    console.log("[followApi] Raw following response:", response.data);
    return response.data.map((f: any) => new Follower(f));
};

export const getFollowerCount = async (userId: string): Promise<number> => {
    const response = await api.get(`/followers/${userId}/followers/count`);
    return response.data;
};

export const getSuggestedUsers = async (userId: string): Promise<User[]> => {
    const response = await api.get(`/followers/${userId}/suggestions`);
    console.log("[followApi] Raw suggested users response:", response.data);
    return response.data.map((u: any) => new User(u));
};

export const searchUsers = async (userId: string, query: string): Promise<User[]> => {
    const response = await api.get(`/followers/${userId}/search?query=${encodeURIComponent(query)}`);
    console.log("[followApi] Raw search users response:", response.data);
    return response.data.map((u: any) => new User(u));
};