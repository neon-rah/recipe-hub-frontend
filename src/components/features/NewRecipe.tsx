"use client";

import { useRecipeForm } from "@/hooks/use-recipe-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";
import { CATEGORIES } from "@/config/constants";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {useRouter} from "next/navigation";
import Forbidden from "@/components/ui/Forbidden";

interface NewRecipeProps {
    onSubmit: () => void;
    initialId?: number;
}

export default function NewRecipe({ onSubmit, initialId }: NewRecipeProps) {
    const router = useRouter();
    const { formData, errors, submitStatus,isUnauthorized, setSubmitStatus, handleChange, handleSubmit, resetForm } = useRecipeForm(initialId);
    console.debug("NewRecipe: Rendering with initialId:", initialId);
    console.debug("NewRecipe: isUnauthorized:", isUnauthorized);

    if (isUnauthorized) {
        console.debug("NewRecipe: Rendering Forbidden component");
        console.debug("NewRecipe: Rendering initialId", initialId);
        return <Forbidden />;
    }

    console.debug("NewRecipe: Proceeding to render form");
    console.debug("NewRecipe: Proceeding to render form with initalid", initialId);

    const isFormValid = () => {
        const hasNoErrors = Object.values(errors).every((error) => !error);
        const isFilled =
            formData.title.trim() !== "" &&
            formData.description.trim() !== "" &&
            formData.ingredients.some((ing) => ing.trim() !== "") &&
            formData.preparationSteps.some((step) => step.trim() !== "") &&
            formData.category.trim() !== "";
        // Image facultative pour une mise à jour
        const isImageValid = initialId ? true : !!formData.image;

        return hasNoErrors && isFilled && isImageValid;
    };

    const handleIngredientChange = (index: number, value: string) => {
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[index] = value;
        handleChange("ingredients", updatedIngredients);
    };

    const handleAddIngredient = () => {
        if (formData.ingredients.some((ing) => ing.trim() === "")) return;
        const updatedIngredients = [...formData.ingredients, ""];
        handleChange("ingredients", updatedIngredients);
    };

    const handleRemoveIngredient = (index: number) => {
        const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
        handleChange("ingredients", updatedIngredients);
    };

    const handlePreparationStepChange = (index: number, value: string) => {
        const updatedSteps = [...formData.preparationSteps];
        updatedSteps[index] = value;
        handleChange("preparationSteps", updatedSteps);
    };

    const handleAddPreparationStep = () => {
        if (formData.preparationSteps.some((step) => step.trim() === "")) return;
        const updatedSteps = [...formData.preparationSteps, ""];
        handleChange("preparationSteps", updatedSteps);
    };

    const handleRemovePreparationStep = (index: number) => {
        const updatedSteps = formData.preparationSteps.filter((_, i) => i !== index);
        handleChange("preparationSteps", updatedSteps);
    };

    const handleCancel = () => {
        if (initialId){    
            console.log("[new form] reset initial id", initialId);
            router.push("/profile");
        }
        resetForm();
    };

    return (
        <div className="shadow-dark-soft w-full dark:bg-background-dark/80 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-primary mb-4">{initialId ? "Edit Recipe" : "New Recipe"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                <div className="flex flex-wrap gap-6">
                    <div className="flex-1 space-y-4 min-w-[300px]">
                        <div>
                            <Input
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="Enter recipe title"
                                errorMessage={errors.title}
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Describe your recipe"
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Ingredients</Label>
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                        placeholder={`Ingredient ${index + 1}`}
                                    />
                                    {formData.ingredients.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleRemoveIngredient(index)}
                                            className="bg-alert hover:bg-alert/80"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients}</p>}
                            <Button
                                type="button"
                                onClick={handleAddIngredient}
                                className="bg-secondary text-small-1 py-1 hover:bg-secondary/80 dark:bg-secondary-dark dark:hover:bg-secondary-dark/80 text-white"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" /> <p className={"text-small-2 text-white"}>Add Ingredient</p>
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <Label>Preparation</Label>
                            {formData.preparationSteps.map((step, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={step}
                                        onChange={(e) => handlePreparationStepChange(index, e.target.value)}
                                        placeholder={`Step ${index + 1}`}
                                    />
                                    {formData.preparationSteps.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="bg-alert hover:bg-alert/80"
                                            onClick={() => handleRemovePreparationStep(index)}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {errors.preparationSteps && <p className="text-red-500 text-sm">{errors.preparationSteps}</p>}
                            <Button
                                type="button"
                                onClick={handleAddPreparationStep}
                                className="bg-secondary text-small-1 hover:bg-secondary/80 dark:bg-secondary-dark dark:hover:bg-secondary-dark/80 text-white"
                            >
                                <PlusIcon className="w-4 h-4 mr-2"/> <p className={"text-small-2 text-white"}>Add Step</p>
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 min-w-[250px]">
                        <div>
                            <Label>Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-100 dark:bg-background-dark/90">
                                    {CATEGORIES.map((c) => (
                                        <SelectItem className="hover:bg-gray-600" key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                        </div>

                        <div>
                            <Label>Image</Label>
                            <ImageUpload
                                className="w-full h-[200px]"
                                shape="square"
                                onImageSelect={(file) => handleChange("image", file)}
                                initialImage={typeof formData.image === "string" ? formData.image : undefined} // Passer l'URL si c'est une string
                            />
                            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" className="w-40" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="w-40" disabled={!isFormValid()}>
                        {initialId ? "Update" : "Publish"}
                    </Button>
                </div>

                {submitStatus && (
                    <AlertDialog open={!!submitStatus}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{submitStatus.success ? "Success" : "Error"}</AlertDialogTitle>
                                <AlertDialogDescription>{submitStatus.message}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setSubmitStatus(null)}>Close</AlertDialogCancel>
                                {submitStatus.success && (
                                    <AlertDialogAction onClick={onSubmit}>Go to Profile</AlertDialogAction>
                                )}
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </form>
        </div>
    );
}