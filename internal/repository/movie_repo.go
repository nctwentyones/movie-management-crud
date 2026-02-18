package repository

import (
	"database/sql"
	"movie_crud/internal/models"
)

type MovieRepository interface {
	Create(movie *models.Media) error
	GetAll() ([]models.Media, error)
	Update(id int, movie *models.Media) error
	Delete(id int) error
	SearchByTitle(title string) ([]models.Media, error)
    GetByID(id int) (*models.Media, error)
}

type movieRepo struct {
	db *sql.DB
}

func NewMovieRepository(db *sql.DB) MovieRepository {
	return &movieRepo{db}
}

func (r *movieRepo) Create(m *models.Media) error {
	query := `INSERT INTO medias (type, title, year, director, genre_id, poster_url) 
              VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.db.Exec(query, "movie", m.Title, m.Year, m.Director, m.GenreID, m.PosterURL)
	return err
}

func (r *movieRepo) GetAll() ([]models.Media, error) {
	query := `SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name as genre_name, m.poster_url, m.created_at 
              FROM medias m
              JOIN genres g ON m.genre_id = g.id 
              WHERE m.type='movie'
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

func (r *movieRepo) GetByID(id int) (*models.Media, error) {
    query := `SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name as genre_name, m.poster_url, m.created_at 
              FROM medias m
              JOIN genres g ON m.genre_id = g.id
              WHERE m.id = $1 AND m.type='movie'`
    
    var m models.Media
    err := r.db.QueryRow(query, id).Scan(
        &m.ID, &m.Type, &m.Title, &m.Year, &m.Director, 
        &m.GenreID, &m.GenreName, &m.PosterURL, &m.CreatedAt,
    )
    if err != nil {
        return nil, err
    }
    return &m, nil
}

func (r *movieRepo) Update(id int, m *models.Media) error {
	query := `UPDATE medias 
              SET type=$1, title=$2, year=$3, director=$4, genre_id=$5, poster_url=$6 
              WHERE id=$7`
	
	result, err := r.db.Exec(query, m.Type, m.Title, m.Year, m.Director, m.GenreID, m.PosterURL, id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *movieRepo) Delete(id int) error {
	query := `DELETE FROM medias WHERE id=$1 AND type='movie'`
	
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *movieRepo) SearchByTitle(title string) ([]models.Media, error) {
	query := `SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name as genre_name, m.poster_url, m.created_at 
              FROM medias m
              JOIN genres g ON m.genre_id = g.id
              WHERE m.title ILIKE $1 AND m.type='movie'`
	
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