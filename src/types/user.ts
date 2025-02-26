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