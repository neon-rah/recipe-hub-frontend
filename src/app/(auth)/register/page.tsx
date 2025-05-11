"use client";

import { GiChefToque } from "react-icons/gi";
import { useCallback, useState, useEffect } from "react";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FORM_RULES } from "@/config/formRules";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {BiArrowBack} from "react-icons/bi";

export default function RegisterPage() {
    const { initiateRegistration, completeRegistration, resendCode } = useAuth();
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
    const [code, setCode] = useState("");
    const [isVerificationStep, setIsVerificationStep] = useState(false);
    const [needsPassword, setNeedsPassword] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const isFormValid = Object.values(formValidity).every(Boolean);

    // Sauvegarder les données dans sessionStorage (sauf password)
    const saveFormDataToSessionStorage = () => {
        const dataToStore = {
            lastName: formValues.lastName,
            firstName: formValues.firstName,
            address: formValues.address,
            email: formValues.email,
            image: image ? { name: image.name } : null,
            isVerificationStep: true,
        };
        sessionStorage.setItem("registrationData", JSON.stringify(dataToStore));
    };

    // Charger les données depuis sessionStorage
    const loadFormDataFromSessionStorage = () => {
        const data = sessionStorage.getItem("registrationData");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setFormValues(prev => ({
                    ...prev,
                    lastName: parsedData.lastName || "",
                    firstName: parsedData.firstName || "",
                    address: parsedData.address || "",
                    email: parsedData.email || "",
                }));
                setFormValidity({
                    lastName: FORM_RULES.lastName.regex.test(parsedData.lastName || ""),
                    firstName: FORM_RULES.firstName.regex.test(parsedData.firstName || ""),
                    address: FORM_RULES.address.regex.test(parsedData.address || ""),
                    email: FORM_RULES.email.regex.test(parsedData.email || ""),
                    password: false,
                    confirmPassword: false,
                    image: false, // Image doit être resélectionnée
                });
                setIsVerificationStep(parsedData.isVerificationStep || false);
                if (parsedData.isVerificationStep) {
                    setNeedsPassword(true);
                    toast({
                        title: "Session Restored",
                        description: "Please re-enter your password and re-select your profile picture.",
                    });
                }
                setImage(null); // File object cannot be restored
            } catch (err) {
                console.error("Error parsing sessionStorage data:", err);
                clearFormDataFromSessionStorage();
            }
        }
    };

    // Effacer les données de sessionStorage
    const clearFormDataFromSessionStorage = () => {
        sessionStorage.removeItem("registrationData");
    };

    // Charger les données au montage du composant
    useEffect(() => {
        loadFormDataFromSessionStorage();
    }, []);

    const handleRegistrationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isFormValid) {
            toast({
                variant: "destructive",
                title: "Form Invalid",
                description: "Please fill out all fields correctly, including selecting a profile picture.",
            });
            return;
        }

        try {
            await initiateRegistration(formValues.email);
            saveFormDataToSessionStorage();
            setIsVerificationStep(true);
            setNeedsPassword(false); // Password déjà saisi
            toast({
                title: "Code Sent",
                description: "A verification code has been sent to your email.",
            });
        } catch (err: any) {
            const errorMessage = err.message.includes("Multipart")
                ? "Failed to process request. Please try again."
                : err.message || "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Initiation Failed",
                description: errorMessage,
            });
        }
    };

    const handleVerificationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!code || !/^\d{6}$/.test(code)) {
            toast({
                variant: "destructive",
                title: "Code Invalid",
                description: "Please enter a valid 6-digit code.",
            });
            return;
        }

        if (needsPassword && (!formValues.password || formValues.password !== formValues.confirmPassword)) {
            toast({
                variant: "destructive",
                title: "Password Required",
                description: "Please re-enter your password correctly.",
            });
            return;
        }

        if (needsPassword && !image) {
            toast({
                variant: "destructive",
                title: "Profile Picture Required",
                description: "Please select a profile picture.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("lastName", formValues.lastName);
        formData.append("firstName", formValues.firstName);
        formData.append("address", formValues.address);
        formData.append("email", formValues.email);
        formData.append("password", formValues.password);
        formData.append("code", code);
        if (image) formData.append("profilePic", image);

        try {
            await completeRegistration(formData);
            clearFormDataFromSessionStorage();
            toast({
                title: "Registration Successful",
                description: "Redirecting to home...",
            });
            router.push("/home");
        } catch (err: any) {
            const errorMessage = err.message || "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: errorMessage,
            });
        }
    };

    const handleResendCode = async () => {
        try {
            await resendCode(formValues.email);
            toast({
                title: "Code Resent",
                description: "A new verification code has been sent to your email.",
            });
        } catch (err: any) {
            const errorMessage = err.message || "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Resend Code Failed",
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
        setCode("");
        setIsVerificationStep(false);
        setNeedsPassword(false);
        clearFormDataFromSessionStorage();
        const form = document.querySelector("form");
        if (form) form.reset();
    };

    return (
        <div className="flex w-screen min-h-full  flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className={""}>
                <Button size={"icon"} onClick={()=> router.push("/login")}>
                    <BiArrowBack/>
                </Button>

            </div>
            <div className="w-full max-w-3xl mx-auto">
                <div className="flex flex-col items-center justify-center mb-8">
                    <GiChefToque className="text-primary-100" size={50} />
                    <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-text dark:text-text-dark">
                        { !isVerificationStep ? "Register to Kaly'Art" :  "Enter Verification Code"}
                    </h2>
                </div>
                {!isVerificationStep ? (
                    <form onSubmit={handleRegistrationSubmit} className="flex items-center flex-col sm:flex-row justify-center gap-8">
                        <div className="flex w-full max-w-md flex-col items-center space-y-6">
                            <ImageUpload
                                onImageSelect={handleImageSelect}
                                shape="round"
                                required={true}
                                className="border border-neutral-80 dark:border-neutral-border-dark"
                            />
                            {image && <p className="text-sm text-neutral-100 dark:text-neutral-dark">Selected file: {image.name}</p>}
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
                        <div className="w-full max-w-md flex flex-col gap-4">
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
                            <div className="mt-6 flex gap-4 justify-end">
                                <Button
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
                                >
                                    Register
                                </Button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerificationSubmit} className="flex w-full max-w-md flex-col items-center justify-center gap-6 mx-auto">

                        <Input
                            label="Verification Code"
                            name="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            regex={/^\d{6}$/}
                            errorMessage="Code must be a 6-digit number"
                        />
                        {needsPassword && (
                            <>
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
                            </>
                        )}
                        {needsPassword && (
                            <div className="w-full">
                                <p className="text-sm text-neutral-100 dark:text-neutral-dark mb-2">
                                    Please select your profile picture again (required).
                                </p>
                                <ImageUpload
                                    onImageSelect={handleImageSelect}
                                    shape="round"
                                    required={true}
                                    className="border border-neutral-80 dark:border-neutral-border-dark"
                                />
                                {image && <p className="text-sm text-neutral-100 dark:text-neutral-dark mt-2">Selected file: {image.name}</p>}
                            </div>
                        )}
                        {!needsPassword && image && (
                            <div className="w-full text-center">
                                <p className="text-sm text-neutral-100 dark:text-neutral-dark">
                                    Profile picture: {image.name}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-4 mt-4">
                            <Button
                                type="button"
                                variant={"ghost"}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant={"outline"}
                                onClick={handleResendCode}
                            >
                                Resend Code
                            </Button>
                            <Button
                                type="submit"
                                variant={"default"}
                                disabled={!/^\d{6}$/.test(code) || (needsPassword && (!formValues.password || formValues.password !== formValues.confirmPassword || !image))}
                            >
                                Verify
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}