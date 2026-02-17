"use client";
import { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, Button, Skeleton } from "@mui/material";
import MovieCard from "@/components/MovieCard";
import { Media } from "@/types/media";

export default function HomePage() {
  const [movies, setMovies] = useState<Media[]>([]);
  const [series, setSeries] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMovies, resSeries] = await Promise.all([
          fetch("http://localhost:8081/movies"),
          fetch("http://localhost:8081/series"),
        ]);

        const dataMovies = await resMovies.json();
        const dataSeries = await resSeries.json();

        setMovies(Array.isArray(dataMovies) ? dataMovies : []);
        setSeries(Array.isArray(dataSeries) ? dataSeries : []);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setMovies([]);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Banner */}
      <Box
        sx={{
          height: "500px",
          position: "relative",
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent), url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ maxWidth: "600px" }}>
            <Typography variant="h2" fontWeight="800" gutterBottom color="white">
              THE OUTPOST
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }} color="white">
              Kisah heroik pasukan kecil tentara AS di Afghanistan yang harus bertahan dari serangan Taliban.
            </Typography>
            <Button variant="contained" size="large" sx={{ borderRadius: "12px", px: 4, py: 1.5, bgcolor: "#ff4d00" }}>
              Watch Now
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Movies Section */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Popular Movies
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4 }} />
                </Grid>
              ))
            : (movies || []).map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <MovieCard item={item} />
                </Grid>
              ))}
        </Grid>

        {/* Series Section */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          New Series
        </Typography>
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4 }} />
                </Grid>
              ))
            : (series || []).map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <MovieCard item={item} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}