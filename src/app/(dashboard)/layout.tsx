import Navbar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/sidebar";
import {ReactNode} from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-full flex-col">
            {/* Navbar en haut */}
            <Navbar />

            {/* Contenu principal divisé en 2 sections */}
            <main className="flex flex-1 justify-center p-4 gap-4 overflow-hidden scrollbar-none ">
                {/* Contenu principal (2/3 de l'écran) */}
                <section className="flex-1 bg-white  overflow-auto scrollbar-none shadow-sm  rounded-lg dark:bg-gray-900">
                    {children}
                </section>

                {/* Sidebar (Partie droite) - Cachée sur mobile */}
                <aside className="w-1/3 h-screen bg-gray-100 shadow-sm shadow-gray-400 overflow-auto scrollbar-none rounded-lg dark:bg-gray-800 hidden lg:block">
                    <SideBar />
                </aside>
            </main>
        </div>
    );
}