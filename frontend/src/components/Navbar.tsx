"use client"; // Pastikan ada ini jika menggunakan Next.js App Router

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Container, Toolbar, Typography, Box, Button, InputBase, styled, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "@/context/AuthContext"; // Sesuaikan path ini

// --- Styled Components untuk Search Bar ---
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '20ch' },
  },
}));

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const pathname = usePathname();

  // 1. Menu yang bisa dilihat semua orang (termasuk tamu)
  const publicItems = [
    { label: "Home", path: "/" },
  ];

  // 2. Menu yang hanya muncul untuk ADMIN
  const adminItems = [
    { label: "Manage Movies", path: "/movies" },
    { label: "Manage Series", path: "/series" },
    { label: "Dashboard", path: "/admin/dashboard" },
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#000000", borderBottom: "1px solid #333" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={Link}
            href="/"
            sx={{ fontWeight: 800, color: "#ff4d00", textDecoration: "none", mr: 4, letterSpacing: "1px" }}
          >
            Movie.id
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex", gap: 2, alignItems: 'center' }}>
            {/* Render Menu Publik */}
            {publicItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                href={item.path}
                sx={{
                  color: pathname === item.path ? "#ff4d00" : "white",
                  fontWeight: pathname === item.path ? "bold" : "medium",
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* Render Menu Admin (Hanya jika role === admin) */}
            {user?.role === "admin" && adminItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                href={item.path}
                sx={{
                  color: pathname === item.path ? "#ff4d00" : "white",
                  fontWeight: pathname === item.path ? "bold" : "medium",
                }}
              >
                {item.label}
              </Button>
            ))}

            <Search>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase placeholder="Search…" />
            </Search>
          </Box>
          
          {/* Bagian Login/Logout tetap sama */}
          {/* ... */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}