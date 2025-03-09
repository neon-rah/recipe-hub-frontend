"use client";

import { create } from "zustand";

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

export const useRecipeSyncStore = create<RecipeSyncState>((set) => ({
    likedStates: {},
    savedStates: {},
    likeCounts: {},

    setLiked: (recipeId: number, liked: boolean) =>
        set((state) => ({
            likedStates: { ...state.likedStates, [recipeId]: liked },
        })),

    setSaved: (recipeId: number, saved: boolean) =>
        set((state) => ({
            savedStates: { ...state.savedStates, [recipeId]: saved },
        })),

    setLikeCount: (recipeId: number, count: number) =>
        set((state) => ({
            likeCounts: { ...state.likeCounts, [recipeId]: count },
        })),

    setInitialStates: (
        likedStates: Record<number, boolean>,
        savedStates: Record<number, boolean>,
        likeCounts: Record<number, number>
    ) => set({ likedStates, savedStates, likeCounts }),
}));