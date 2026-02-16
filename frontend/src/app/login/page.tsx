"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper 
} from "@mui/material";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulasi Login (Nanti ini akan memanggil API Go kamu)
    // Untuk sekarang, kita buat logic sederhana untuk testing
    if (formData.username === "admin" && formData.password === "admin123") {
      const fakeToken = "dummy-jwt-token-admin";
      const userData = { username: "Admin", role: "admin" as const };
      
      login(fakeToken, userData);
      toast.success("Selamat datang, Admin!");
    } else if (formData.username === "user" && formData.password === "user123") {
      const fakeToken = "dummy-jwt-token-user";
      const userData = { username: "Celyn", role: "user" as const };
      
      login(fakeToken, userData);
      toast.success("Berhasil Login!");
    } else {
      toast.error("Username atau Password salah (Coba admin/admin123)");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper sx={{ p: 4, width: "100%", bgcolor: "#1a1a1a", borderRadius: 3 }}>
          <Typography variant="h4" sx={{ color: "#ff4d00", fontWeight: "bold", mb: 3, textAlign: "center" }}>
            Login to Movie.id
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              required
              value={formData.username}
              onChange={handleChange}
              sx={{ 
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": { color: "gray" },
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#333" }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              required
              value={formData.password}
              onChange={handleChange}
              sx={{ 
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": { color: "gray" },
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#333" }
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ 
                mt: 3, 
                bgcolor: "#ff4d00", 
                py: 1.5,
                fontWeight: "bold",
                "&:hover": { bgcolor: "#cc3e00" }
              }}
            >
              Log In
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}