"use client";

import { useState, useEffect } from "react";
import { 
  Container, TableContainer, Box, Typography, Button, Table, TableBody, 
  TableCell, TableHead, TableRow, Paper, IconButton 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Media } from "@/types/media";

export default function SeriesContent() {
  const [series, setSeries] = useState<Media[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/series")
      .then((res) => res.json())
      .then((data) => {
        setSeries(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching series:", err);
        setSeries([]); 
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
          Manage Series
        </Typography>
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
            {(series || []).map((item) => ( 
              <TableRow key={item.id}>
                <TableCell sx={{ color: "white" }}>{item.title}</TableCell>
                <TableCell sx={{ color: "white" }}>{item.genre}</TableCell>
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
      
      {series.length === 0 && (
        <Typography sx={{ color: "gray", textAlign: "center", mt: 2 }}>
          No series found. Check if genres are seeded in DB.
        </Typography>
      )}
    </Container>
  );
}