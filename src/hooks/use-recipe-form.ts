"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VALIDATION_RULES } from "@/config/recipe-validation";
import { createRecipe, updateRecipe, getRecipeById } from "@/lib/api/recipeApi";

export type RecipeFormData = {
    title: string;
    description: string;
    ingredients: string[];
    preparationSteps: string[];
    category: string;
    image: File | null | string; // Ajouter string pour gérer une URL existante
};

type ValidationErrors = Partial<Record<keyof RecipeFormData, string>>;

export function useRecipeForm(recipeId?: number) {
    const router = useRouter();
    const [formData, setFormData] = useState<RecipeFormData>({
        title: "",
        description: "",
        ingredients: [""],
        preparationSteps: [""],
        category: "",
        image: null,
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    useEffect(() => {
        if (recipeId) {
            const fetchRecipe = async () => {
                try {
                    const data = await getRecipeById(recipeId);
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        ingredients: data.ingredients ? data.ingredients.split(", ") : [""],
                        preparationSteps: data.preparation ? data.preparation.split("; ") : [""],
                        category: data.category || "",
                        image: `${process.env.NEXT_PUBLIC_SERVER_URL}${data.image}` || null, // Charger l'URL de l'image existante
                    });
                } catch (error: any) {
                    console.error("Error fetching recipe:", error);
                    console.debug("Error response status:", error.response?.status);
                    console.debug("Error response data:", error.response?.data);
                    if (error.response?.status === 403) {
                        console.debug("Detected 403 Forbidden, setting isUnauthorized to true");
                        setIsUnauthorized(true);
                        // console.debug("Redirecting to /profile");
                        // router.push("/profile");
                    } else {
                        console.debug("Non-403 error, setting error message:", error.message);
                        setErrors({ title: error.message });
                    }
                }
            };
            fetchRecipe();
        }
    }, [recipeId]);

    const validateField = (name: keyof RecipeFormData, value: string | string[] | File | null | string) => {
        const rule = VALIDATION_RULES[name];
        if (!rule) return "";

        if (!value || (Array.isArray(value) && value.every((v) => v.trim() === ""))) {
            // Pour une mise à jour, l'image existante (string) est valide
            if (name === "image" && typeof value === "string" && value !== "") return "";
            return rule.required;
        }

        if (rule.minLength) {
            if (typeof value === "string" && value.length < rule.minLength) {
                return rule.minLengthMessage || "Field is too short";
            }
            if (Array.isArray(value)) {
                const invalid = value.some((v) => v.trim().length < rule.minLength && v.trim() !== "");
                if (invalid) return rule.minLengthMessage || "Some items are too short";
            }
        }

        return "";
    };

    const handleChange = (name: keyof RecipeFormData, value: string | string[] | File | null) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            ingredients: [""],
            preparationSteps: [""],
            category: "",
            image: null,
        });
        setErrors({});
        setSubmitStatus(null);
    };

    const handleSubmit = async () => {
        const newErrors: ValidationErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key as keyof RecipeFormData, value);
            if (error) newErrors[key as keyof RecipeFormData] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitStatus({ success: false, message: "Please fix the errors in the form" });
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("ingredients", formData.ingredients.filter((ing) => ing.trim() !== "").join(", "));
        data.append("preparation", formData.preparationSteps.filter((step) => step.trim() !== "").join("; "));
        data.append("category", formData.category);
        // Ajouter l'image uniquement si c'est un File (pas une URL existante)
        if (formData.image instanceof File) {
            data.append("image", formData.image);
        }

        try {
            if (recipeId) {
                await updateRecipe(recipeId, data);
                setSubmitStatus({ success: true, message: "Recipe updated successfully!" });
            } else {
                await createRecipe(data);
                setSubmitStatus({ success: true, message: "Recipe created successfully!" });
            }
            setTimeout(() => router.push("/profile"), 2000);
        } catch (error: any) {
            setSubmitStatus({ success: false, message: error.message });
        }
    };

    return { formData, errors, submitStatus,isUnauthorized, setSubmitStatus, handleChange, handleSubmit, resetForm };
}