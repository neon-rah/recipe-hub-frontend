"use client"; // Nécessaire pour les hooks et les événements
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload"; // Composant personnalisé pour l'upload
import { REGIONS, CATEGORIES } from "@/config/constants"; // Import des constantes

interface NewPostProps {
    onSubmit: (postData: any) => void;
}

export default function NewPost({ onSubmit }: NewPostProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        region: "",
        category: "",
        ingredients: [""],
        preparationSteps: [""],
        image: null as File | null,
    });

    // Gestion du changement des champs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gestion du changement des valeurs du select
    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Ajout d'un ingrédient
    const handleAddIngredient = () => {
        if (formData.ingredients.some((ing) => ing.trim() === "")) return;
        setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
    };

    // Suppression d'un ingrédient
    const handleRemoveIngredient = (index: number) => {
        const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: updatedIngredients });
    };

    // Gestion de la modification d'un ingrédient
    const handleIngredientChange = (index: number, value: string) => {
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[index] = value;
        setFormData({ ...formData, ingredients: updatedIngredients });
    };

    // Ajout d'une étape de préparation
    const handleAddPreparationStep = () => {
        if (formData.preparationSteps.some((step) => step.trim() === "")) return;
        setFormData({ ...formData, preparationSteps: [...formData.preparationSteps, ""] });
    };

    // Suppression d'une étape de préparation
    const handleRemovePreparationStep = (index: number) => {
        const updatedSteps = formData.preparationSteps.filter((_, i) => i !== index);
        setFormData({ ...formData, preparationSteps: updatedSteps });
    };

    // Gestion de la modification d'une étape de préparation
    const handlePreparationStepChange = (index: number, value: string) => {
        const updatedSteps = [...formData.preparationSteps];
        updatedSteps[index] = value;
        setFormData({ ...formData, preparationSteps: updatedSteps });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) return;
        onSubmit({
            ...formData,
            ingredients: formData.ingredients.filter((ing) => ing.trim() !== ""),
            preparationSteps: formData.preparationSteps.filter((step) => step.trim() !== ""),
        });
    };

    return (
        <div className="shadow-gray-700 w-full dark:bg-background-dark/80 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-primary mb-4">New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-wrap gap-6">
                    {/* Partie gauche - Titre, Description, Ingrédients, Préparation */}
                    <div className="flex-1 space-y-4 min-w-[300px]">
                        <div >                            
                            <Input label={"Title"} name="title" value={formData.title} onChange={handleChange} placeholder="Enter recipe title" />
                        </div>

                        <div >
                            <Label htmlFor="description">Description</Label>
                            <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your recipe" />
                        </div>

                        {/* Ingrédients */}
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
                                            className="bg-red-400 hover:bg-red-300 dark:bg-primary-dark"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" onClick={handleAddIngredient} className="bg-secondary hover:bg-gray-400 dark:bg-secondary-dark dark:hover:bg-gray-400 text-white">
                                <PlusIcon className="w-4 h-4 mr-2" /> Add Ingredient
                            </Button>
                        </div>

                        {/* Préparation */}
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
                                        <Button type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="bg-red-400 hover:bg-red-300 dark:bg-primary-dark"
                                                onClick={() => handleRemovePreparationStep(index)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" onClick={handleAddPreparationStep} className="bg-secondary hover:bg-gray-400 dark:bg-secondary-dark dark:hover:bg-gray-400 text-white">
                                <PlusIcon className="w-4 h-4 mr-2" /> Add Step
                            </Button>
                        </div>
                    </div>

                    {/* Partie droite - Région, Catégorie, Image */}
                    <div className="flex-1 space-y-4 min-w-[250px]">
                        <div>
                            <Label>Region</Label>
                            <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent className={"bg-gray-100 dark:bg-black/90"}>
                                    {REGIONS.map((r) => (
                                        <SelectItem key={r} value={r}>
                                            {r}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                        </div>

                        <div>
                            <Label>Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className={"bg-gray-100 dark:bg-black/90"}>
                                    {CATEGORIES.map((c) => (
                                        <SelectItem className={"hover:bg-gray-600"}  key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>                            
                            <ImageUpload className={"w-full h-[200px]"} shape={"square"} onImageSelect={(file) => setFormData({ ...formData, image: file })} />
                        </div>       

                        

                       
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" className={"w-40"}>
                        Cancel
                    </Button>
                    <Button type="submit" className={"w-40"}>Publish</Button>
                </div>
                
            </form>
        </div>
    );
}
