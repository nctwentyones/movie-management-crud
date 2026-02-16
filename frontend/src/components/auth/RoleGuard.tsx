"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const router = useRouter();

  const user = { isLoggedIn: true, role: 'user' }; 

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push("/login");
    } else if (adminOnly && user.role !== 'admin') {
      router.push("/"); 
    }
  }, [user, router, adminOnly]);

  return <>{children}</>;
}