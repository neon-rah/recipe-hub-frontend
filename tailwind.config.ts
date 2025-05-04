/** @type {import('tailwindcss').Config} */
import { type Config } from "tailwindcss";
import daisyui from "daisyui";
import tailwindcss_animate from "tailwindcss-animate";
import tailwind_scrollbar from "tailwind-scrollbar";

const config: Config = {
    darkMode: "class", // Mode sombre activé via la classe 'dark'
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Couleur principale : Espresso
                primary: {
                    DEFAULT: "#5C4033",      // Brun espresso
                    dark: "#3F2A1D",         // Variante sombre (hover/mode sombre)
                    100: "#5C4033",          // 100% opacité
                    80: "#5C4033cc",         // 80% opacité (hover)
                    60: "#5C403399",         // 60% opacité (focus/subtil)
                    40: "#5C403366",         // 40% opacité (disabled)
                    20: "#5C403333",         // 20% opacité (fond léger)
                    10: "#5C40331a",         // 10% opacité (effet subtil)
                },
                // Couleur secondaire : Navy
                secondary: {
                    DEFAULT: "#1E3A5F",
                    dark: "#152A47",
                    "dark-mode": "#7DA1C4",  // New lighter blue for dark mode
                    100: "#1E3A5F",
                    80: "#1E3A5Fcc",
                    60: "#1E3A5F99",
                    40: "#1E3A5F66",
                    20: "#1E3A5F33",
                    10: "#1E3A5F1a",
                    "dark-mode-100": "#7DA1C4",  // 100% opacity for dark mode
                    "dark-mode-80": "#7DA1C4cc", // 80% opacity (hover)
                    "dark-mode-60": "#7DA1C499", // 60% opacity (focus/subtil)
                    "dark-mode-40": "#7DA1C466", // 40% opacity (disabled)
                    "dark-mode-20": "#7DA1C433", // 20% opacity (fond léger)
                    "dark-mode-10": "#7DA1C41a", // 10% opacity (effet subtil)
                },
                // Fond
                background: {
                    DEFAULT: "#F8F1E9",      // Crème léger (mode clair)
                    secondary: "#FEFBF7",    // Crème blanc (cartes/popups, mode clair)
                    dark: "#2A2522",         // Gris café foncé (mode sombre)
                    "dark-secondary": "#3B3331", // Gris brun (cartes/popups, mode sombre)
                    "dark-tertiary": "#2A2223",
                },
                // Texte
                text: {
                    DEFAULT: "#3C2F2F",      // Marron café (mode clair)
                    secondary: "#7D6B6B",    // Gris brun clair (mode clair)
                    dark: "#F2EAE1",         // Crème clair (mode sombre)
                    "dark-secondary": "#A89F9A", // Gris moyen (mode sombre)
                },
                // Couleur d’accent : Saffron
                accent: {
                    DEFAULT: "#D9A441",      // Jaune safran
                    dark: "#B58836",         // Variante sombre
                    100: "#D9A441",          // 100% opacité
                    80: "#D9A441cc",         // 80% opacité (hover)
                    60: "#D9A44199",         // 60% opacité (focus/subtil)
                    40: "#D9A44166",         // 40% opacité (disabled)
                    20: "#D9A44133",         // 20% opacité (fond léger)
                    10: "#D9A4411a",         // 10% opacité (effet subtil)
                },
                // Couleur tertiaire : Olive (sans opacités, moins fréquent)
                tertiary: {
                    DEFAULT: "#8A9A5B",      // Vert olive
                    dark: "#6B7845",         // Variante sombre
                },
                // Couleur d’alerte : Brick (sans opacités, usage spécifique)
                alert: {
                    DEFAULT: "#9B3C2F",      // Rouge brique
                    dark: "#7A2F24",         // Variante sombre
                },
                // Neutres
                neutral: {
                    DEFAULT: "#8C8279",      // Gris pierre (mode clair)
                    dark: "#6B635C",         // Gris pierre foncé (mode sombre)
                    border: "#EDE7E3",       // Bordure claire
                    "border-dark": "#5A534F",// Bordure sombre
                    100: "#8C8279",          // 100% opacité
                    80: "#8C8279cc",         // 80% opacité (bordure subtile)
                    60: "#8C827999",         // 60% opacité (fond neutre)
                    40: "#8C827966",         // 40% opacité (disabled)
                    20: "#8C827933",         // 20% opacité (effet léger)
                    10: "#8C82791a",         // 10% opacité (très subtil)
                },
            },
            // Polices personnalisées
            fontFamily: {
                sans: ["Poppins", "sans-serif"], // Corps de texte moderne
                heading: ["Lora", "serif"],      // Titres élégants
            },
            // Tailles de police en rem pour accessibilité
            fontSize: {
                "title-1": ["4rem", { lineHeight: "1.2" }],      // 64px
                "title-2": ["2.875rem", { lineHeight: "1.2" }],  // 46px
                "title-3": ["2.5rem", { lineHeight: "1.2" }],    // 40px
                "subtitle-1": ["2rem", { lineHeight: "1.3" }],   // 32px
                "subtitle-2": ["1.5rem", { lineHeight: "1.3" }], // 24px
                "subtitle-3": ["1.25rem", { lineHeight: "1.4" }],// 20px
                lead: ["1.125rem", { lineHeight: "1.5" }],       // 18px
                base: ["1rem", { lineHeight: "1.5" }],           // 16px
                "small-1": ["0.875rem", { lineHeight: "1.5" }],  // 14px
                "small-2": ["0.75rem", { lineHeight: "1.5" }],   // 12px
                "small-3": ["0.6875rem", { lineHeight: "1.5" }], // 11px
                icon: ["1.25rem", { lineHeight: "1" }],          // 20px
            },
            // Ombres personnalisées
            boxShadow: {
                soft: "0 4px 6px rgba(0, 0, 0, 0.1)",           // Ombre légère (clair)
                "dark-soft": "0 4px 6px rgba(0, 0, 0, 0.3)",    // Ombre sombre
            },
        },
    },
    plugins: [daisyui, tailwindcss_animate, tailwind_scrollbar],
    daisyui: {
        themes: [
            {
                light: {
                    primary: "#5C4033",      // Espresso
                    secondary: "#1E3A5F",    // Navy
                    accent: "#D9A441",       // Saffron
                    "base-100": "#F8F1E9",   // Fond principal (crème)
                    neutral: "#8C8279",      // Gris pierre
                    "--rounded-btn": "0.5rem", // Coins arrondis personnalisés
                },
                dark: {
                    primary: "#5C4033",      // Espresso (inchangé pour cohérence)
                    secondary: "#1E3A5F",    // Navy
                    accent: "#D9A441",       // Saffron
                    "base-100": "#2A2522",   // Fond principal (gris café foncé)
                    neutral: "#6B635C",      // Gris pierre foncé
                    "--rounded-btn": "0.5rem",
                },
            },
        ],
    },
};

export default config;