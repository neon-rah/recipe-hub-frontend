export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
            <div className="w-full max-w-4xl mx-auto p-6">{children}</div>
        </div>
    );
}