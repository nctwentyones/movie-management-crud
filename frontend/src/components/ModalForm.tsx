"use client";

import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, MenuItem 
} from "@mui/material";
import { useState, useEffect } from "react";
import { Media } from "../types/media";

interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: Partial<Media>) => void; 
  initialData?: Media | null; 
}

const emptyState: Partial<Media> = {
  title: "",
  genre_id: 0,
  year: new Date().getFullYear(),
  director: "",
  poster_url: "",
  type: "movie" 
};

const GENRES = [
  { id: 1, name: "Sci-Fi" },
  { id: 2, name: "Action" },
  { id: 3, name: "Fantasy" },
  { id: 4, name: "Drama" },
  { id: 5, name: "Thriller" },
];

const inputStyle = {
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: "gray" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#ff4d00" },
    "&.Mui-focused fieldset": { borderColor: "#ff4d00" },
  },
  "& .MuiFormHelperText-root": { color: "#ff4d00" },
  "& .MuiSelect-select": { color: "white" },
  "& .MuiSvgIcon-root": { color: "white" }
};

export default function ModalForm({ open, onClose, title, onSubmit, initialData }: ModalFormProps) {
  const [formData, setFormData] = useState<Partial<Media>>(emptyState);

  // Form Validation
  const isFormValid = 
    formData.title?.trim() !== "" && 
    (formData.genre_id !== undefined && formData.genre_id > 0) && 
    formData.director?.trim() !== "" && 
    (formData.year !== undefined && formData.year > 1800) && 
    formData.poster_url?.trim() !== "";

  useEffect(() => {
    if (open) {
      setFormData(initialData || emptyState);
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === "year" || name === "genre_id") 
        ? (value === "" ? 0 : parseInt(value)) 
        : value 
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ bgcolor: "#1a1a1a", color: "white" }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>{title}</DialogTitle>
        <DialogContent>
          <TextField
            select fullWidth name="type" label="Type" margin="normal"
            value={formData.type || "movie"}
            onChange={handleChange}
            sx={inputStyle}
          >
            <MenuItem value="movie">Movie</MenuItem>
            <MenuItem value="series">Series</MenuItem>
          </TextField>

          <TextField
            fullWidth name="title" label="Title" margin="normal"
            value={formData.title} onChange={handleChange}
            error={formData.title === ""}
            helperText={formData.title === "" ? "Title is required" : ""}
            sx={inputStyle}
          />

          <TextField
            fullWidth name="year" label="Year" type="number" margin="normal"
            value={formData.year === 0 ? "" : formData.year}
            onChange={handleChange}
            error={!formData.year || formData.year < 1888}
            helperText={(!formData.year || formData.year < 1888) ? "Min year is 1888" : ""}
            sx={inputStyle}
          />

          {/* DROP-DOWN GENRE */}
          <TextField
          select
          fullWidth 
          name="genre_id"
          label="Genre" 
          margin="normal"
          // Pastikan value adalah 0 jika undefined/null agar sesuai dengan tipe data GENRES.id (number)
          value={formData.genre_id ?? 0} 
          onChange={handleChange}
          sx={inputStyle}
          error={!formData.genre_id || formData.genre_id === 0}
          helperText={(!formData.genre_id || formData.genre_id === 0) ? "Please select a genre" : ""}
        >
            {/* Gunakan value 0 untuk opsi 'None' agar tetap bertipe number */}
            <MenuItem value={0}><em>None</em></MenuItem>
            {GENRES.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth name="director" label="Director" margin="normal"
            value={formData.director} onChange={handleChange}
            sx={inputStyle}
          />

          <TextField
            fullWidth name="poster_url" label="Poster URL" margin="normal"
            value={formData.poster_url} onChange={handleChange}
            sx={inputStyle}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} sx={{ color: "gray" }}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!isFormValid}
            onClick={() => onSubmit(formData)}
            sx={{ 
              bgcolor: "#ff4d00", 
              "&:hover": { bgcolor: "#cc3e00" },
              "&.Mui-disabled": { bgcolor: "#333", color: "#666" }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}