package repository

import (
	"database/sql"
	"movie_crud/internal/models"
)

type SeriesRepository interface {
	Create(series *models.Media) error
	GetAll() ([]models.Media, error)
	Update(id int, series *models.Media) error
	Delete(id int) error
	SearchByTitle(title string) ([]models.Media, error)
	GetByID(id int) (*models.Media, error)
}

type seriesRepo struct {
	db *sql.DB
}

func NewSeriesRepository(db *sql.DB) SeriesRepository {
	return &seriesRepo{db}
}

func (r *seriesRepo) Create(s *models.Media) error {
	query := `INSERT INTO medias (type, title, year, director, genre_id, poster_url) 
              VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.db.Exec(query, "series", s.Title, s.Year, s.Director, s.GenreID, s.PosterURL)
	return err
}

func (r *seriesRepo) GetAll() ([]models.Media, error) {
	query := `SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name as genre_name, m.poster_url, m.created_at 
              FROM medias m
              JOIN genres g ON m.genre_id = g.id 
              WHERE m.type='series' 
              ORDER BY m.created_at DESC`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.Media
	for rows.Next() {
		var m models.Media
		err := rows.Scan(&m.ID, &m.Type, &m.Title, &m.Year, &m.Director, &m.GenreID, &m.GenreName, &m.PosterURL, &m.CreatedAt)
		if err != nil {
			return nil, err
		}
		results = append(results, m)
	}
	return results, nil
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
	query := `UPDATE medias 
              SET title=$1, year=$2, director=$3, genre_id=$4, poster_url=$5 
              WHERE id=$6 AND type='series'`

	result, err := r.db.Exec(query, s.Title, s.Year, s.Director, s.GenreID, s.PosterURL, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
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

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *seriesRepo) SearchByTitle(title string) ([]models.Media, error) {
	query := `SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name as genre_name, m.poster_url, m.created_at 
              FROM medias m
              JOIN genres g ON m.genre_id = g.id
              WHERE m.title ILIKE $1 AND m.type='series'`

	searchTerm := "%" + title + "%"
	rows, err := r.db.Query(query, searchTerm)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.Media
	for rows.Next() {
		var m models.Media
		err := rows.Scan(&m.ID, &m.Type, &m.Title, &m.Year, &m.Director, &m.GenreID, &m.GenreName, &m.PosterURL, &m.CreatedAt)
		if err != nil {
			return nil, err
		}
		results = append(results, m)
	}

	return results, nil
}