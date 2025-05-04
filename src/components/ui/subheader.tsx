"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BiUser } from "react-icons/bi";

interface SubHeaderProps {
    name: string;
    icon?: ReactNode;
    sticky?: boolean;
    size?: "md" | "lg";
    rightContent?: ReactNode;
    hideLeftContent?: boolean;
}

const sizeVariants = {
    padding: {
        md: "px-4 py-3",
        lg: "px-6 py-4",
    },
    text: {
        md: "text-lead",
        lg: "text-subtitle-3",
    },
};

export function SubHeader({
                              name,
                              icon = <BiUser className="text-icon" />,
                              sticky = false,
                              size = "md",
                              rightContent = null,
                              hideLeftContent = false,
                          }: SubHeaderProps) {
    return (
        <div
            className={cn(
                "flex select-none gap-6 max-md:gap-3 w-full justify-between items-center z-30 rounded-md shadow-soft dark:shadow-dark-soft bg-background dark:bg-background-dark",
                sizeVariants.padding[size],
                sticky && "sticky top-0"
            )}
        >
            {!hideLeftContent && (
                <div
                    className={cn(
                        "flex items-center gap-2 text-text dark:text-text-dark font-bold text-nowrap",
                        sizeVariants.text[size]
                    )}
                >
                    {icon}
                    <span className="text-primary-100 dark:text-accent">{name}</span>
                </div>
            )}
            {rightContent && <div className="w-full flex justify-end">{rightContent}</div>}
        </div>
    );
}