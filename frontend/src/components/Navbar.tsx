"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Container, Toolbar, Typography, Box, Button, InputBase, styled, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "@/context/AuthContext";

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

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#000000", borderBottom: "1px solid #333" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Brand Movie.id */}
          <Typography
            variant="h5"
            component={Link}
            href="/"
            sx={{ fontWeight: 800, color: "#ff4d00", textDecoration: "none", mr: 2, letterSpacing: "1px" }}
          >
            Movie.id
          </Typography>

          {/* Bagian Kiri: Tombol Admin (Hanya muncul jika admin) */}
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2, alignItems: 'center' }}>
            {user?.role === "admin" && (
              <Button
                component={Link}
                href="/admin/dashboard"
                sx={{
                  color: pathname.startsWith("/admin") ? "#ff4d00" : "white",
                  fontWeight: "bold",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  '&:hover': { bgcolor: "rgba(255, 77, 0, 0.1)" }
                }}
              >
                Movie Management
              </Button>
            )}

            <Search>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase placeholder="Search…" />
            </Search>
          </Box>
          
          {/* Bagian Kanan: Auth Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                  Halo, {user.username}
                </Typography>
                <Button 
                  onClick={logout} 
                  variant="outlined" 
                  sx={{ color: "white", borderColor: "#333" }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button 
                component={Link} 
                href="/login" 
                variant="contained" 
                sx={{ bgcolor: "#ff4d00", '&:hover': { bgcolor: "#cc3d00" } }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}