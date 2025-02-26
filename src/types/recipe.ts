import { UserDTO } from "./user";

export interface RecipeDTO {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    preparation: string;
    category: string;
    region: string;
    image: string;
    creationDate: string; // LocalDateTime devient string
    updatedDate: string;

    user?: UserDTO; // L'utilisateur qui a publié la recette
}