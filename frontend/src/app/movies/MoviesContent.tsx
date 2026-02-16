"use client";

import { useState, useEffect } from "react";
import { 
  Container, Box, Typography, Button, Table, TableBody, 
  TableCell, TableHead, TableRow, Paper, IconButton, TableContainer 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Media } from "@/types/media";

export default function MoviesContent() {
  const [movies, setMovies] = useState<Media[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/movies") 
    .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
    })
    .then((data) => setMovies(data))
    .catch((err) => console.error("Error fetching movies:", err));
}, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
          Manage Movies
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          sx={{ bgcolor: "#ff4d00", "&:hover": { bgcolor: "#cc3e00" } }}
        >
          Add Movie
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "#1a1a1a", backgroundImage: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "gray", borderBottom: "1px solid #333" }}>Title</TableCell>
              <TableCell sx={{ color: "gray", borderBottom: "1px solid #333" }}>Genre</TableCell>
              <TableCell sx={{ color: "gray", borderBottom: "1px solid #333" }}>Year</TableCell>
              <TableCell align="right" sx={{ color: "gray", borderBottom: "1px solid #333" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>{movie.title}</TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>{movie.genre}</TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>{movie.year}</TableCell>
                <TableCell align="right" sx={{ borderBottom: "1px solid #333" }}>
                  <IconButton sx={{ color: "#ff4d00" }}><EditIcon /></IconButton>
                  <IconButton sx={{ color: "red" }}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}