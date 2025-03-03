import { RecipeDTO } from "./recipe";

export interface UserDTO {
    idUser: string; // UUID sous forme de string
    lastName: string;
    firstName: string;
    email: string;
    password?: string; // Facultatif car @JsonIgnore en backend
    address: string;
    profilePic: string;
    created: string; // LocalDateTime est stocké en string en JSON
   

    recipes?: RecipeDTO[]; // Liste des recettes créées par l'utilisateur
}

// Classe User implémentant UserDTO avec profileUrl calculé
export class User implements UserDTO {
    idUser: string;
    lastName: string;
    firstName: string;
    email: string;
    password?: string;
    address: string;
    profilePic: string;
    created: string;
    recipes?: RecipeDTO[];
    profileUrl: string;
    userName: string;

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
        this.recipes = user.recipes;
        this.profileUrl = this.profilePic
            ? `${process.env.NEXT_PUBLIC_SERVER_URL}${this.profilePic}`
            : "/assets/profile-1.png";
        this.userName = this.firstName
            ? `${this.firstName} ${this.lastName}`
            : this.lastName ;
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