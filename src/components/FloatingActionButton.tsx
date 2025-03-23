// components/FloatingActionButton.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUtensils } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {ChefHat} from "lucide-react";

export default function FloatingActionButton() {
    const router = useRouter();
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [dragging, setDragging] = React.useState(false);
    const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });
    const [windowSize, setWindowSize] = React.useState({ width: 0, height: 0 });
    const [moved, setMoved] = React.useState(false); // Suivre si un déplacement a eu lieu

    // Constantes
    const buttonSize = 64; // w-16 h-16 ≈ 64px
    const initialRight = 20; // px
    const initialBottom = windowSize.width < 768 ? 80 : 20; // px, ajusté pour mobile

    // Mettre à jour les dimensions de l’écran et position initiale
    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setWindowSize({ width, height });
            const initialX = width - buttonSize - initialRight;
            const initialY = height - buttonSize - (width < 768 ? 80 : 20);
            setPosition({ x: initialX, y: initialY });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Gestion du drag (souris)
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true);
        setMoved(false); // Réinitialiser moved au début du drag
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dragging) return;
        e.preventDefault();
        const newX = e.clientX - startPos.x;
        const newY = e.clientY - startPos.y;
        updatePosition(newX, newY);
        // Détecter un déplacement significatif (ex. > 5px)
        if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
            setMoved(true);
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    // Gestion du drag (tactile)
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setDragging(true);
        setMoved(false); // Réinitialiser moved au début du drag
        const touch = e.touches[0];
        setStartPos({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!dragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const newX = touch.clientX - startPos.x;
        const newY = touch.clientY - startPos.y;
        updatePosition(newX, newY);
        // Détecter un déplacement significatif (ex. > 5px)
        if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
            setMoved(true);
        }
    };

    const handleTouchEnd = () => {
        setDragging(false);
    };

    // Mettre à jour la position avec contraintes
    const updatePosition = (newX: number, newY: number) => {
        const navbarHeightMobile = windowSize.width < 768 ? 60 : 0;
        const constrainedX = Math.max(0, Math.min(windowSize.width - buttonSize, newX));
        const constrainedY = Math.max(0, Math.min(windowSize.height - buttonSize - navbarHeightMobile, newY));
        setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleClick = () => {
        if (!dragging && !moved) {
            router.push("/publish"); 
        }
    };

    // Vérifier si on est côté client
    if (typeof window === "undefined") {
        return null;
    }

    return (
        <div
            className={cn(
                "fixed w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg",
                dragging ? "opacity-75 cursor-grabbing" : "cursor-pointer hover:bg-primary-dark"
            )}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 1000,
                touchAction: "none", // Désactive les gestes par défaut sur mobile
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
        >
            <ChefHat size={24} />
        </div>
    );
}