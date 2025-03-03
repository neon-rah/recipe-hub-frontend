import {RecipeFormData} from "@/hooks/use-recipe-form";

interface ValidationRule {
    required: string;
    minLength: number;
    minLengthMessage: string;
}

export const VALIDATION_RULES: Partial<Record<keyof RecipeFormData, ValidationRule>> = {
    title: { required: "Title is required", minLength: 3, minLengthMessage: "Title must be at least 3 characters" },
    description: { required: "Description is required", minLength: 10, minLengthMessage: "Description must be at least 10 characters" },
    ingredients: { required: "At least one ingredient is required", minLength: 2, minLengthMessage: "Each ingredient must be at least 2 characters" },
    preparationSteps: { required: "At least one preparation step is required", minLength: 5, minLengthMessage: "Each step must be at least 5 characters" },
    category: { required: "Category is required", minLength: 2, minLengthMessage: "Category must be at least 2 characters" },
    image: { required: "Image is required", minLength: 0, minLengthMessage: "" }, // Valeurs par défaut
};