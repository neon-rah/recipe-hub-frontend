"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404 - Page Not Found</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Oops! It seems we couldn’t find the profile you’re looking for.
                </p>
                <Button
                    onClick={() => router.push("/home")}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
}