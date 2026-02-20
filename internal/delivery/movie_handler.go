package delivery

import (
	"encoding/json"
	"movie_crud/internal/models"
	"movie_crud/internal/usecase"
	"net/http"
	"strconv"
	"fmt"

	"github.com/gorilla/mux"
)

type MovieHandler struct {
	usecase usecase.MovieUsecase
}

func NewMovieHandler(u usecase.MovieUsecase) *MovieHandler {
	return &MovieHandler{usecase: u}
}

func (h *MovieHandler) GetMovies(w http.ResponseWriter, r *http.Request) {
    search := r.URL.Query().Get("search")
    genreID, _ := strconv.Atoi(r.URL.Query().Get("genre_id"))
    page, _ := strconv.Atoi(r.URL.Query().Get("page"))
    limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

    if page <= 0 { page = 1 }
    if limit <= 0 { limit = 10 }

    fmt.Printf("Backend Received Search Movie Query: [%s], Genre: %d, Page: %d\n", search, genreID, page)

    var movies []models.Media
    var total int
    var err error

    if search != "" || genreID != 0 {
        movies, total, err = h.usecase.SearchMovies(search, genreID, limit, page)
    } else {
        movies, total, err = h.usecase.FetchAllMovies(limit, page)
    }

    if err != nil {
        sendError(w, err.Error(), http.StatusInternalServerError)
        return
    }

    response := map[string]interface{}{
        "data":       movies,
        "total":      total,
        "page":       page,
        "limit":      limit,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
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
