"use client";

import { useEffect, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    size?: "default" | "sm" | "lg" | "full";
    radius?: "default" | "sm" | "lg" | "full";
    value?: string;
    onSearch?: (query: string) => void;
    setValue?: (value: string) => void;
    variant?: "outline" | "ghost" | "secondary" | "destructive" | "default" | "link";
    block?: boolean;
}

export default function SearchBar({
                                      className = "",
                                      placeholder = "Search something...",
                                      size = "default",
                                      radius = "default",
                                      value = "",
                                      onSearch = () => {
                                          console.log("[SearchBar] Default onSearch called");
                                      },
                                      setValue = () => {
                                          console.log("[SearchBar] Default setValue called");
                                      },
                                      variant = "outline",
                                      block = false,
                                  }: SearchBarProps) {
    const [query, setQuery] = useState(value);

    useEffect(() => {
        console.log("[SearchBar] Value prop updated to:", value);
        setQuery(value);
    }, [value]);

    const handleSearch = () => {
        console.log("[SearchBar] handleSearch triggered with query:", query);
        if (query.trim()) {
            console.log("[SearchBar] Calling onSearch with query:", query);
            onSearch(query);
        } else {
            console.log("[SearchBar] Query is empty, no search triggered");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("[SearchBar] Input changed to:", e.target.value);
        setQuery(e.target.value);
        setValue(e.target.value);
    };

    return (
        <div
            className={`flex items-center border border-neutral-80 dark:border-neutral-border-dark rounded-${radius} overflow-hidden bg-background dark:bg-background-dark shadow-soft dark:shadow-dark-soft ${
                block ? "w-full" : "max-w-md"
            } ${className}`}
        >
            <Button
                variant={variant}
                size="icon"
                onClick={() => {                    
                    handleSearch();
                }}
                className="text-primary-100 dark:text-primary-dark dark:text-accent hover:text-primary-80 dark:hover:text-primary-dark"
            >
                <BiSearch className="w-5 h-5" />
            </Button>
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                onKeyDown={(e) => {
                    console.log("[SearchBar] Key pressed:", e.key);
                    if (e.key === "Escape") {
                        console.log("[SearchBar] Escape pressed, clearing query");
                        setQuery("");
                        setValue("");
                        onSearch("");
                    } else if (e.key === "Enter") {
                        console.log("[SearchBar] Enter pressed, triggering search");
                        handleSearch();
                    }
                }}
                className="flex-1 border-none bg-transparent text-text dark:text-text-dark placeholder:text-text-secondary dark:placeholder:text-text-dark-secondary focus:outline-none h-11 m-0 p-0 ring-0 focus:ring-0"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {                        
                        setQuery("");
                        setValue("");
                        onSearch("");
                    }}
                    className="text-neutral-dark dark:text-neutral-dark hover:text-alert dark:text-neutral dark:hover:text-alert-dark"
                >
                    <BiX className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
}