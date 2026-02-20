"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  Container, TableContainer, Box, Typography, Button, Table, TableBody, 
  TableCell, TableHead, TableRow, Paper, IconButton 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Media } from "@/types/media";
import { seriesService } from "@/services/api";

export default function SeriesContent() {
  const [series, setSeries] = useState<Media[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const search = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(search);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(inputValue);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  useEffect(() => {
    console.log("Memanggil API untuk search:", search);

    seriesService.getAll(search) 
      .then((data) => {
        console.log("Data dari backend:", data);
        setSeries(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching series:", err);
        setSeries([]);
      });
  }, [search]);

  const filteredSeries = useMemo(() => {
    const s = search.toLowerCase();
    return (series || []).filter((item) =>
      item.title?.toLowerCase().includes(s) ||
      item.genre_name?.toLowerCase().includes(s)
    );
  }, [series, search]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center", gap: 2 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
          Manage Series
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
          Add Series
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "#1a1a1a" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "gray" }}>Title</TableCell>
              <TableCell sx={{ color: "gray" }}>Genre</TableCell>
              <TableCell sx={{ color: "gray" }}>Year</TableCell>
              <TableCell align="right" sx={{ color: "gray" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredSeries.map((item) => ( 
            <TableRow key={item.id}>
              <TableCell sx={{ color: "white" }}>{item.title}</TableCell>
              <TableCell sx={{ color: "white" }}>{item.genre_name}</TableCell>
              <TableCell sx={{ color: "white" }}>{item.year}</TableCell>
              <TableCell align="right">
                <IconButton sx={{ color: "#ff4d00" }}><EditIcon /></IconButton>
                <IconButton sx={{ color: "red" }}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
      
      {filteredSeries.length === 0 && (
        <Typography sx={{ color: "gray", textAlign: "center", mt: 4 }}>
          {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada data series."}
        </Typography>
      )}
      
    </Container>
  );
}