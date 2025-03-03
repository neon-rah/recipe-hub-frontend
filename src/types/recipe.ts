// /app/types/recipe.ts
import {User, UserDTO} from "./user";

export interface RecipeDTO {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    preparation: string;
    category: string;
    image: string;
    creationDate: string;
    updatedDate: string;
    userId: string;
    user?: UserDTO;
}

export class Recipe implements RecipeDTO {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    preparation: string;
    category: string;
    image: string;
    creationDate: string;
    updatedDate: string;
    userId: string;
    user?: UserDTO;
    ingredientsList: string[];
    steps: string[];
    likes: number;
    owner : User|null;

    constructor(recipe: RecipeDTO) {
        this.id = recipe.id;
        this.title = recipe.title;
        this.description = recipe.description;
        this.ingredients = recipe.ingredients;
        this.preparation = recipe.preparation;
        this.category = recipe.category;
        this.image = `${process.env.NEXT_PUBLIC_SERVER_URL}${recipe.image}`;
        this.creationDate = recipe.creationDate;
        this.updatedDate = recipe.updatedDate;
        this.userId = recipe.userId;
        this.user = recipe.user;
        this.ingredientsList = recipe.ingredients.split(", ");
        this.steps = recipe.preparation.split("; ");
        this.likes = 0; // Initialisé à 0, sera mis à jour par useLike
        this.owner = recipe.user ? new User(recipe.user) : null;
    }
}