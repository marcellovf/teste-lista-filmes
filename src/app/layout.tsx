'use client';

import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        <AuthProvider>
            <ThemeProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
