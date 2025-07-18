"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
// import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
    label?: string;
    regex?: RegExp | ((value: string) => boolean);
    errorMessage?: string;
    requirementMessage?: string;
    onValidationChange?: (isValid: boolean, value?: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, regex, errorMessage, requirementMessage, onValidationChange, value: controlledValue, onChange: controlledOnChange, ...props }, ref) => {
        const [internalValue, setInternalValue] = useState("");
        const [isValid, setIsValid] = useState(false);
        const [isTouched, setIsTouched] = useState(false);
        const [showPassword, setShowPassword] = useState(false);

        // Utiliser la valeur contrôlée si fournie, sinon l'état interne
        const value = controlledValue !== undefined ? controlledValue : internalValue;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;

            // Si contrôlé, appeler onChange du parent
            if (controlledOnChange) {
                controlledOnChange(e);
            } else {
                setInternalValue(val);
            }
            setIsTouched(true);

            let valid = true;
            if (regex) {
                valid = regex instanceof RegExp ? regex.test(val) : regex(val);
                setIsValid(valid);
            }

            onValidationChange?.(valid, val);
        };

        return (
            <div className="w-full relative">
                {label && (<label className="block pl-1 text-sm font-semibold mb-1 text-gray-700">{label}</label>)}
                <div className="relative">
                    <input
                        name={props.name}
                        type={type === "password" ? (showPassword ? "text" : "password") : type}
                        value={value}
                        className={cn(
                            "flex h-11 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 pr-10",
                            !isValid && isTouched ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary",
                            className
                        )}
                        ref={ref}
                        onChange={handleChange}
                        {...props}
                    />
                    {/* {type === "password" && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}*/}
                </div>
                {isTouched && requirementMessage && (
                    <p className="mt-1 text-small-2 text-gray-600 dark:text-gray-600">{requirementMessage}</p>
                )}
                {isTouched && !isValid && errorMessage && (
                    <p className="mt-1 text-small-2 text-red-600 dark:text-red-600">{errorMessage}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };