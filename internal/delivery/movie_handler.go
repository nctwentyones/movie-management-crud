package delivery

import (
	"encoding/json"
	"net/http"
	"strconv"
	"movie_crud/internal/models"
	"movie_crud/internal/usecase"

	"github.com/gorilla/mux" 
)

type MovieHandler struct {
	usecase usecase.MovieUsecase
}

func NewMovieHandler(u usecase.MovieUsecase) *MovieHandler {
	return &MovieHandler{usecase: u}
}

func (h *MovieHandler) GetMovies(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Query().Get("title")
    var movies []models.Media
    var err error

    if title != "" {
        movies, err = h.usecase.SearchMovies(title)
    } else {
        movies, err = h.usecase.FetchAllMovies()
    }

    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(movies)
}

func (h *MovieHandler) GetMovieByID(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, err := strconv.Atoi(vars["id"])
    if err != nil {
        http.Error(w, "Invalid Movie ID", http.StatusBadRequest)
        return
    }

    movie, err := h.usecase.SearchMoviesByID(id)
    if err != nil {
        http.Error(w, "Movie not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(movie)
}

func (h *MovieHandler) CreateMovie(w http.ResponseWriter, r *http.Request) {
	var m models.Media
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := h.usecase.AddMovie(&m); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Movie created successfully"})
}


func (h *MovieHandler) UpdateMovie(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"]) 
	if err != nil {
		http.Error(w, "Invalid Movie ID", http.StatusBadRequest)
		return
	}

	var m models.Media
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.usecase.EditMovie(id, &m); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Movie updated successfully"})
}

func (h *MovieHandler) DeleteMovie(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid Movie ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.RemoveMovie(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}