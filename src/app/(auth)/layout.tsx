export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen bg-background  dark:bg-background-dark overflow-scroll scrollbar-none py-20  ">
            {children}
        </div>
    );
}