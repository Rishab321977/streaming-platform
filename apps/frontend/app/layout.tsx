import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import QueryProvider from "./_providers/QueryProvider";
import { cn } from "@/lib/utils";
import { PageFooter } from "./_components/layout/PageFooter";
import AuthProvider from "./_providers/AuthProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Streaming Platform',
  description: 'High-performance media catalog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <AuthProvider>
        <QueryProvider>
          {/* A11y: Semantic navigation landmark */}
          <nav aria-label="Main Navigation" className="h-16 border-b flex items-center px-8">
            <h1 className="text-xl font-bold text-primary">STREAM</h1>
          </nav>

          {/* A11y: Main content landmark */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>

          {/* A11y: Contentinfo landmark */}
          <PageFooter />
        </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
