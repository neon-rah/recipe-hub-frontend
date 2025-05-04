import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary-100 text-white shadow-soft dark:shadow-dark-soft hover:bg-primary-80 dark:hover:bg-primary-100 dark:focus:ring-primary-dark",
                destructive:
                    "bg-alert text-sm text-white shadow-soft dark:shadow-dark-soft hover:bg-alert-dark dark:hover:bg-alert-dark focus:ring-alert-60 dark:focus:ring-alert-dark",
                outline:
                    "border text-sm p-0 text-text dark:text-white border-none shadow-none ring-1 bg-background dark:bg-background-dark  hover:bg-neutral-20 dark:hover:bg-neutral-dark focus:ring-neutral-60 dark:focus:ring-neutral-dark",
                secondary:
                    "bg-secondary-100 p-0 m-0 text-white shadow-soft dark:shadow-dark-soft hover:bg-secondary-80 dark:hover:bg-secondary-dark-mode-80 focus:ring-secondary-60 dark:focus:ring-secondary-dark-mode-60",
                ghost:
                    " bg-transparent hover:bg-neutral-20 dark:hover:bg-neutral-dark text-text dark:text-text-dark focus:ring-neutral-60 dark:focus:ring-neutral-dark",
                link:
                    "text-secondary-100 dark:text-secondary-dark-mode underline-offset-4 hover:underline focus:ring-secondary-60 dark:focus:ring-secondary-dark-mode-60",
            },
            size: {
                default: "h-11 px-4 py-3",
                sm: "h-9 rounded-md px-3 text-sm",
                lg: "h-12 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };