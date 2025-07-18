
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import {AuthProvider} from "@/context/AuthContext";
import WebSocketProvider from "@/providers/WebSocketProvider";
import {Toaster} from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Kaly Art App",
  description: "Platform for sharing and looking for recipes.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
      >
      <AuthProvider>
          <ThemeProvider>
              <WebSocketProvider>
              <div className={"flex bg-background dark:bg-background-dark h-[100vh] justify-center items-center w-full"}>
                  {children}
                  <Toaster/>
              </div>
              </WebSocketProvider>
          </ThemeProvider>
      </AuthProvider>
      </body>
      </html>
  );
}
