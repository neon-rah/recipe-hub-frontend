"use client";

import {useEffect, useState} from "react";
import { BiSearch, BiX } from "react-icons/bi"; // Import des icônes React
import { Input } from "@/components/ui/input"; // Composant personnalisé shadcn
import { Button } from "@/components/ui/button"; // Bouton personnalisé shadcn

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    size?: "default" | "sm" | "lg" | "full";
    radius?: "default" | "sm" | "lg" | "full";
    value?: string;
    onSearch?: (query: string) => void;
    setValue?: (value: string) => void;
    variant?: "outline" | "ghost"| "secondary"|"destructive"| "default"|"link";
    block?: boolean;
}

export default function SearchBar({
                                      className = "",
                                      placeholder = "Search something...",
                                      size = "default",
                                      radius = "default",
                                      value = "",
                                      onSearch = () => {},
                                      setValue = () => {},
                                      variant = "outline",
                                      block = false,
                                  }: SearchBarProps) {
    const [query, setQuery] = useState(value);

    // Synchroniser query avec la valeur de la prop value
    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Gérer la soumission de la recherche
    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
            setQuery(""); // Réinitialiser le champ après la recherche
        }
    };
    // Gérer les changements de valeur et propager l'état vers le parent
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setValue(e.target.value); // Si setValue est défini, propager la valeur vers le parent
    };

    return (
        <div
            className={`flex items-center  border border-primary rounded-${radius} overflow-hidden bg-black-10 dark:bg-black-90 
                ${block ? "w-full" : "max-w-md"} ${className}`}
        >
            {/* Bouton de recherche */}
            <Button
                variant={variant}
                size="icon"
                onClick={handleSearch}
                className="text-primary hover:text-primary-dark"
            >
                <BiSearch className="w-5 h-5" />
            </Button>

            {/* Champ de recherche */}
            <Input
                type="text"                 
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setQuery(""); // Réinitialiser avec Escape
                    } else if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
                className="flex-1 border-none bg-transparent text-black-80 placeholder:text-black-60 dark:text-white-80 dark:placeholder:text-white-60 focus:outline-none h-[30px] m-0 p-0 ring-0 focus:ring-0"
            />

            {/* Bouton de suppression */}
            {query && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuery("")}
                    className="text-gray-500 hover:text-red-500"
                >
                    <BiX className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
}
