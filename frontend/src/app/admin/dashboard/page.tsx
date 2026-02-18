"use client";

import { useState, useEffect } from "react";
import { 
  Container, Typography, Box, Tabs, Tab, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { movieService, seriesService} from "@/services/api"; //
import { Media } from "@/types/media";
import RoleGuard from "@/components/auth/RoleGuard";
import ModalForm from "@/components/ModalForm"; 
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState<Media[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);
  const currentService = tabValue === 0 ? movieService : seriesService;

  const fetchData = async () => {
      try {
        const result = await currentService.getAll(); 
        setData(result);
      } catch (error) {
        toast.error("Gagal mengambil data");
      }
    };

  useEffect(() => {
    fetchData();
  }, [tabValue]);

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await currentService.delete(id);  
        toast.success("Data berhasil dihapus");
        fetchData();
      } catch (error) {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const handleOpenModal = (item: Media | null = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: Partial<Media>) => {
    try {
      const currentService = tabValue === 0 ? movieService : seriesService;

      if (selectedItem) {
        await currentService.update(selectedItem.id, formData); 
        toast.success("Data berhasil diupdate");
      } else {

        const payload = { 
          ...formData, 
          type: tabValue === 0 ? "movie" : "series" 
        } as Media; 
        
        await currentService.create(payload); 
        toast.success("Data berhasil ditambah");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error); 
      toast.error("Terjadi kesalahan saat menyimpan data");
    }
  };

  return (
    <RoleGuard adminOnly>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
            Admin Dashboard
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ bgcolor: "#ff4d00", "&:hover": { bgcolor: "#cc3e00" } }}
          >
            Add New Content
          </Button>
        </Box>

        <Paper sx={{ bgcolor: "#1a1a1a", borderRadius: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ borderBottom: 1, borderColor: "#333", px: 2 }}
          >
            <Tab label="Movies" sx={{ color: "white" }} />
            <Tab label="Series" sx={{ color: "white" }} />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ "& th": { color: "gray", fontWeight: "bold", borderBottom: "1px solid #333" } }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>Director</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} sx={{ "& td": { color: "white", borderBottom: "1px solid #222" } }}>
                    <TableCell sx={{ fontWeight: "medium" }}>{item.title}</TableCell>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>{item.genre_name}</TableCell>
                    <TableCell>{item.director}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenModal(item)} sx={{ color: "#ff4d00" }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "gray" }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <ModalForm 
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedItem ? "Edit Content" : "Add New Content"}
          onSubmit={handleFormSubmit}
          initialData={selectedItem}
        />
      </Container>
    </RoleGuard>
  );
}