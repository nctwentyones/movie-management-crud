package models

import "time"

type Media struct {
	ID        int       `json:"id" db:"id"`
	Type      string    `json:"type" db:"type"` 
	Title     string    `json:"title" db:"title"`
	Year      int       `json:"year" db:"year"`
	Director  string    `json:"director" db:"director"`
	GenreID   int       `json:"genre_id" db:"genre_id"`
	GenreName string    `json:"genre" db:"genre_name"`
	PosterURL string    `json:"poster_url" db:"poster_url"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}