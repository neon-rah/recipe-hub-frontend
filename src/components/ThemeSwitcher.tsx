"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-primary dark:bg-secondary transition-transform transform hover:scale-110"
        >
            {theme === "light" ? (
                <FaMoon className="text-black dark:text-white" size={20} />
            ) : (
                <FaSun className="text-white dark:text-yellow-400" size={20} />
            )}
        </button>
    );
}
