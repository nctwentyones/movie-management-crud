import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'; 
import ThemeRegistry from "@/components/ThemeRegistry"; 
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie.id - Movie Management",
  description: "Platform manajemen movie dan series",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeRegistry>
            {/* AuthProvider */}
            <AuthProvider>
              <Navbar />
              
              <main>
                {children}
              </main>

              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }} 
              />
            </AuthProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}