"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
    label?: string;
    regex?: RegExp | ((value: string) => boolean);
    errorMessage?: string;
    requirementMessage?: string;
    onValidationChange?: (isValid: boolean, value?: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            label,
            regex,
            errorMessage,
            requirementMessage,
            onValidationChange,
            value: controlledValue,
            onChange: controlledOnChange,
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = useState("");
        const [isValid, setIsValid] = useState<boolean | null>(null);
        const [isTouched, setIsTouched] = useState(false);
        const [showPassword, setShowPassword] = useState(false);

        const value = controlledValue !== undefined ? controlledValue : internalValue;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;

            if (controlledOnChange) {
                controlledOnChange(e);
            } else {
                setInternalValue(val);
            }
            setIsTouched(true);

            let valid: boolean | null = null;
            if (regex) {
                valid = regex instanceof RegExp ? regex.test(val) : regex(val);
                setIsValid(valid);
            } else {
                valid = val.length > 0;
                setIsValid(valid);
            }

            onValidationChange?.(valid ?? true, val);
        };

        const getBorderClass = () => {
            if (!isTouched) return "border-neutral-80 dark:border-neutral-border-dark";
            if (isValid === null) return "border-neutral-80 dark:border-neutral-border-dark";
            return isValid
                ? "border-tertiary dark:border-tertiary-dark focus:ring-tertiary-60 dark:focus:ring-tertiary-dark"
                : "border-red-400 dark:border-red-400 focus:ring-alert-60 dark:focus:ring-alert-dark";
        };

        return (
            <div className="w-full relative">
                {label && (
                    <label className="block pl-1 text-sm font-semibold mb-1 text-text dark:text-text-dark">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        name={props.name}
                        type={type === "password" ? (showPassword ? "text" : "password") : type}
                        value={value}
                        className={cn(
                            "flex h-11 w-full rounded-md border px-4 py-3 text-base shadow-soft dark:shadow-dark-soft transition-colors focus:outline-none focus:ring-2",
                            getBorderClass(),
                            "bg-background dark:bg-background-dark text-text dark:text-text-dark placeholder:text-text-secondary dark:placeholder:text-text-dark-secondary",
                            className
                        )}
                        ref={ref}
                        onChange={handleChange}
                        {...props}
                    />
                    {/* Bouton pour montrer/masquer le mot de passe (désactivé pour l’instant)
          {type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-neutral-100 dark:text-neutral-dark hover:text-neutral-80 dark:hover:text-neutral-border-dark"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          */}
                </div>
                {isTouched && requirementMessage && (
                    <p className="mt-1 text-sm text-neutral-100 dark:text-neutral-dark">{requirementMessage}</p>
                )}
                {isTouched && isValid === false && errorMessage && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-500">{errorMessage}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };