"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) return <div className="flex justify-center items-center flex-1 w-full h-full"><span className="loading loading-bars loading-2xl w-[70px] h-[70px] md: loading-xl"></span></div>; // Affichage temporaire

    return <>{children}</>;
};

export default ProtectedRoute;
