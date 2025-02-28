"use client";


import RecipeFilters from "@/components/features/RecipeFilters";
import ExpandableSearchBar from "@/components/ui/expandable-search-bar";

export default function SubHeader({ onSearch, onFilter }: { onSearch: (query: string) => void; onFilter: (category: string, region: string) => void }) {
    return (
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <ExpandableSearchBar onSearch={onSearch} />
            <RecipeFilters onFilter={onFilter} />
        </div>
    );
}
