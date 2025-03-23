// app/personal/layout.tsx
"use client";

import { ReactNode } from "react";
import Navbar from "@/components/layout/NavBar";
import useAuth from "@/hooks/useAuth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import FloatingActionButton from "@/components/FloatingActionButton";

export default function PersonalLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const profileImage = user?.profilePic
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}${user.profilePic}`
        : "/assets/profile-12.png";

    return (
        <ProtectedRoute>
            <div className="flex h-screen w-full flex-col overflow-auto scrollbar-none">
                <Navbar profileImage={profileImage} />
                <main className="flex-1 m-0 p-4 scrollbar-none">{children}</main>
                <FloatingActionButton />
            </div>
        </ProtectedRoute>
    );
}