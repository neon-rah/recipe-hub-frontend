"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["Tout", "Plats", "Desserts", "Boissons"];
const regions = ["Tout", "Analamanga", "Vakinankaratra", "Atsinanana"];

export default function RecipeFilters({ onFilter }: { onFilter: (category: string, region: string) => void }) {
    return (
        <div className="flex gap-4">
            {/* Filtre Catégorie */}
            <Select onValueChange={(value) => onFilter(value, "")}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Filtre Région */}
            <Select onValueChange={(value) => onFilter("", value)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                    {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                            {region}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
