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
            console.log("Login réussi");
            setIsLoggedIn(true); // Déclencher la redirection après succès
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: errorMessage,
            });
        }
    };

    const goToRegister = () => {
        router.push("/register");
    };

    useEffect(() => {
        if (isLoggedIn) {
            const redirect = setTimeout(() => {
                console.log("Redirection vers /home après délai");
                router.push("/home");
            }, 100);
            return () => clearTimeout(redirect);
        }
    }, [isLoggedIn, router]);

    return (
        <div className="flex bg-amber-50 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
                <GiChefToque className="text-4xl text-primary" size={50} />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-900">
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
                                className="block w-full h-12 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-primary hover:text-orange-700">
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
                                className="block w-full h-12 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{" "}
                    <a href="#" onClick={goToRegister} className="font-semibold text-primary hover:text-orange-700">
                        Sign Up here
                    </a>
                </p>
            </div>
        </div>
    );
}