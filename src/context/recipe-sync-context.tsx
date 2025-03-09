// /app/contexts/recipe-sync-context.tsx
"use client";

import { createContext, useContext, useState } from "react";

interface RecipeSyncState {
    likedStates: Record<number, boolean>;
    savedStates: Record<number, boolean>;
    likeCounts: Record<number, number>;
    setLiked: (recipeId: number, liked: boolean) => void;
    setSaved: (recipeId: number, saved: boolean) => void;
    setLikeCount: (recipeId: number, count: number) => void;
    setInitialStates: (
        likedStates: Record<number, boolean>,
        savedStates: Record<number, boolean>,
        likeCounts: Record<number, number>
    ) => void;
}

const RecipeSyncContext = createContext<RecipeSyncState | undefined>(undefined);

export function RecipeSyncProvider({ children }: { children: React.ReactNode }) {
    const [likedStates, setLikedStates] = useState<Record<number, boolean>>({});
    const [savedStates, setSavedStates] = useState<Record<number, boolean>>({});
    const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

    const setLiked = (recipeId: number, liked: boolean) => {
        setLikedStates((prev) => ({ ...prev, [recipeId]: liked }));
    };

    const setSaved = (recipeId: number, saved: boolean) => {
        setSavedStates((prev) => ({ ...prev, [recipeId]: saved }));
    };

    const setLikeCount = (recipeId: number, count: number) => {
        console.log("liked count appeller");
        setLikeCounts((prev) => ({ ...prev, [recipeId]: count }));
    };

    const setInitialStates = (
        likedStates: Record<number, boolean>,
        savedStates: Record<number, boolean>,
        likeCounts: Record<number, number>
    ) => {
        setLikedStates(likedStates);
        setSavedStates(savedStates);
        setLikeCounts(likeCounts);
    };

    return (
        <RecipeSyncContext.Provider value={{ likedStates, savedStates, likeCounts, setLiked, setSaved, setLikeCount, setInitialStates }}>
            {children}
        </RecipeSyncContext.Provider>
    );
}

export function useRecipeSync() {
    const context = useContext(RecipeSyncContext);
    if (!context) {
        throw new Error("useRecipeSync must be used within a RecipeSyncProvider");
    }
    return context;
}