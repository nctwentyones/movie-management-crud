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
      if (!user) {
        router.push("/login");
      }
      else if (adminOnly && user.role !== 'admin') {
        router.push("/");
      }
    }
  }, [user, isLoading, router, adminOnly]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#000' }}>
        <CircularProgress sx={{ color: '#ff4d00' }} />
      </Box>
    );
  }

  return <>{children}</>;
}