"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, XCircleIcon } from "lucide-react";

interface ImageUploadProps {
    onImageSelect: (file: File | null) => void;
    className?: string;
    shape?: "round" | "square"; // Choix du style d'affichage
}

export default function ImageUpload({ onImageSelect, className, shape = "round" }: ImageUploadProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const allowedExtensions = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedExtensions.includes(file.type)) {
                setError("Only JPG, JPEG, and PNG files are allowed.");
                return;
            }

            setError(null);
            setImagePreview(URL.createObjectURL(file));
            onImageSelect(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setError(null);
        onImageSelect(null);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/*<Label className="text-sm font-medium text-gray-700">Upload Image</Label>*/}

            <div className={cn("relative w-32 h-32 bg-gray-200 dark:bg-gray-900 flex items-center justify-center overflow-hidden",
                shape === "round" ? "rounded-full" : "rounded-md",
                className
            )}>
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-inherit" />
                        <button
                            type="button"
                            className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md"
                            onClick={handleRemoveImage}
                        >
                            <XCircleIcon className="w-5 h-5 text-red-500" />
                        </button>
                    </>
                ) : (
                    <ImageIcon className="w-10 h-10 text-gray-500" />
                )}
            </div>

            <Input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
            />

            <Button asChild >
                <label htmlFor="file-upload" className="bg-primary dark:bg-primary-dark cursor-pointer">Select Image</label>
            </Button>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
