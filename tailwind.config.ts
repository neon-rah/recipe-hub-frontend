import  { type Config } from "tailwindcss";
import daisyui from "daisyui";
import tailwindcss_animate from "tailwindcss-animate";


import tailwind_scrollbar from "tailwind-scrollbar";

const config: Config = {
    darkMode: "class", // Active le mode sombre via une classe CSS
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#F4A261", // Orange doux en mode clair
                    dark: "#E76F51", // Orange brûlé en mode sombre
                },
                secondary: {
                    DEFAULT: "#6B7280", // Vert olive clair
                    dark: "#374151", // Gris foncé en mode sombre
                },
                background: {
                    DEFAULT: "#FFF8E7", // Crème clair en mode clair
                    dark: "#121212", // Noir profond en mode sombre
                },
                text: {
                    DEFAULT: "#3C2F2F", // Marron foncé en mode clair
                    dark: "#E5E7EB", // Gris clair en mode sombre
                },
                accent: {
                    DEFAULT: "#FAE1C3", // Beige doux en mode clair
                    dark: "#333333", // Noir cassé en mode sombre
                },
            },
            fontFamily: {
                sans: ["Poppins", "sans-serif"], // Plus moderne et lisible
                serif: ["Lora", "serif"],
            },
            fontSize: {
                "title-1": "64px",
                "title-2": "46px",
                "title-3": "40px",
                "subtitle-1": "32px",
                "subtitle-2": "24px",
                "subtitle-3": "20px",
                lead: "18px",
                base: "16px",
                "small-1": "14px",
                "small-2": "12px",
                "small-3" : "11px",
                icon: "20px",
            },
        },
    },
    plugins: [daisyui, tailwindcss_animate,tailwind_scrollbar],
    daisyui: {
        themes: [
            {
                light: {
                    primary: "#F4A261",
                    secondary: "#6B7280",
                    accent: "#FAE1C3",
                    base: "#FFF8E7",
                    neutral: "#3C2F2F",
                    text: "#3C2F2F",
                },
                dark: {
                    primary: "#E76F51",
                    secondary: "#374151",
                    accent: "#333333",
                    base: "#121212",
                    neutral: "#E5E7EB",
                    text: "#E5E7EB",
                },
            },
        ],
    },
};

export default config;
