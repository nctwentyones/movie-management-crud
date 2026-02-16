package delivery

import (
	"encoding/json"
	"net/http"
	"strconv"
	"database/sql"
	"movie_crud/internal/models"
	"movie_crud/internal/usecase"

	"github.com/gorilla/mux"
)

type SeriesHandler struct {
	usecase usecase.SeriesUsecase
}

func NewSeriesHandler(u usecase.SeriesUsecase) *SeriesHandler {
	return &SeriesHandler{usecase: u}
}

func sendError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func (h *SeriesHandler) GetSeries(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Query().Get("title")
	var series []models.Media
	var err error

	if title != "" {
		series, err = h.usecase.SearchSeries(title)
	} else {
		series, err = h.usecase.FetchAllSeries()
	}

	if err != nil {
		sendError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(series)
}

func (h *SeriesHandler) GetSeriesByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, "Invalid Series ID", http.StatusBadRequest)
		return
	}

	series, err := h.usecase.FetchSeriesByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			sendError(w, "Series not found", http.StatusNotFound)
		} else {
			sendError(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(series)
}

func (h *SeriesHandler) CreateSeries(w http.ResponseWriter, r *http.Request) {
	var s models.Media
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		sendError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := h.usecase.AddSeries(&s); err != nil {
		sendError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Series successfully added"})
}

func (h *SeriesHandler) UpdateSeries(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, "Invalid Series ID", http.StatusBadRequest)
		return
	}

	var s models.Media
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		sendError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := h.usecase.EditSeries(id, &s); err != nil {
		if err == sql.ErrNoRows {
			sendError(w, "Series not found", http.StatusNotFound)
		} else {
			sendError(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Series updated successfully"})
}

func (h *SeriesHandler) DeleteSeries(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, "Invalid Series ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.RemoveSeries(id); err != nil {
		if err == sql.ErrNoRows {
			sendError(w, "Series not found", http.StatusNotFound)
		} else {
			sendError(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}