package repository

import (
	"database/sql"
	"movie_crud/internal/models"
)

type SeriesRepository interface {
	Create(series *models.Media) error
	GetAll(limit, offset int) ([]models.Media, int, error) // Tambah pagination
	Update(id int, series *models.Media) error
	Delete(id int) error
	Search(title string, genreID int, limit, offset int) ([]models.Media, int, error) // Ganti jadi Search lengkap
	GetByID(id int) (*models.Media, error)
}

type seriesRepo struct {
	db *sql.DB
}

func NewSeriesRepository(db *sql.DB) SeriesRepository {
	return &seriesRepo{db}
}

// Helper SCAN agar konsisten
func (r *seriesRepo) scanSeries(rows *sql.Rows) (models.Media, error) {
	var m models.Media
	err := rows.Scan(&m.ID, &m.Type, &m.Title, &m.Year, &m.Director, &m.GenreID, &m.GenreName, &m.PosterURL, &m.CreatedAt)
	return m, err
}

func (r *seriesRepo) Search(title string, genreID int, limit, offset int) ([]models.Media, int, error) {
	var total int
	searchTerm := "%" + title + "%"

	// 1. Count total khusus series
	countQuery := `
		SELECT COUNT(*) FROM medias 
		WHERE type='series' 
		AND title ILIKE $1 
		AND ($2 = 0 OR genre_id = $2)`
	
	err := r.db.QueryRow(countQuery, searchTerm, genreID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// 2. Data khusus series
	query := `
		SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name as genre_name, m.poster_url, m.created_at 
		FROM medias m
		JOIN genres g ON m.genre_id = g.id 
		WHERE m.type='series' 
		AND m.title ILIKE $1 
		AND ($2 = 0 OR m.genre_id = $2)
		ORDER BY m.created_at DESC
		LIMIT $3 OFFSET $4`

	rows, err := r.db.Query(query, searchTerm, genreID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var results []models.Media
	for rows.Next() {
		m, err := r.scanSeries(rows)
		if err != nil {
			return nil, 0, err
		}
		results = append(results, m)
	}
	return results, total, nil
}

func (r *seriesRepo) GetAll(limit, offset int) ([]models.Media, int, error) {
	return r.Search("", 0, limit, offset)
}

func (r *seriesRepo) Create(s *models.Media) error {
	query := `INSERT INTO medias (type, title, year, director, genre_id, poster_url) 
			  VALUES ('series', $1, $2, $3, $4, $5)`
	_, err := r.db.Exec(query, s.Title, s.Year, s.Director, s.GenreID, s.PosterURL)
	return err
}

func (r *seriesRepo) GetByID(id int) (*models.Media, error) {
	query := `SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name as genre_name, m.poster_url, m.created_at 
			  FROM medias m
			  JOIN genres g ON m.genre_id = g.id 
			  WHERE m.id=$1 AND m.type='series'`

	var m models.Media
	err := r.db.QueryRow(query, id).Scan(
		&m.ID, &m.Type, &m.Title, &m.Year, &m.Director, &m.GenreID, &m.GenreName, &m.PosterURL, &m.CreatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *seriesRepo) Update(id int, s *models.Media) error {
	// Pastikan hanya update data tipe series
	query := `UPDATE medias 
			  SET title=$1, year=$2, director=$3, genre_id=$4, poster_url=$5 
			  WHERE id=$6 AND type='series'`

	result, err := r.db.Exec(query, s.Title, s.Year, s.Director, s.GenreID, s.PosterURL, id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *seriesRepo) Delete(id int) error {
	query := `DELETE FROM medias WHERE id=$1 AND type='series'`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 { return sql.ErrNoRows }
	return nil
}