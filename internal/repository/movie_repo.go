package repository

import (
	"database/sql"
	"movie_crud/internal/models"
)

type MovieRepository interface {
	Create(movie *models.Media) error
	GetAll(limit, offset int) ([]models.Media, int, error)
	Update(id int, movie *models.Media) error
	Delete(id int) error
	Search(title string, genreID int, limit, offset int) ([]models.Media, int, error)
	GetByID(id int) (*models.Media, error)
}

type movieRepo struct {
	db *sql.DB
}

func NewMovieRepository(db *sql.DB) MovieRepository {
	return &movieRepo{db}
}

// Helper SCAN (Sangat berguna untuk maintenance)
func (r *movieRepo) scanMovie(rows *sql.Rows) (models.Media, error) {
	var m models.Media
	err := rows.Scan(&m.ID, &m.Type, &m.Title, &m.Year, &m.Director, &m.GenreID, &m.GenreName, &m.PosterURL, &m.CreatedAt)
	return m, err
}

func (r *movieRepo) Search(title string, genreID int, limit, offset int) ([]models.Media, int, error) {
	var total int
	searchTerm := "%" + title + "%"

	countQuery := `
		SELECT COUNT(*) FROM medias 
		WHERE type='movie' 
		AND title ILIKE $1 
		AND ($2 = 0 OR genre_id = $2)`
	
	err := r.db.QueryRow(countQuery, searchTerm, genreID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := `
		SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name, m.poster_url, m.created_at 
		FROM medias m
		JOIN genres g ON m.genre_id = g.id 
		WHERE m.type='movie' 
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
		m, err := r.scanMovie(rows) // Pakai helper di sini
		if err != nil {
			return nil, 0, err
		}
		results = append(results, m)
	}
	return results, total, nil
}

func (r *movieRepo) GetAll(limit, offset int) ([]models.Media, int, error) {
	// Re-use logic Search supaya tidak nulis query dua kali
	return r.Search("", 0, limit, offset)
}

func (r *movieRepo) Create(m *models.Media) error {
	query := `INSERT INTO medias (type, title, year, director, genre_id, poster_url) 
			  VALUES ('movie', $1, $2, $3, $4, $5)`
	_, err := r.db.Exec(query, m.Title, m.Year, m.Director, m.GenreID, m.PosterURL)
	return err
}

func (r *movieRepo) Update(id int, m *models.Media) error {
	// Buang update 'type', tambahkan filter WHERE type='movie'
	query := `UPDATE medias 
			  SET title=$1, year=$2, director=$3, genre_id=$4, poster_url=$5 
			  WHERE id=$6 AND type='movie'`
	
	result, err := r.db.Exec(query, m.Title, m.Year, m.Director, m.GenreID, m.PosterURL, id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *movieRepo) GetByID(id int) (*models.Media, error) {
	query := `SELECT m.id, m.type, m.title, m.year, m.director, m.genre_id, g.name, m.poster_url, m.created_at 
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

func (r *movieRepo) Delete(id int) error {
	query := `DELETE FROM medias WHERE id=$1 AND type='movie'`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 { return sql.ErrNoRows }
	return nil
}