"use client";

import { GiChefToque } from "react-icons/gi";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FORM_RULES } from "@/config/formRules";
import useAuth from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { BiArrowBack } from "react-icons/bi";

export default function ResetPasswordPage() {
    const { resetPassword } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;
    const { toast } = useToast();

    useEffect(() => {
        if (!token) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid or missing token.",
            });
            router.push("/forgot-password");
        }
    }, [token, router, toast]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) {
            return; // Déjà géré dans useEffect
        }
        if (!isValidPassword || newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Passwords do not match or are invalid.",
            });
            return;
        }

        try {
            const response = await resetPassword(token, newPassword);
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

    const handlePasswordValidation = (isValid: boolean, value?: string) => {
        setIsValidPassword(isValid);
        if (value !== undefined) {
            setNewPassword(value);
        }
    };

    const handleConfirmPasswordValidation = (isValid: boolean, value?: string) => {
        setIsValidConfirmPassword(isValid);
        if (value !== undefined) {
            setConfirmPassword(value);
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
                        Reset Password
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col items-center justify-center gap-6 mx-auto">
                    <Input
                        label="New Password"
                        type="password"
                        regex={FORM_RULES.password.regex}
                        errorMessage={FORM_RULES.password.errorMessage}
                        name="newPassword"
                        value={newPassword}
                        onValidationChange={handlePasswordValidation}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        regex={(value) => value === newPassword && value !== ""}
                        errorMessage={newPassword === "" ? "Please enter a password first" : "Passwords do not match"}
                        value={confirmPassword}
                        onValidationChange={handleConfirmPasswordValidation}
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
                            disabled={!isValidPassword || !isValidConfirmPassword}
                        >
                            Reset Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}