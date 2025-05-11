// /app/types/user.ts
import { RecipeDTO } from "./recipe";

export interface UserDTO {
    idUser: string;
    lastName: string;
    firstName: string;
    email: string;
    password?: string;
    address: string;
    profilePic: string;
    created: string;
    resetToken?: string;
    resetTokenExpiredAt?: string;
    recipes?: RecipeDTO[];
    followedAt?: string;
    followerCount?: number;
}

export class User implements UserDTO {
    idUser: string;
    lastName: string;
    firstName: string;
    email: string;
    password?: string;
    address: string;
    profilePic: string;
    created: string;
    resetToken?: string;
    resetTokenExpiredAt?: string;
    recipes?: RecipeDTO[];
    profileUrl: string;
    userName: string;
    followedAt?: string;
    followerCount?: number;

    constructor(user: UserDTO) {
        this.idUser = user.idUser;
        this.lastName = user.lastName;
        this.firstName = user.firstName;
        this.email = user.email;
        this.password = user.password;
        this.address = user.address;
        this.profilePic = user.profilePic;
        this.created = new Date(user.created).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        this.resetToken = user.resetToken;
        this.resetTokenExpiredAt = user.resetTokenExpiredAt;
        this.recipes = user.recipes;
        this.profileUrl = this.profilePic
            ? `${process.env.NEXT_PUBLIC_SERVER_URL}${this.profilePic}`
            : "/assets/profile-1.png";
        this.userName = this.firstName
            ? `${this.firstName} ${this.lastName}`
            : this.lastName;
        this.followedAt = user.followedAt;
        this.followerCount = user.followerCount; // Ajouté
    }
}

export interface FollowerDTO {
    idFollow: number;
    follower: UserDTO;
    followed: UserDTO;
    followedAt: string;
}

export class Follower implements FollowerDTO {
    idFollow: number;
    follower: User;
    followed: User;
    followedAt: string;

    constructor(follower: FollowerDTO) {
        this.idFollow = follower.idFollow;
        this.follower = new User(follower.follower);
        this.followed = new User(follower.followed);
        this.followedAt = follower.followedAt;
    }
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface ApiError {
    status: string;
    error: string;
    message: string;
}

// Interface pour la réponse du backend pour la réinitialisation
export interface ResetResponse {
    success: boolean;
    message: string;
}