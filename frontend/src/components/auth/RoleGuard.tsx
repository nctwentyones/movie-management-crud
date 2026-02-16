"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export default function RoleGuard({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Jika tidak ada user, tendang ke login
      if (!user) {
        router.push("/login");
      } 
      // Jika butuh admin tapi user bukan admin, tendang ke home
      else if (adminOnly && user.role !== 'admin') {
        router.push("/");
      }
    }
  }, [user, isLoading, router, adminOnly]);

  // Tampilkan loading spinner saat mengecek status login
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#000' }}>
        <CircularProgress sx={{ color: '#ff4d00' }} />
      </Box>
    );
  }

  // Jika semua kondisi terpenuhi, tampilkan konten
  return <>{children}</>;
}