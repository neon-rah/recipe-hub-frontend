"use client";

import { GiChefToque } from "react-icons/gi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FORM_RULES } from "@/config/formRules";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!FORM_RULES.email.regex.test(email)) {
            toast({
                variant: "destructive",
                title: "Invalid Email",
                description: FORM_RULES.email.errorMessage,
            });
            return;
        }
        if (!FORM_RULES.password.regex.test(password)) {
            toast({
                variant: "destructive",
                title: "Invalid Password",
                description: FORM_RULES.password.errorMessage,
            });
            return;
        }

        try {
            await login(email, password);
            console.log("Login successful");
            setIsLoggedIn(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: errorMessage,
            });
        }
    };

    const goToRegister = () => router.push("/register");

    useEffect(() => {
        if (isLoggedIn) {
            const redirect = setTimeout(() => {
                console.log("Redirecting to /home after delay");
                router.push("/home");
            }, 100);
            return () => clearTimeout(redirect);
        }
    }, [isLoggedIn, router]);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md max-w-xs flex flex-col items-center justify-center">
                <GiChefToque className="text-primary-100" size={50} />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-text dark:text-text-dark">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md max-w-xs ">
                <form onSubmit={handleSubmit} className="space-y-6 sm:w-[400px] w-fit">
                    <div>
                        <label htmlFor="email" className="block text-sm text-text dark:text-text-dark">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="block w-full h-12 rounded-md bg-background dark:bg-background-dark px-4 py-3 text-base text-text dark:text-text-dark border border-neutral-80 dark:border-neutral-border-dark placeholder:text-text-secondary dark:placeholder:text-text-dark-secondary focus:ring-2 focus:ring-primary-60 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm text-text dark:text-text-dark">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#"
                                   className="font-semibold text-secondary-100 dark:text-secondary-dark-mode hover:text-secondary-80 dark:hover:text-secondary-dark-mode-80">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="block w-full h-12 rounded-md bg-background dark:bg-background-dark px-4 py-3 text-base text-text dark:text-text-dark border border-neutral-80 dark:border-neutral-border-dark placeholder:text-text-secondary dark:placeholder:text-text-dark-secondary focus:ring-2 focus:ring-primary-60 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-primary-100 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-80 focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-text-secondary dark:text-text-dark-secondary">
                    Not a member?{" "}
                    <a href="#" onClick={goToRegister}
                       className="font-semibold text-secondary-100 dark:text-secondary-dark-mode hover:text-secondary-80 dark:hover:text-secondary-dark-mode-80">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
}