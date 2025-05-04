"use client";

import { GiChefToque } from "react-icons/gi";
import { useCallback, useState } from "react";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FORM_RULES } from "@/config/formRules";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
    const { register } = useAuth();
    const [image, setImage] = useState<File | null>(null);
    const [formValues, setFormValues] = useState({
        lastName: "",
        firstName: "",
        address: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [formValidity, setFormValidity] = useState({
        lastName: false,
        firstName: false,
        address: false,
        email: false,
        password: false,
        confirmPassword: false,
        image: false,
    });
    const router = useRouter();
    const { toast } = useToast();

    const isFormValid = Object.values(formValidity).every(Boolean);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isFormValid) {
            toast({
                variant: "destructive",
                title: "Form Invalid",
                description: "Please fill out all fields correctly.",
            });
            return;
        }

        const formData = new FormData(event.currentTarget);
        if (image) formData.append("profilePic", image);

        try {
            await register(formData);
            toast({
                title: "Registration Successful",
                description: "Redirecting to home...",
            });
            router.push("/home");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: errorMessage,
            });
        }
    };

    const handleValidationChange = (field: string) => (isValid: boolean, value?: string) => {
        setFormValidity(prev => ({
            ...prev,
            [field]: isValid,
        }));
        if (value !== undefined) {
            setFormValues(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleImageSelect = useCallback((file: File | null) => {
        setImage(file);
        handleValidationChange("image")(file !== null);
    }, []);

    const handleCancel = () => {
        setImage(null);
        setFormValues({
            lastName: "",
            firstName: "",
            address: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setFormValidity({
            lastName: false,
            firstName: false,
            address: false,
            email: false,
            password: false,
            confirmPassword: false,
            image: false,
        });
        const form = document.querySelector("form");
        if (form) form.reset();
    };

    return (
        <div
            className="flex flex-col w-full min-h-screen justify-center items-center px-4 py-6 sm:px-6 sm:py-12 overflow-y-auto">
            <>
                <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
                    <GiChefToque className="text-primary-100" size={50}/>
                    <h2 className="mt-5 mb-10 text-center text-2xl font-bold tracking-tight text-text dark:text-text-dark">
                        Register to Kaly&#39;Art
                    </h2>
                </div>
            </>
            <form onSubmit={handleSubmit} className="flex w-full justify-center flex-wrap gap-10">
                <div className="flex w-[350px] flex-col items-center space-y-6">

                    <ImageUpload
                        onImageSelect={handleImageSelect}
                        shape="round"
                        required={true}
                        className="border border-neutral-80 dark:border-neutral-border-dark"
                    />
                    {image &&
                        <p className="text-sm text-neutral-100 dark:text-neutral-dark">Selected
                            file: {image.name}</p>}
                    <Input
                        label="Last Name"
                        regex={FORM_RULES.lastName.regex}
                        errorMessage={FORM_RULES.lastName.errorMessage}
                        name="lastName"
                        value={formValues.lastName}
                        onValidationChange={handleValidationChange("lastName")}

                    />
                    <Input
                        label="First Name"
                        regex={FORM_RULES.firstName.regex}
                        errorMessage={FORM_RULES.firstName.errorMessage}
                        name="firstName"
                        value={formValues.firstName}
                        onValidationChange={handleValidationChange("firstName")}

                    />
                </div>

                <div className="w-[350px] flex flex-col gap-4">
                    <Input
                        label="Address"
                        regex={FORM_RULES.address.regex}
                        errorMessage={FORM_RULES.address.errorMessage}
                        name="address"
                        value={formValues.address}
                        onValidationChange={handleValidationChange("address")}

                    />
                    <Input
                        label="Email"
                        regex={FORM_RULES.email.regex}
                        errorMessage={FORM_RULES.email.errorMessage}
                        name="email"
                        value={formValues.email}
                        onValidationChange={handleValidationChange("email")}

                    />
                    <Input
                        label="Password"
                        type="password"
                        regex={FORM_RULES.password.regex}
                        errorMessage={FORM_RULES.password.errorMessage}
                        name="password"
                        value={formValues.password}
                        onValidationChange={handleValidationChange("password")}

                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        regex={(value) => value === formValues.password && value !== ""}
                        errorMessage={formValues.password === "" ? "Please enter a password first" : "Passwords do not match"}
                        value={formValues.confirmPassword}
                        onValidationChange={handleValidationChange("confirmPassword")}

                    />

                    <div className="mt-10 flex gap-6 justify-end">
                        <Button
                            // className="bg-neutral-100 text-text dark:text-text-dark hover:bg-neutral-80 px-4 py-3 rounded-md"
                            type="button"
                            variant={"ghost"}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={"default"}
                            disabled={!isFormValid}
                            // className="bg-primary-100 text-white hover:bg-primary-80 px-4 py-3 rounded-md"
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </form>
            

        </div>
    );
}