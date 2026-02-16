package main

import (
	"log"
	"net/http"
	"os"

	"movie_crud/internal/delivery"
	"movie_crud/internal/delivery/middleware"
	"movie_crud/internal/repository"
	"movie_crud/internal/usecase"
	"movie_crud/pkg/database"

	"github.com/gorilla/mux"
	"github.com/rs/cors" 
)

func main() {
	db := database.InitDB()
	defer db.Close()

	movieRepo := repository.NewMovieRepository(db)
	movieUsecase := usecase.NewMovieUsecase(movieRepo)
	movieHandler := delivery.NewMovieHandler(movieUsecase)

	seriesRepo := repository.NewSeriesRepository(db)
	seriesUsecase := usecase.NewSeriesUsecase(seriesRepo)
	seriesHandler := delivery.NewSeriesHandler(seriesUsecase)

	r := mux.NewRouter()

	// 2. Grouping Route Publik (Hanya GET)
	r.HandleFunc("/movies", movieHandler.GetMovies).Methods("GET")
	r.HandleFunc("/movies/{id}", movieHandler.GetMovieByID).Methods("GET")
	r.HandleFunc("/series", seriesHandler.GetSeries).Methods("GET")
	r.HandleFunc("/series/{id}", seriesHandler.GetSeriesByID).Methods("GET")

	admin := r.PathPrefix("/api/admin").Subrouter()
	admin.Use(middleware.AuthMiddleware) 

	// Sub-route untuk Movies di dalam Admin
	admin.HandleFunc("/movies", movieHandler.CreateMovie).Methods("POST")
	admin.HandleFunc("/movies/{id}", movieHandler.UpdateMovie).Methods("PUT")
	admin.HandleFunc("/movies/{id}", movieHandler.DeleteMovie).Methods("DELETE")

	// Sub-route untuk Series di dalam Admin
	admin.HandleFunc("/series", seriesHandler.CreateSeries).Methods("POST")
	admin.HandleFunc("/series/{id}", seriesHandler.UpdateSeries).Methods("PUT")
	admin.HandleFunc("/series/{id}", seriesHandler.DeleteSeries).Methods("DELETE")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true,
	})

	handler := c.Handler(r)

	appPort := os.Getenv("PORT")
	if appPort == "" {
		appPort = "8080"
	}

	log.Printf("Server berjalan di port %s", appPort)
	log.Fatal(http.ListenAndServe(":"+appPort, handler))
}