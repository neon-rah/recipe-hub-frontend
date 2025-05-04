"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Fonction pour trouver l'élément scrollable le plus pertinent
    const getScrollableElement = () => {
        const main = document.querySelector("main");
        const section = document.querySelector("section");
        const aside = document.querySelector("aside");
        const div = document.querySelector("div");

        if (main && main.scrollHeight > main.clientHeight) return main;
        if (section && section.scrollHeight > section.clientHeight) return section;
        if (aside && aside.scrollHeight > aside.clientHeight) return aside;
        if (div && div.scrollHeight > div.clientHeight) return div;
        return document.documentElement;
    };

    useEffect(() => {
        const scrollableElement = getScrollableElement();
        if (!scrollableElement) return;

        const handleScroll = () => {
            setIsVisible(scrollableElement.scrollTop > 100);
        };

        scrollableElement.addEventListener("scroll", handleScroll);
        return () => scrollableElement.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        const scrollableElement = getScrollableElement();
        if (scrollableElement) {
            scrollableElement.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-[160] right-8 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transition-opacity ${
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll to Top"
        >
            <ArrowUp size={24} />
        </button>
    );
}
