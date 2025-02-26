import {ReactNode} from "react";
import Navbar from "@/components/layout/NavBar";

export default function PersonalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-full flex-col overflow-auto scrollbar-none">
            {/* Navbar en haut */}
            <Navbar />

            {/* Contenu principal en plein écran */}
            <main className="flex-1 m-0 p-0 scrollbar-none ">
                {children}
            </main>
        </div>
    );
}