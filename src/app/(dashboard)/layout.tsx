"use client";

import Navbar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/sidebar";
import {ReactNode} from "react";
import useAuth from "@/hooks/useAuth";
// import {RecipeSyncProvider} from "@/context/recipe-sync-context";


import ProtectedRoute from "@/components/layout/ProtectedRoute";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import FloatingActionButton from "@/components/FloatingActionButton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const {user} = useAuth();
    const profileImage = user?.profilePic
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}${user.profilePic}`
        : "/assets/profile-12.png";
    return (
        <ProtectedRoute>
        {/*<RecipeSyncProvider>*/}
        
            <div className="flex h-screen w-full flex-col">
                {/* Navbar en haut */}
                <Navbar profileImage={profileImage}/>

                {/* Contenu principal divisé en 2 sections */}
                <main className="flex flex-1 justify-center p-4 gap-4 overflow-hidden scrollbar-none ">
                    {/* Contenu principal (2/3 de l'écran) */}
                    <section
                        className="flex-1 bg-background-secondary overflow-auto scrollbar-none shadow-sm  rounded-lg dark:bg-background-dark pb-10">
                        {children}
                    </section>

                    {/* Sidebar (Partie droite) - Cachée sur mobile */}
                    <aside
                        className="w-1/3 pb-10 bg-gray-100 shadow-sm shadow-gray-400 overflow-auto scrollbar-none rounded-lg dark:bg-background-dark hidden lg:block">
                        <SideBar/>
                    </aside>
                </main>

                <ScrollToTopButton/>
                <FloatingActionButton />
            </div>

        {/*</RecipeSyncProvider>*/}

        </ProtectedRoute>

    );
}