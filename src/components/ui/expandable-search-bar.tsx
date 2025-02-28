"use client";

import { useState } from "react";
import { BiSearch, BiX, BiFilter } from "react-icons/bi"; // Icônes React
import SearchBar from "./searchbar"; // Import du SearchBar déjà converti
import { Button } from "@/components/ui/button"; // Bouton personnalisé shadcn

interface ExpandableSearchBarProps {
    className?: string;
    placeholder?: string;
    size?: "default" | "sm" | "lg"| "full";
    radius?: "default" | "sm" | "lg" | "full";
    value?: string;
    setValue?: (value: string) => void;
    onFilterClick?: () => void;
    onSearch?: (query:string) => void;
    variant?: "outline" | "ghost"| "secondary"|"destructive"| "default"|"link";
    filter?: boolean;
    block?: boolean;
    expanded?: boolean;
}

export default function ExpandableSearchBar({
                                                className = "",
                                                placeholder = "Search something...",
                                                size = "sm",
                                                radius = "full",
                                                value = "",
                                                setValue = () => {},
                                                onFilterClick = () => {},
                                                onSearch = () => {},
                                                variant = "ghost",
                                                filter = false,
                                                block = true,
                                                expanded = false,
                                            }: ExpandableSearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(expanded);

    return (
        <div className={`flex items-center m-0 gap-1 overflow-hidden ${className}`}>
            {/* Bouton pour ouvrir le champ de recherche */}
            {!isExpanded ? (
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setIsExpanded(true)}
                >
                    <BiSearch className="w-5 h-5" />
                </Button>
            ) : (
                <>
                    <SearchBar
                        radius={radius}
                        block={block}
                        placeholder={placeholder}
                        setValue={(newValue: string) => {
                            setValue(newValue);                            
                        }}
                        size={size}
                        variant={variant}
                        value={value}
                    />

                    {/* Bouton pour filtrer (si activé) */}
                    {filter && (
                        <Button variant="secondary" size="icon" onClick={onFilterClick}>
                            <BiFilter className="w-5 h-5" />
                        </Button>
                    )}

                    {/* Bouton pour fermer la barre de recherche */}
                    <Button
                        variant="default"
                        className={"rounded-full w-6 h-6 bg-red-500 hover:bg-red-600"}
                        size="icon"
                        onClick={() => {
                            setValue?.(""); // Réinitialise la recherche
                            setIsExpanded(false);
                        }}
                    >
                        <BiX className="text-white hover:text-red-500" />
                    </Button>
                </>
            )}
        </div>
    );
}
