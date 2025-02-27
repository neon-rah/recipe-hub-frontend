"use client";

import { GiChefToque } from "react-icons/gi";
import { useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth"; // Assurez-vous que votre hook d'authentification est correctement configuré.

export default function LoginPage() {
    const { login } = useAuth();  // Appel du hook login pour gérer l'authentification
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();  // Utilisation du router pour la redirection

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);  // Réinitialiser l'erreur à chaque soumission du formulaire

        try {
            // Essayez de vous connecter
            await login( email, password );
            router.push("/home");  // Redirige vers la page home après une connexion réussie
        } catch (err) {
            setError("Invalid credentials. Please try again. "+ err);  // Affiche une erreur en cas d'échec
        }
    };

    return (
        <>
            <div className="flex bg-amber-50 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center ">
                    <GiChefToque className="text-4xl text-primary " size={50} />
                    <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}  {/* Affiche l'erreur si elle existe */}

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
                                    onChange={(e) => setEmail(e.target.value)}  // Mettre à jour l'état local
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
                                    onChange={(e) => setPassword(e.target.value)}  // Mettre à jour l'état local
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
                        Not a member?{' '}
                        <a href="#" className="font-semibold text-primary hover:text-orange-700">
                            Sign Up here
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
