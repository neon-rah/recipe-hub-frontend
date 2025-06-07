"use client";


import { useCallback, useState, useEffect } from "react";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FORM_RULES } from "@/config/formRules";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


export default function SettingsPage() {
    const { user, updateUserProfile, changeUserPassword, logout } = useAuth();
    const [image, setImage] = useState<File | null>(null);
    const [profileFormValues, setProfileFormValues] = useState({
        lastName: "",
        firstName: "",
        address: "",
        email: "",
    });
    const [profileFormValidity, setProfileFormValidity] = useState({
        lastName: true,
        firstName: true,
        address: true,
        email: true,
        image: true,
    });
    const [passwordFormValues, setPasswordFormValues] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [passwordFormValidity, setPasswordFormValidity] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false,
    });
    const [activeSection, setActiveSection] = useState<"account" | "security">("account");
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const isProfileFormValid = Object.values(profileFormValidity).every(Boolean);
    const isPasswordFormValid = Object.values(passwordFormValidity).every(Boolean);

    // Charger les données de l'utilisateur au montage
    useEffect(() => {
        if (user) {
            setProfileFormValues({
                lastName: user.lastName || "",
                firstName: user.firstName || "",
                address: user.address || "",
                email: user.email || "",
            });
            setProfileFormValidity({
                lastName: FORM_RULES.lastName.regex.test(user.lastName || ""),
                firstName: FORM_RULES.firstName.regex.test(user.firstName || ""),
                address: FORM_RULES.address.regex.test(user.address || ""),
                email: FORM_RULES.email.regex.test(user.email || ""),
                image: true,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "User not authenticated. Please log in.",
            });
            router.push("/login");
        }
    }, [user, router, toast]);

    const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isProfileFormValid) {
            toast({
                variant: "destructive",
                title: "Form Invalid",
                description: "Please fill out all fields correctly.",
            });
            return;
        }

        if (!user?.idUser) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "User ID not found. Please log in again.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("lastName", profileFormValues.lastName);
        formData.append("firstName", profileFormValues.firstName);
        formData.append("address", profileFormValues.address);
        formData.append("email", profileFormValues.email);
        if (image) formData.append("profileImage", image);

        try {
            setIsProfileLoading(true);
            await updateUserProfile(user.idUser, formData);
            toast({
                title: "Success",
                description: "Profile updated successfully.",
            });
            setImage(null);
            // Pas besoin de router.refresh(), AuthContext met déjà à jour user
            // Les champs locaux sont synchronisés via useEffect
        } catch (err: any) {
            const errorMessage = err.message || "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: errorMessage,
            });
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isPasswordFormValid) {
            toast({
                variant: "destructive",
                title: "Form Invalid",
                description: "Please fill out all password fields correctly.",
            });
            return;
        }

        if (!user?.idUser) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "User ID not found. Please log in again.",
            });
            return;
        }

        try {
            setIsPasswordLoading(true);
            await changeUserPassword(user.idUser, {
                currentPassword: passwordFormValues.currentPassword,
                newPassword: passwordFormValues.newPassword,
            });
            toast({
                title: "Success",
                description: "Password changed successfully.",
            });
            setPasswordFormValues({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
            setPasswordFormValidity({
                currentPassword: false,
                newPassword: false,
                confirmNewPassword: false,
            });
        } catch (err: any) {
            const errorMessage = err.message || "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Password Change Failed",
                description: errorMessage,
            });
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleProfileValidationChange = (field: string) => (isValid: boolean, value?: string) => {
        setProfileFormValidity(prev => ({
            ...prev,
            [field]: isValid,
        }));
        if (value !== undefined) {
            setProfileFormValues(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handlePasswordValidationChange = (field: string) => (isValid: boolean, value?: string) => {
        setPasswordFormValidity(prev => ({
            ...prev,
            [field]: isValid,
        }));
        if (value !== undefined) {
            setPasswordFormValues(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleImageSelect = useCallback((file: File | null) => {
        setImage(file);
        handleProfileValidationChange("image")(file !== null);
    }, []);

    const handleCancel = () => {
        if (user) {
            setProfileFormValues({
                lastName: user.lastName || "",
                firstName: user.firstName || "",
                address: user.address || "",
                email: user.email || "",
            });
            setProfileFormValidity({
                lastName: FORM_RULES.lastName.regex.test(user.lastName || ""),
                firstName: FORM_RULES.firstName.regex.test(user.firstName || ""),
                address: FORM_RULES.address.regex.test(user.address || ""),
                email: FORM_RULES.email.regex.test(user.email || ""),
                image: true,
            });
        }
        setImage(null);
        setPasswordFormValues({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        });
        setPasswordFormValidity({
            currentPassword: false,
            newPassword: false,
            confirmNewPassword: false,
        });
        const form = document.querySelector("form");
        if (form) form.reset();
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
        toast({
            title: "Success",
            description: "Logged out successfully.",
        });
    };

    return (
        <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="w-full max-w-3xl mx-auto">
                {/* Navigation des options */}
                <div className="flex flex-wrap mb-16 justify-center gap-4">
                    <Button
                        variant={activeSection === "account" ? "default" : "ghost"}
                        className="dark:text-text-dark dark:hover:bg-neutral-800 px-6 py-2"
                        onClick={() => setActiveSection("account")}
                    >
                        <span className="mr-2">📧</span> Compte
                    </Button>
                    <Button
                        variant={activeSection === "security" ? "default" : "ghost"}
                        className="dark:text-text-dark hover:bg-neutral-100 dark:hover:bg-neutral-800 px-6 py-2"
                        onClick={() => setActiveSection("security")}
                    >
                        <span className="mr-2">🔒</span> Sécurité
                    </Button>
                    <Button
                        variant="destructive"
                        className="px-6 py-2"
                        onClick={handleLogout}
                    >
                        Se déconnecter
                    </Button>
                </div>

                {/* Contenu conditionnel basé sur la section active */}
                {activeSection === "account" && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4 text-text dark:text-text-dark">
                            Update Profile Information
                        </h2>
                        <form onSubmit={handleProfileSubmit} className="flex items-center flex-col sm:flex-row justify-center gap-8">
                            <div className="flex w-full max-w-md flex-col items-center space-y-6">
                                <ImageUpload
                                    onImageSelect={handleImageSelect}
                                    shape="round"
                                    required={false}
                                    className="border border-neutral-80 dark:border-neutral-border-dark"
                                    initialImage={user?.profileUrl || undefined}
                                />
                                {image && <p className="text-sm text-neutral-100 dark:text-neutral-dark">New file: {image.name}</p>}
                                <Input
                                    label="Last Name"
                                    regex={FORM_RULES.lastName.regex}
                                    errorMessage={FORM_RULES.lastName.errorMessage}
                                    name="lastName"
                                    value={profileFormValues.lastName}
                                    onValidationChange={handleProfileValidationChange("lastName")}
                                />
                                <Input
                                    label="First Name"
                                    regex={FORM_RULES.firstName.regex}
                                    errorMessage={FORM_RULES.firstName.errorMessage}
                                    name="firstName"
                                    value={profileFormValues.firstName}
                                    onValidationChange={handleProfileValidationChange("firstName")}
                                />
                            </div>
                            <div className="w-full max-w-md flex flex-col gap-4">
                                <Input
                                    label="Address"
                                    regex={FORM_RULES.address.regex}
                                    errorMessage={FORM_RULES.address.errorMessage}
                                    name="address"
                                    value={profileFormValues.address}
                                    onValidationChange={handleProfileValidationChange("address")}
                                />
                                <Input
                                    label="Email"
                                    regex={FORM_RULES.email.regex}
                                    errorMessage={FORM_RULES.email.errorMessage}
                                    name="email"
                                    value={profileFormValues.email}
                                    onValidationChange={handleProfileValidationChange("email")}
                                />
                                <div className="mt-6 flex gap-4 justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="default"
                                        disabled={!isProfileFormValid || isProfileLoading}
                                    >
                                        {isProfileLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {activeSection === "security" && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-text dark:text-text-dark">
                            Change Password
                        </h2>
                        <form onSubmit={handlePasswordSubmit} className="flex w-full max-w-md flex-col items-center justify-center gap-6 mx-auto">
                            <Input
                                label="Current Password"
                                type="password"
                                regex={/.+/}
                                errorMessage="Please enter your current password"
                                name="currentPassword"
                                value={passwordFormValues.currentPassword}
                                onValidationChange={handlePasswordValidationChange("currentPassword")}
                            />
                            <Input
                                label="New Password"
                                type="password"
                                regex={FORM_RULES.password.regex}
                                errorMessage={FORM_RULES.password.errorMessage}
                                name="newPassword"
                                value={passwordFormValues.newPassword}
                                onValidationChange={handlePasswordValidationChange("newPassword")}
                            />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                name="confirmNewPassword"
                                regex={(value) => value === passwordFormValues.newPassword && value !== ""}
                                errorMessage={passwordFormValues.newPassword === "" ? "Please enter a new password first" : "Passwords do not match"}
                                value={passwordFormValues.confirmNewPassword}
                                onValidationChange={handlePasswordValidationChange("confirmNewPassword")}
                            />
                            <div className="flex gap-4 mt-4 justify-end w-full">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={!isPasswordFormValid || isPasswordLoading}
                                >
                                    {isPasswordLoading ? "Changing..." : "Change Password"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}