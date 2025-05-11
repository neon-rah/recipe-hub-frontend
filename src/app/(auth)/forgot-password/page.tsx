"use client";

import { GiChefToque } from "react-icons/gi";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FORM_RULES } from "@/config/formRules";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { BiArrowBack } from "react-icons/bi";

export default function ForgotPasswordPage() {
    const { initiatePasswordReset } = useAuth();
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValidEmail) {
            toast({
                variant: "destructive",
                title: "Form Invalid",
                description: "Please enter a valid email address.",
            });
            return;
        }

        try {
            const response = await initiatePasswordReset(email);
            if (response.success) {
                toast({
                    title: "Success",
                    description: response.message,
                });
                router.push("/login");
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: response.message,
                });
            }
        } catch (err: any) {
            const errorMessage = err.message || "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        }
    };

    const handleValidationChange = (isValid: boolean, value?: string) => {
        setIsValidEmail(isValid);
        if (value !== undefined) {
            setEmail(value);
        }
    };

    return (
        <div className="flex w-screen min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className={""}>
                <Button size={"icon"} onClick={() => router.push("/login")}>
                    <BiArrowBack />
                </Button>
            </div>
            <div className="w-full max-w-3xl mx-auto">
                <div className="flex flex-col items-center justify-center mb-8">
                    <GiChefToque className="text-primary-100" size={50} />
                    <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-text dark:text-text-dark">
                        Forgot Password
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col items-center justify-center gap-6 mx-auto">
                    <Input
                        label="Email"
                        regex={FORM_RULES.email.regex}
                        errorMessage={FORM_RULES.email.errorMessage}
                        name="email"
                        value={email}
                        onValidationChange={handleValidationChange}
                    />
                    <div className="flex gap-4 mt-4">
                        <Button
                            type="button"
                            variant={"ghost"}
                            onClick={() => router.push("/login")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={"default"}
                            disabled={!isValidEmail}
                        >
                            Send Reset Link
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}