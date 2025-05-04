export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center content-center justify-center bg-background dark:bg-background-dark overflow-y-auto">
            {children}
        </div>
    );
}