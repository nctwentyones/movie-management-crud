"use client";

import { Card, CardContent, CardMedia, Typography, Box, Chip } from "@mui/material";
import { Media } from "@/types/media";

interface MovieCardProps {
  item: Media;
}

export default function MovieCard({ item }: MovieCardProps) {
  return (
    <Card 
      sx={{ 
        height: "100%", 
        bgcolor: "#1a1a1a", 
        borderRadius: 4,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.03)" }
      }}
    >
      <CardMedia
        component="img"
        height="350"
        image={item.poster_url || "https://via.placeholder.com/300x450?text=No+Image"}
        alt={item.title}
      />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white", lineHeight: 1.2 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#ff4d00", fontWeight: "bold" }}>
            {item.year}
          </Typography>
        </Box>
        <Chip 
          label={item.genre} 
          size="small" 
          sx={{ bgcolor: "#333", color: "gray", fontSize: "0.7rem" }} 
        />
      </CardContent>
    </Card>
  );
}