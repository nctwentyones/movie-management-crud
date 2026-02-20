"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  Container, Box, Typography, Button, Table, TableBody, 
  TableCell, TableHead, TableRow, Paper, IconButton, TableContainer 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Media } from "@/types/media";
import { movieService } from "@/services/api";

export default function MoviesContent() {
  const [movies, setMovies] = useState<Media[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const search = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = 10; 
  const [inputValue, setInputValue] = useState(search);

  const handleURLUpdate = (term: string, page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) params.set("search", term); else params.delete("search");
      params.set("page", page.toString());
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

  useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        handleURLUpdate(inputValue, 1);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

  useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const response = await movieService.getAll(search);
          // RESPONSE ADALAH { data: [], total: 0, ... }
          setMovies(response?.data || []);
          setTotal(response?.total || 0);
        } catch (err) {
          setMovies([]);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [search]);


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
     <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center", gap: 2 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
          Manage Movies
        </Typography>

        <input 
          type="text"
          placeholder="Cari di tabel ini..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ 
            padding: '8px 12px', 
            borderRadius: '4px', 
            border: '1px solid #333', 
            backgroundColor: '#1a1a1a', 
            color: 'white',
            width: '300px'
          }}
          />

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
              <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>
                {movie.title}
              </TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>
                {movie.genre_name}
              </TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>
                {movie.year}
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "1px solid #333" }}>
                <IconButton sx={{ color: "#ff4d00" }}><EditIcon /></IconButton>
                <IconButton sx={{ color: "red" }}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
           {movies.length === 0 && !loading && (
            <Typography sx={{ color: "gray", textAlign: "center", mt: 4 }}>
              {search 
                ? `Tidak ada hasil untuk "${search}"` 
                : "Belum ada data film di database."}
            </Typography>
          )}
    </Container>
  );
}